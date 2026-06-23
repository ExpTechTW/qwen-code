// Force strict mode and setup for ESM
"use strict";
import {
  escape,
  glob
} from "./chunk-MGAHPNU7.js";
import "./chunk-K5PGHDBN.js";
import "./chunk-IBYJAJJF.js";
import "./chunk-OPVLEF2Y.js";
import "./chunk-5EJ6TPWF.js";
import "./chunk-UD7BDB7J.js";
import "./chunk-CAYJPEGH.js";
import "./chunk-SQSI43GK.js";
import "./chunk-2MPVVENX.js";
import "./chunk-ZTQ26VBE.js";
import "./chunk-GZCJS5WH.js";
import "./chunk-MLZQVCF3.js";
import "./chunk-LD2XBG6Z.js";
import "./chunk-OTBK43JR.js";
import "./chunk-HGNSRCRB.js";
import {
  DEFAULT_FILE_FILTERING_OPTIONS
} from "./chunk-77WXWU44.js";
import "./chunk-PRYMDRBV.js";
import "./chunk-VIC4RJDL.js";
import "./chunk-3PJXIDKI.js";
import "./chunk-UWCTAVOD.js";
import "./chunk-OMX7CUOE.js";
import {
  getMemoryBaseDir
} from "./chunk-BNXANYLH.js";
import "./chunk-T2VDEFUU.js";
import "./chunk-XSYS2SJX.js";
import {
  BaseDeclarativeTool,
  BaseToolInvocation,
  ToolDisplayNames,
  ToolNames
} from "./chunk-V5A63HWJ.js";
import "./chunk-BGUDAULQ.js";
import "./chunk-EW6C27XX.js";
import "./chunk-22IFUCVR.js";
import "./chunk-64WXLC72.js";
import "./chunk-3UALQ56H.js";
import "./chunk-JDV3VBPY.js";
import "./chunk-CGEGHF2C.js";
import "./chunk-EJYJYJZ2.js";
import "./chunk-55ZMG67I.js";
import "./chunk-H6BD2ELD.js";
import "./chunk-5IFG2VC4.js";
import {
  createDebugLogger,
  getErrorMessage,
  isSubpath,
  resolveAndValidatePath,
  resolvePath,
  unescapePath
} from "./chunk-C4K3FEQ2.js";
import "./chunk-ZERZSAZL.js";
import "./chunk-QN5NZ3UQ.js";
import "./chunk-BR4QREVK.js";
import "./chunk-Z2Z3GUXZ.js";
import {
  init_esbuild_shims
} from "./chunk-A4BMJM77.js";
import {
  __name
} from "./chunk-J2S4EL5Y.js";

