/**
 * @license
 * Copyright 2025 Qwen Code
 * SPDX-License-Identifier: Apache-2.0
 */

// [exptech-fork] NEW FILE — in-process web_search tool. See CLAUDE.md §Fork additions.
// Performs a web search by calling the configured Anthropic-compatible endpoint
// with Anthropic's server-side web_search tool (type "web_search_20250305"),
// then returns the synthesized answer + source list. Renders as a native TUI
// tool box (it is a normal declarative tool that goes through the scheduler).

import { AuthType } from '../core/contentGenerator.js';
import type { Config } from '../config/config.js';
import { ToolErrorType } from './tool-error.js';
import type {
  ToolInvocation,
  ToolResult,
} from './tools.js';
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import { ToolNames, ToolDisplayNames } from './tool-names.js';
import { createDebugLogger, type DebugLogger } from '../utils/debugLogger.js';

const WEB_SEARCH_TIMEOUT_MS = 60000;
const ANTHROPIC_VERSION = '2023-06-01';
// Older tool-type variant; the proxies we target accept this one (the newer
// web_search_20260209 variant is not yet supported by them).
const WEB_SEARCH_TOOL_TYPE = 'web_search_20250305';

/**
 * Parameters for the WebSearch tool.
 */
export interface WebSearchToolParams {
  /** The search query. */
  query: string;
  /** Optional hint for how many results to consider. */
  max_results?: number;
}

interface WebSearchSource {
  title: string;
  url: string;
}

class WebSearchToolInvocation extends BaseToolInvocation<
  WebSearchToolParams,
  ToolResult
> {
  private readonly debugLogger: DebugLogger;

  constructor(
    private readonly config: Config,
    params: WebSearchToolParams,
  ) {
    super(params);
    this.debugLogger = createDebugLogger('WEB_SEARCH');
  }

  override getDescription(): string {
    return `Searching the web for: "${this.params.query}"`;
  }

  private fail(message: string): ToolResult {
    return {
      llmContent: `Error: ${message}`,
      returnDisplay: `Error: ${message}`,
      error: { message, type: ToolErrorType.EXECUTION_FAILED },
    };
  }

  async execute(signal: AbortSignal): Promise<ToolResult> {
    const cfg = this.config.getContentGeneratorConfig();
    if (!cfg || cfg.authType !== AuthType.USE_ANTHROPIC) {
      return this.fail(
        'web_search requires an Anthropic-compatible provider (security.auth.selectedType = "anthropic"). ' +
          'It is not available for the current provider.',
      );
    }
    const baseUrl = cfg.baseUrl?.replace(/\/+$/, '');
    const apiKey = cfg.apiKey;
    const model = cfg.model;
    if (!baseUrl || !apiKey) {
      return this.fail(
        'web_search needs a configured baseUrl and API key on the Anthropic provider.',
      );
    }

    const url = `${baseUrl}/v1/messages`;
    const body = {
      model,
      max_tokens: 2048,
      tools: [{ type: WEB_SEARCH_TOOL_TYPE, name: 'web_search' }],
      messages: [
        {
          role: 'user',
          content: `Use the web_search tool to research: ${this.params.query}\nThen give a concise, factual summary of what you found.`,
        },
      ],
    };

    // fetchWithTimeout (utils/fetch.ts) is GET-only, so do a manual POST with a
    // timeout controller chained to the tool's abort signal.
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal.addEventListener('abort', onAbort, { once: true });
    const timeout = setTimeout(() => controller.abort(), WEB_SEARCH_TIMEOUT_MS);

    try {
      this.debugLogger.debug(`[WebSearch] POST ${url} query="${this.params.query}"`);
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        return this.fail(
          `Web search request failed: HTTP ${resp.status} ${resp.statusText} ${text.slice(0, 200)}`,
        );
      }

      const data = (await resp.json()) as {
        content?: Array<Record<string, unknown>>;
      };

      const sources: WebSearchSource[] = [];
      let answer = '';
      for (const block of data.content ?? []) {
        const type = String(block['type'] ?? '');
        if (type === 'web_search_tool_result' && Array.isArray(block['content'])) {
          for (const item of block['content'] as Array<Record<string, unknown>>) {
            if (
              item &&
              item['type'] === 'web_search_result' &&
              typeof item['url'] === 'string' &&
              !sources.some((s) => s.url === item['url'])
            ) {
              sources.push({
                title:
                  typeof item['title'] === 'string'
                    ? (item['title'] as string)
                    : (item['url'] as string),
                url: item['url'] as string,
              });
            }
          }
        } else if (type === 'text' && typeof block['text'] === 'string') {
          answer += block['text'] as string;
        }
      }

      answer = answer.trim();
      if (!answer && sources.length === 0) {
        return this.fail('Web search returned no usable results.');
      }

      const sourceLines = sources
        .map((s, i) => `${i + 1}. ${s.title} — ${s.url}`)
        .join('\n');

      const llmContent =
        (answer ? `${answer}\n\n` : '') +
        (sources.length ? `Sources:\n${sourceLines}` : 'No sources returned.');

      const displayLines = sources
        .map((s, i) => `  ${i + 1}. ${s.title}\n     ${s.url}`)
        .join('\n');
      const returnDisplay =
        `🔍 ${this.params.query}` +
        (answer ? `\n\n${answer}` : '') +
        (sources.length ? `\n\n來源 / Sources:\n${displayLines}` : '');

      return { llmContent, returnDisplay };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return this.fail(`Web search error: ${message}`);
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener('abort', onAbort);
    }
  }
}

/**
 * In-process web search tool backed by the Anthropic server-side web_search tool.
 */
export class WebSearchTool extends BaseDeclarativeTool<
  WebSearchToolParams,
  ToolResult
> {
  static readonly Name: string = ToolNames.WEB_SEARCH;

  constructor(private readonly config: Config) {
    super(
      WebSearchTool.Name,
      ToolDisplayNames.WEB_SEARCH,
      'Searches the web for up-to-date information and returns a concise summary with source URLs.\n' +
        '- Takes a search query (and optional max_results hint)\n' +
        '- Use this for news, current events, recent data, prices, or anything past the model knowledge cutoff\n' +
        '- Returns a synthesized answer plus a list of source links\n' +
        '- Requires an Anthropic-compatible provider; if an MCP-provided web search tool is available (names start with "mcp__"), prefer that',
      Kind.Search,
      {
        properties: {
          query: {
            description: 'The search query.',
            type: 'string',
          },
          max_results: {
            description: 'Optional hint for how many results to consider.',
            type: 'number',
          },
        },
        required: ['query'],
        type: 'object',
      },
      true, // isOutputMarkdown
      false, // canUpdateOutput
      false, // [exptech-fork] shouldDefer=false — web_search is always available (no tool_search needed)
      false, // alwaysLoad
      'web search query find information news current',
    );
  }

  protected override validateToolParamValues(
    params: WebSearchToolParams,
  ): string | null {
    if (!params.query || params.query.trim() === '') {
      return "The 'query' parameter cannot be empty.";
    }
    if (params.max_results !== undefined && params.max_results < 1) {
      return "The 'max_results' parameter must be at least 1.";
    }
    return null;
  }

  protected createInvocation(
    params: WebSearchToolParams,
  ): ToolInvocation<WebSearchToolParams, ToolResult> {
    return new WebSearchToolInvocation(this.config, params);
  }

  override toAutoClassifierInput(
    params: WebSearchToolParams,
  ): Record<string, unknown> {
    return { query: params.query };
  }
}
