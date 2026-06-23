// Force strict mode and setup for ESM
"use strict";
import {
  AuthType
} from "./chunk-VIC4RJDL.js";
import {
  BaseDeclarativeTool,
  BaseToolInvocation,
  ToolDisplayNames,
  ToolNames
} from "./chunk-V5A63HWJ.js";
import {
  createDebugLogger
} from "./chunk-C4K3FEQ2.js";
import {
  init_esbuild_shims
} from "./chunk-A4BMJM77.js";
import {
  __name
} from "./chunk-J2S4EL5Y.js";

// packages/core/src/tools/web-search.ts
init_esbuild_shims();
var WEB_SEARCH_TIMEOUT_MS = 12e4;
var ANTHROPIC_VERSION = "2023-06-01";
var WEB_SEARCH_TOOL_TYPE = "web_search_20250305";
var WebSearchToolInvocation = class extends BaseToolInvocation {
  constructor(config, params) {
    super(params);
    this.config = config;
    this.debugLogger = createDebugLogger("WEB_SEARCH");
  }
  static {
    __name(this, "WebSearchToolInvocation");
  }
  debugLogger;
  getDescription() {
    return `Searching the web for: "${this.params.query}"`;
  }
  fail(message) {
    return {
      llmContent: `Error: ${message}`,
      returnDisplay: `Error: ${message}`,
      error: { message, type: "execution_failed" /* EXECUTION_FAILED */ }
    };
  }
  async execute(signal) {
    const cfg = this.config.getContentGeneratorConfig();
    if (!cfg || cfg.authType !== AuthType.USE_ANTHROPIC) {
      return this.fail(
        'web_search requires an Anthropic-compatible provider (security.auth.selectedType = "anthropic"). It is not available for the current provider.'
      );
    }
    const baseUrl = cfg.baseUrl?.replace(/\/+$/, "");
    const apiKey = cfg.apiKey;
    const model = cfg.model;
    if (!baseUrl || !apiKey) {
      return this.fail(
        "web_search needs a configured baseUrl and API key on the Anthropic provider."
      );
    }
    const url = `${baseUrl}/v1/messages`;
    const body = {
      model,
      max_tokens: 2048,
      tools: [{ type: WEB_SEARCH_TOOL_TYPE, name: "web_search" }],
      messages: [
        {
          role: "user",
          content: `Use the web_search tool to research: ${this.params.query}
Then give a concise, factual summary of what you found.`
        }
      ]
    };
    const controller = new AbortController();
    const onAbort = /* @__PURE__ */ __name(() => controller.abort(), "onAbort");
    signal.addEventListener("abort", onAbort, { once: true });
    const timeout = setTimeout(() => controller.abort(), WEB_SEARCH_TIMEOUT_MS);
    try {
      this.debugLogger.debug(
        `[WebSearch] POST ${url} query="${this.params.query}"`
      );
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
          "content-type": "application/json"
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        return this.fail(
          `Web search request failed: HTTP ${resp.status} ${resp.statusText} ${text.slice(0, 200)}`
        );
      }
      const data = await resp.json();
      const sources = [];
      let answer = "";
      for (const block of data.content ?? []) {
        const type = String(block["type"] ?? "");
        if (type === "web_search_tool_result" && Array.isArray(block["content"])) {
          for (const item of block["content"]) {
            if (item && item["type"] === "web_search_result" && typeof item["url"] === "string" && !sources.some((s) => s.url === item["url"])) {
              sources.push({
                title: typeof item["title"] === "string" ? item["title"] : item["url"],
                url: item["url"]
              });
            }
          }
        } else if (type === "text" && typeof block["text"] === "string") {
          answer += block["text"];
        }
      }
      answer = answer.trim();
      if (!answer && sources.length === 0) {
        return this.fail("Web search returned no usable results.");
      }
      const sourceLines = sources.map((s, i) => `${i + 1}. ${s.title} \u2014 ${s.url}`).join("\n");
      const llmContent = (answer ? `${answer}

` : "") + (sources.length ? `Sources:
${sourceLines}` : "No sources returned.");
      const displayLines = sources.map((s, i) => `  ${i + 1}. ${s.title}
     ${s.url}`).join("\n");
      const returnDisplay = `\u{1F50D} ${this.params.query}` + (answer ? `

${answer}` : "") + (sources.length ? `

\u4F86\u6E90 / Sources:
${displayLines}` : "");
      return { llmContent, returnDisplay };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return this.fail(`Web search error: ${message}`);
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
    }
  }
};
var WebSearchTool = class _WebSearchTool extends BaseDeclarativeTool {
  constructor(config) {
    super(
      _WebSearchTool.Name,
      ToolDisplayNames.WEB_SEARCH,
      'Searches the web for up-to-date information and returns a concise summary with source URLs.\n- Takes a search query (and optional max_results hint)\n- Use this for news, current events, recent data, prices, or anything past the model knowledge cutoff\n- Returns a synthesized answer plus a list of source links\n- Requires an Anthropic-compatible provider; if an MCP-provided web search tool is available (names start with "mcp__"), prefer that',
      "search" /* Search */,
      {
        properties: {
          query: {
            description: "The search query.",
            type: "string"
          },
          max_results: {
            description: "Optional hint for how many results to consider.",
            type: "number"
          }
        },
        required: ["query"],
        type: "object"
      },
      true,
      // isOutputMarkdown
      false,
      // canUpdateOutput
      false,
      // [exptech-fork] shouldDefer=false — web_search is always available (no tool_search needed)
      false,
      // alwaysLoad
      "web search query find information news current"
    );
    this.config = config;
  }
  static {
    __name(this, "WebSearchTool");
  }
  static Name = ToolNames.WEB_SEARCH;
  validateToolParamValues(params) {
    if (!params.query || params.query.trim() === "") {
      return "The 'query' parameter cannot be empty.";
    }
    if (params.max_results !== void 0 && params.max_results < 1) {
      return "The 'max_results' parameter must be at least 1.";
    }
    return null;
  }
  createInvocation(params) {
    return new WebSearchToolInvocation(this.config, params);
  }
  toAutoClassifierInput(params) {
    return { query: params.query };
  }
};

export {
  WebSearchTool
};
/**
 * @license
 * Copyright 2025 Qwen Code
 * SPDX-License-Identifier: Apache-2.0
 */