// packages/core/src/tools/glob.ts
init_esbuild_shims();
import fs from "node:fs";
import path from "node:path";
var debugLogger = createDebugLogger("GLOB");
var MAX_FILE_COUNT = 100;
function sortFileEntries(entries, nowTimestamp, recencyThresholdMs) {
  const sortedEntries = [...entries];
  sortedEntries.sort((a, b) => {
    const mtimeA = a.mtimeMs ?? 0;
    const mtimeB = b.mtimeMs ?? 0;
    const aIsRecent = nowTimestamp - mtimeA < recencyThresholdMs;
    const bIsRecent = nowTimestamp - mtimeB < recencyThresholdMs;
    if (aIsRecent && bIsRecent) {
      return mtimeB - mtimeA;
    } else if (aIsRecent) {
      return -1;
    } else if (bIsRecent) {
      return 1;
    } else {
      return a.fullpath().localeCompare(b.fullpath());
    }
  });
  return sortedEntries;
}
__name(sortFileEntries, "sortFileEntries");
var GlobToolInvocation = class extends BaseToolInvocation {
  constructor(config, params) {
    super(params);
    this.config = config;
    this.fileService = config.getFileService();
  }
  static {
    __name(this, "GlobToolInvocation");
  }
  fileService;
  getDescription() {
    let description = `'${this.params.pattern}'`;
    if (this.params.path) {
      description += ` in path '${this.params.path}'`;
    }
    return description;
  }
  /**
   * Returns 'ask' for paths outside the workspace, so that external glob
   * searches require user confirmation.
   */
  async getDefaultPermission() {
    if (!this.params.path) {
      return "allow";
    }
    const workspaceContext = this.config.getWorkspaceContext();
    const resolvedPath = resolvePath(
      this.config.getTargetDir(),
      this.params.path
    );
    if (workspaceContext.isPathWithinWorkspace(resolvedPath) || isSubpath(getMemoryBaseDir(), resolvedPath)) {
      return "allow";
    }
    return "ask";
  }
  /**
   * Runs glob search in a single directory and returns filtered entries.
   */
  async globInDirectory(searchDir, pattern, signal) {
    let effectivePattern = pattern;
    const fullPath = path.join(searchDir, effectivePattern);
    if (fs.existsSync(fullPath)) {
      effectivePattern = escape(effectivePattern);
    }
    const entries = await glob(effectivePattern, {
      cwd: searchDir,
      withFileTypes: true,
      nodir: true,
      stat: true,
      nocase: true,
      dot: true,
      follow: false,
      signal
    });
    const projectRoot = this.config.getTargetDir();
    const relativePaths = entries.map(
      (p) => path.relative(projectRoot, p.fullpath())
    );
    const { filteredPaths } = this.fileService.filterFilesWithReport(
      relativePaths,
      this.getFileFilteringOptions()
    );
    const normalizePathForComparison = /* @__PURE__ */ __name((p) => process.platform === "win32" || process.platform === "darwin" ? p.toLowerCase() : p, "normalizePathForComparison");
    const filteredAbsolutePaths = new Set(
      filteredPaths.map(
        (p) => normalizePathForComparison(path.resolve(projectRoot, p))
      )
    );
    return entries.filter(
      (entry) => filteredAbsolutePaths.has(normalizePathForComparison(entry.fullpath()))
    );
  }
  async execute(signal) {
    try {
      const searchDirs = [];
      let searchLocationDescription;
      if (this.params.path) {
        const searchDirAbs = resolveAndValidatePath(
          this.config,
          this.params.path,
          { allowExternalPaths: true }
        );
        searchDirs.push(searchDirAbs);
        searchLocationDescription = `within ${searchDirAbs}`;
      } else {
        const workspaceDirs = this.config.getWorkspaceContext().getDirectories();
        searchDirs.push(...workspaceDirs);
        searchLocationDescription = workspaceDirs.length > 1 ? `across ${workspaceDirs.length} workspace directories` : `in the workspace directory`;
      }
      const pattern = this.params.pattern;
      const allFilteredEntries = [];
      const seenPaths = /* @__PURE__ */ new Set();
      for (const searchDir of searchDirs) {
        const entries = await this.globInDirectory(searchDir, pattern, signal);
        for (const entry of entries) {
          const normalized = entry.fullpath();
          if (!seenPaths.has(normalized)) {
            seenPaths.add(normalized);
            allFilteredEntries.push(entry);
          }
        }
      }
      const filteredEntries = allFilteredEntries;
      if (!filteredEntries || filteredEntries.length === 0) {
        return {
          llmContent: `No files found matching pattern "${this.params.pattern}" ${searchLocationDescription}`,
          returnDisplay: `No files found`
        };
      }
      const oneDayInMs = 24 * 60 * 60 * 1e3;
      const nowTimestamp = (/* @__PURE__ */ new Date()).getTime();
      const sortedEntries = sortFileEntries(
        filteredEntries,
        nowTimestamp,
        oneDayInMs
      );
      const totalFileCount = sortedEntries.length;
      const fileLimit = Math.min(
        MAX_FILE_COUNT,
        this.config.getTruncateToolOutputLines()
      );
      const truncated = totalFileCount > fileLimit;
      const entriesToShow = truncated ? sortedEntries.slice(0, fileLimit) : sortedEntries;
      const sortedAbsolutePaths = entriesToShow.map(
        (entry) => entry.fullpath()
      );
      const fileListDescription = sortedAbsolutePaths.join("\n");
      let resultMessage = `Found ${totalFileCount} file(s) matching "${this.params.pattern}" ${searchLocationDescription}`;
      resultMessage += `, sorted by modification time (newest first):
---
${fileListDescription}`;
      if (truncated) {
        const omittedFiles = totalFileCount - fileLimit;
        const fileTerm = omittedFiles === 1 ? "file" : "files";
        resultMessage += `
---
[${omittedFiles} ${fileTerm} truncated] ...`;
      }
      return {
        llmContent: resultMessage,
        returnDisplay: `Found ${totalFileCount} matching file(s)${truncated ? " (truncated)" : ""}`,
        resultFilePaths: sortedAbsolutePaths
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLogger.error(`GlobLogic execute Error: ${errorMessage}`, error);
      const rawError = `Error during glob search operation: ${errorMessage}`;
      return {
        llmContent: rawError,
        returnDisplay: `Error: ${errorMessage || "An unexpected error occurred."}`,
        error: {
          message: rawError,
          type: "glob_execution_error" /* GLOB_EXECUTION_ERROR */
        }
      };
    }
  }
  getFileFilteringOptions() {
    const options = this.config.getFileFilteringOptions?.();
    return {
      respectGitIgnore: options?.respectGitIgnore ?? DEFAULT_FILE_FILTERING_OPTIONS.respectGitIgnore,
      respectQwenIgnore: options?.respectQwenIgnore ?? DEFAULT_FILE_FILTERING_OPTIONS.respectQwenIgnore
    };
  }
};
var GlobTool = class _GlobTool extends BaseDeclarativeTool {
  constructor(config) {
    super(
      _GlobTool.Name,
      ToolDisplayNames.GLOB,
      'Fast file pattern matching tool that works with any codebase size\n- Supports glob patterns like "**/*.js" or "src/**/*.ts"\n- Returns matching file paths sorted by modification time\n- Use this tool when you need to find files by name patterns\n- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead\n- You have the capability to call multiple tools in a single response. It is always better to speculatively perform multiple searches as a batch that are potentially useful.',
      "search" /* Search */,
      {
        properties: {
          pattern: {
            description: "The glob pattern to match files against",
            type: "string"
          },
          path: {
            description: 'The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.',
            type: "string"
          }
        },
        required: ["pattern"],
        type: "object"
      }
    );
    this.config = config;
  }
  static {
    __name(this, "GlobTool");
  }
  static Name = ToolNames.GLOB;
  /**
   * Validates the parameters for the tool.
   */
  validateToolParamValues(params) {
    if (!params.pattern || typeof params.pattern !== "string" || params.pattern.trim() === "") {
      return "The 'pattern' parameter cannot be empty.";
    }
    if (params.path) {
      params.path = unescapePath(params.path.trim());
      try {
        resolveAndValidatePath(this.config, params.path, {
          allowExternalPaths: true
        });
      } catch (error) {
        return getErrorMessage(error);
      }
    }
    return null;
  }
  createInvocation(params) {
    return new GlobToolInvocation(this.config, params);
  }
};
export {
  GlobTool,
  sortFileEntries
};
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
