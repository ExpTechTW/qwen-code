// Force strict mode and setup for ESM
"use strict";
import "./chunk-MGAHPNU7.js";
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
import "./chunk-77WXWU44.js";
import "./chunk-PRYMDRBV.js";
import "./chunk-VIC4RJDL.js";
import "./chunk-3PJXIDKI.js";
import "./chunk-UWCTAVOD.js";
import "./chunk-OMX7CUOE.js";
import "./chunk-BNXANYLH.js";
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
  createDebugLogger
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

// packages/core/src/tools/enterPlanMode.ts
init_esbuild_shims();
var debugLogger = createDebugLogger("ENTER_PLAN_MODE");
var enterPlanModeToolDescription = `Use this tool only after the user explicitly asks to switch into plan mode or confirms they want plan mode. Entering plan mode is a privilege reduction, so it does not require user confirmation at execution time.

## When to Use This Tool
Use this tool when the user has opted into plan mode for a task that should be read-only while the plan is formed, such as multi-file changes, design choices, or ambiguous requirements.

## When NOT to Use This Tool
Do not use this tool just because a task involves planning, is complex, or requires investigation. In the current mode, you can still think, inspect files, ask clarifying questions, and present a plan without switching modes.

## Important
If plan mode seems helpful but the user has not asked for it, ask first. Do NOT use this tool if the user has explicitly asked you not to use plan mode.`;
var enterPlanModeToolSchemaData = {
  name: "enter_plan_mode",
  description: enterPlanModeToolDescription,
  parametersJsonSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
    $schema: "http://json-schema.org/draft-07/schema#"
  }
};
var EnterPlanModeToolInvocation = class extends BaseToolInvocation {
  constructor(config, params) {
    super(params);
    this.config = config;
  }
  static {
    __name(this, "EnterPlanModeToolInvocation");
  }
  getDescription() {
    return "Enter plan mode";
  }
  /**
   * Entering plan mode lowers privileges, so it is always allowed without a
   * confirmation prompt.
   */
  async getDefaultPermission() {
    return "allow";
  }
  async execute(_signal) {
    const isAcpMode = this.config.getExperimentalZedIntegration?.() || this.config.getInputFormat?.() === "stream-json" /* STREAM_JSON */;
    if (!this.config.isInteractive() && !isAcpMode) {
      return {
        llmContent: "Cannot enter plan mode in non-interactive mode without ACP support. The gate exit paths require user interaction.",
        returnDisplay: "Plan mode unavailable in non-interactive mode."
      };
    }
    try {
      if (this.config.getApprovalMode() !== "plan" /* PLAN */) {
        this.config.setApprovalMode("plan" /* PLAN */, {
          enteredByModel: true
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLogger.error(
        `[EnterPlanModeTool] Failed to set approval mode to plan: ${errorMessage}`
      );
      return {
        llmContent: `Failed to enter plan mode: ${errorMessage}`,
        returnDisplay: `Error entering plan mode: ${errorMessage}`
      };
    }
    try {
      const registry = this.config.getToolRegistry();
      const exitPlanModeName = ToolNames.EXIT_PLAN_MODE;
      const revealedBefore = registry.isDeferredToolRevealed(exitPlanModeName);
      if (!revealedBefore) {
        registry.revealDeferredTool(exitPlanModeName);
        const geminiClient = this.config.getGeminiClient();
        if (geminiClient) {
          try {
            await geminiClient.setTools();
          } catch (setErr) {
            registry.unrevealDeferredTool(exitPlanModeName);
            debugLogger.error(
              `[EnterPlanModeTool] Failed to sync exit_plan_mode tool declaration: ${setErr instanceof Error ? setErr.message : String(setErr)}`
            );
          }
        }
      }
    } catch (error) {
      debugLogger.warn(
        `[EnterPlanModeTool] Failed to reveal exit_plan_mode: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    return {
      llmContent: "Plan mode is now active. Continue with read-only investigation, ask the user when needed, and use exit_plan_mode when the plan is ready.",
      returnDisplay: "Entered plan mode."
    };
  }
};
var EnterPlanModeTool = class _EnterPlanModeTool extends BaseDeclarativeTool {
  constructor(config) {
    super(
      _EnterPlanModeTool.Name,
      ToolDisplayNames.ENTER_PLAN_MODE,
      enterPlanModeToolDescription,
      "think" /* Think */,
      enterPlanModeToolSchemaData.parametersJsonSchema,
      true,
      // isOutputMarkdown
      false,
      // canUpdateOutput
      false,
      // shouldDefer — always visible so explicit plan-mode requests work
      false,
      // alwaysLoad
      "plan mode enter start"
    );
    this.config = config;
  }
  static {
    __name(this, "EnterPlanModeTool");
  }
  static Name = ToolNames.ENTER_PLAN_MODE;
  createInvocation(params) {
    return new EnterPlanModeToolInvocation(this.config, params);
  }
};
export {
  EnterPlanModeTool
};
/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
