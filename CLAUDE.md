# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Read [`AGENTS.md`](AGENTS.md) — it is the single source of truth for all coding conventions, build/test commands, code style, commit conventions, PR workflow, and review guidelines. All rules in AGENTS.md apply to Claude Code.**

<!-- [exptech-fork] BEGIN — ExpTech fork manual (do not remove). -->

# ExpTech fork manual

This is a fork of `QwenLM/qwen-code` maintained at `ExpTechTW/qwen-code`. It adds a
small set of features on top of upstream and is distributed via a **prebuilt
`release` branch** (not npm). The overriding rule is: **stay merge-friendly with
upstream.** Read this section before changing anything fork-specific.

## The `[exptech-fork]` rule (MANDATORY for all fork changes)

1. **Prefer new files.** If a feature can live in a new file, put it there and never touch upstream files.
2. **If an upstream file must change, keep the edit tiny (1–5 lines) and fence it:**
   ```ts
   // [exptech-fork] BEGIN <what> — see CLAUDE.md §Fork edits
   ...
   // [exptech-fork] END
   ```
   Single-line edits may use a trailing `// [exptech-fork] <what>` instead.
3. **Centralize fork constants** in `packages/cli/src/fork/fork-config.ts`. Upstream-file edits should import from it, never hardcode fork URLs/commands.
4. **Register every upstream edit in the table below.** That table + `grep -rn "\[exptech-fork\]" packages/ scripts/` is the post-merge reconciliation checklist.

## What the fork adds

- **`web_search` tool** — an in-process tool (native TUI tool box) that calls the configured Anthropic-compatible endpoint with Anthropic's server-side `web_search_20250305` tool and returns a summary + sources. Only active when `security.auth.selectedType = "anthropic"`. Makes the local `~/.qwen/web-search-mcp.mjs` MCP workaround redundant.
- **繁體中文（台灣）output** — upstream injects the output-language directive only into side queries; the fork also injects it into the **main chat**, and maps `zh-TW`/`繁體`/Traditional-Chinese inputs to an explicit "繁體中文（台灣用語）" directive so the model stops defaulting to Simplified. Fork default UI + model language = `zh-TW`. (Upstream's `zh-TW` UI locale is already complete; not rewritten.)
- **Update source** — repointed from `QwenLM/qwen-code` (npm + Aliyun OSS + QwenLM releases) to the fork's `release` branch / GitHub releases.

## New files (fork-owned, no upstream conflict)

- `packages/core/src/tools/web-search.ts` — the web_search tool.
- `packages/cli/src/fork/fork-config.ts` — all fork distribution/update constants.
- `scripts/build-release-branch.mjs` — builds + publishes the prebuilt `release` branch.

## Fork edits registry (upstream files touched — reconcile these on every merge)

| File                                               | Marker                | What / why                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core/src/tools/tool-names.ts`            | ×2                    | add `WEB_SEARCH` to `ToolNames` + `ToolDisplayNames`                                                                                                                                                                                                                                                             |
| `packages/core/src/config/config.ts`               | BEGIN/END             | `registerLazy(WEB_SEARCH …)` right after `WEB_FETCH` in `createToolRegistry`                                                                                                                                                                                                                                     |
| `packages/core/src/index.ts`                       | 1                     | export `WebSearchTool` / `WebSearchToolParams`                                                                                                                                                                                                                                                                   |
| `packages/core/src/tools/web-fetch.ts`             | import + BEGIN/END ×2 | server-side `web_fetch` fallback (proxy `web_fetch_20260209`) when client fetch is blocked (401/403/404)                                                                                                                                                                                                         |
| `packages/core/src/core/client.ts`                 | import + BEGIN/END    | `readFileSync` import; `getOutputLanguageDirective()`; inject it into `getMainSessionSystemInstruction()`                                                                                                                                                                                                        |
| `packages/cli/src/utils/languageUtils.ts`          | import + ×3           | `normalizeOutputLanguage`: map zh-TW/繁體/Traditional → explicit 繁體中文（台灣）directive; `resolveOutputLanguage`: `auto`/unset defaults to zh-TW (drops `detectSystemLanguage` import); `generateOutputLanguageFileContent`: append strict anti-Simplified + Taiwan-vocabulary clause for Traditional Chinese |
| `packages/cli/src/config/settingsSchema.ts`        | ×2                    | default `general.language` + `general.outputLanguage` → `zh-TW` (dialog default + intent; runtime default comes from `resolveOutputLanguage`)                                                                                                                                                                    |
| `packages/cli/src/config/config.ts`                | else-branch           | `outputLanguageFilePath` resolves to the global path even when the file does not exist yet, so the first-run directive is honored                                                                                                                                                                                |
| `packages/cli/src/utils/standalone-update.ts`      | import + 2            | `OSS_BASE`/`GITHUB_BASE` → `FORK_GITHUB_RELEASE_BASE`                                                                                                                                                                                                                                                            |
| `packages/cli/src/utils/installationInfo.ts`       | import + 5            | npm/pnpm/yarn/bun/sudo update commands → `FORK_INSTALL_COMMAND`                                                                                                                                                                                                                                                  |
| `packages/cli/src/ui/utils/updateCheck.ts`         | whole file            | fork-owned rewrite: check `release` branch package.json version instead of npm registry                                                                                                                                                                                                                          |
| `packages/cli/src/ui/components/BaseTextInput.tsx` | 1                     | input-field `backgroundColor` → `undefined` (was `theme.background.primary`); QwenDark bg `#0b0e14` renders as a full-width grey bar on non-truecolor terminals (e.g. electerm) — inherit the terminal background instead                                                                                        |

Note: package `name` stays `@qwen-code/qwen-code` (install is by git URL; the name is irrelevant to consumers and keeps the diff small).

## Build & release procedure

```bash
# from repo root, Node 22 LTS recommended (Node 26 has an unrelated runtime fetch issue)
node scripts/build-release-branch.mjs --push
# (runs build → bundle → prepare:package, strips dist/web-shell, packs the
#  qwen-code-fork.tgz tarball, and force-pushes an orphan `release` branch)
```

The script publishes the `release` branch with the bulky `web-shell` SPA stripped
(so `qwen serve`'s web UI is NOT in the release build — build from source if needed).

Consumers install with **no build / no patch-package**. Two paths:

```bash
# FAST (recommended) — one tarball download, NO git clone:
npm i -g https://raw.githubusercontent.com/ExpTechTW/qwen-code/release/qwen-code-fork.tgz

# git fallback — works, but npm full-clones the repo (slow):
npm i -g github:ExpTechTW/qwen-code#release
```

(`npm i -g github:ExpTechTW/qwen-code` — i.e. `main` — FAILS by design: `postinstall: patch-package` + heavy `prepare`. Never give users the bare ref.) The in-app updater (`fork-config.ts` → `FORK_INSTALL_COMMAND`) uses the FAST tarball URL.

## After merging upstream (`git merge upstream/main`)

1. Resolve conflicts.
2. `grep -rn "\[exptech-fork\]" packages/ scripts/` and reconcile against the registry table above (re-apply any edit upstream clobbered; the fence comments make them easy to spot).
3. `npm run build && npm run bundle && npm run prepare:package` then `node scripts/build-release-branch.mjs`.
4. Sanity-check: web_search tool box appears; model replies in 繁體中文（台灣）; `node scripts/check-i18n.ts` passes.

<!-- [exptech-fork] END -->
