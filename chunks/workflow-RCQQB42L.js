// Force strict mode and setup for ESM
"use strict";
import {
  AgentEventEmitter,
  FileDiscoveryService,
  GitWorktreeService,
  WorkspaceContext,
  generateAgentWorktreeSlug,
  rebuildToolRegistryOnOverride,
  resolveSavedWorkflowScript,
  stripAnsiAndControl,
  writeWorkflowSnapshot,
  writeWorktreeSessionMarker
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
import "./chunk-77WXWU44.js";
import "./chunk-PRYMDRBV.js";
import {
  WorkflowRunEvent,
  logWorkflowRun,
  read,
  writeLine
} from "./chunk-VIC4RJDL.js";
import "./chunk-3PJXIDKI.js";
import "./chunk-UWCTAVOD.js";
import "./chunk-OMX7CUOE.js";
import "./chunk-BNXANYLH.js";
import "./chunk-T2VDEFUU.js";
import {
  SyntheticOutputTool
} from "./chunk-XSYS2SJX.js";
import {
  BaseDeclarativeTool,
  BaseToolInvocation,
  ToolDisplayNames,
  ToolNames
} from "./chunk-V5A63HWJ.js";
import "./chunk-BGUDAULQ.js";
import "./chunk-EW6C27XX.js";
import "./chunk-22IFUCVR.js";
import {
  createChildAbortController
} from "./chunk-64WXLC72.js";
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

// packages/core/src/tools/workflow/workflow.ts
init_esbuild_shims();

// packages/core/src/agents/runtime/workflow-orchestrator.ts
init_esbuild_shims();
import { randomBytes } from "node:crypto";
import * as os from "node:os";

// packages/core/src/agents/runtime/workflow-sandbox.ts
init_esbuild_shims();
import * as vm from "node:vm";
function findMetaBlockBounds(source) {
  const re = /^\s*export\s+const\s+meta\s*=\s*\{/;
  const match = re.exec(source);
  if (!match) return null;
  const exportIdx = match.index;
  const startBrace = source.indexOf("{", exportIdx);
  let depth = 1;
  let i = startBrace + 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === "/" && next === "/") {
      i += 2;
      while (i < source.length && source[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/"))
        i++;
      i += 2;
      continue;
    }
    if (ch === "/" && isRegexContext(source, i)) {
      i++;
      let inClass = false;
      while (i < source.length && (inClass || source[i] !== "/") && source[i] !== "\n") {
        if (source[i] === "\\") i += 2;
        else if (source[i] === "[") {
          inClass = true;
          i++;
        } else if (source[i] === "]") {
          inClass = false;
          i++;
        } else {
          i++;
        }
      }
      i++;
      while (i < source.length && /[gimsuy]/.test(source[i])) i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      i++;
      while (i < source.length && source[i] !== q) {
        if (source[i] === "\\") i++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  if (depth !== 0) {
    throw new Error(
      "stripExportMeta: unbalanced braces in export const meta declaration \u2014 the workflow script cannot be safely stripped. Check the meta block syntax."
    );
  }
  const endBraceIncl = i - 1;
  while (i < source.length && /[\s;]/.test(source[i])) i++;
  return { exportIdx, startBrace, endBraceIncl, afterMeta: i };
}
__name(findMetaBlockBounds, "findMetaBlockBounds");
function extractAndStripMeta(source) {
  const bounds = findMetaBlockBounds(source);
  if (!bounds) return { stripped: source, meta: null };
  const metaSource = source.slice(bounds.startBrace, bounds.endBraceIncl + 1);
  const stripped = source.slice(0, bounds.exportIdx) + source.slice(bounds.afterMeta);
  const metaContext = vm.createContext(/* @__PURE__ */ Object.create(null));
  let raw;
  try {
    raw = new vm.Script(`(${metaSource})`).runInContext(metaContext);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `extractAndStripMeta: failed to evaluate meta object literal: ${msg}`
    );
  }
  rejectThenablesInMeta(raw);
  const meta = validateMeta(raw);
  return { stripped, meta };
}
__name(extractAndStripMeta, "extractAndStripMeta");
function rejectThenablesInMeta(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (value === null || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  const maybeThen = value.then;
  if (typeof maybeThen === "function") {
    try {
      value.catch(() => {
      });
    } catch {
    }
    throw new Error(
      "extractAndStripMeta: meta values must not be Promises (no async / dynamic import allowed in meta literal)"
    );
  }
  if (Array.isArray(value)) {
    for (const v of value) rejectThenablesInMeta(v, seen);
    return;
  }
  for (const v of Object.values(value)) {
    rejectThenablesInMeta(v, seen);
  }
}
__name(rejectThenablesInMeta, "rejectThenablesInMeta");
function validateMeta(value) {
  if (value === null || typeof value !== "object") {
    throw new Error("meta must be an object");
  }
  const obj = value;
  if (typeof obj["name"] !== "string" || obj["name"].length === 0) {
    throw new Error("meta.name must be a non-empty string");
  }
  if (typeof obj["description"] !== "string" || obj["description"].length === 0) {
    throw new Error("meta.description must be a non-empty string");
  }
  if (obj["whenToUse"] !== void 0 && typeof obj["whenToUse"] !== "string") {
    throw new Error("meta.whenToUse must be a string");
  }
  let phases;
  if (obj["phases"] !== void 0) {
    if (!Array.isArray(obj["phases"])) {
      throw new Error("meta.phases must be an array");
    }
    phases = [];
    for (const p of obj["phases"]) {
      if (p === null || typeof p !== "object") {
        throw new Error("meta.phases entries must be objects");
      }
      const ph = p;
      if (typeof ph["title"] !== "string" || ph["title"].length === 0) {
        throw new Error("meta.phases[].title must be a non-empty string");
      }
      const phase = {
        title: ph["title"]
      };
      if (ph["detail"] !== void 0) {
        if (typeof ph["detail"] !== "string") {
          throw new Error("meta.phases[].detail must be a string");
        }
        phase.detail = ph["detail"];
      }
      if (ph["model"] !== void 0) {
        if (typeof ph["model"] !== "string") {
          throw new Error("meta.phases[].model must be a string");
        }
        phase.model = ph["model"];
      }
      phases.push(phase);
    }
  }
  const out = {
    name: obj["name"],
    description: obj["description"]
  };
  if (obj["whenToUse"] !== void 0) {
    out.whenToUse = obj["whenToUse"];
  }
  if (phases !== void 0) {
    out.phases = phases;
  }
  return out;
}
__name(validateMeta, "validateMeta");
function isRegexContext(source, i) {
  let j = i - 1;
  while (j >= 0 && /\s/.test(source[j])) j--;
  if (j < 0) return true;
  const prev = source[j];
  return /[{[(,;:=!&|?+\-*/%^~<>]/.test(prev);
}
__name(isRegexContext, "isRegexContext");
var debugLogger = createDebugLogger("WORKFLOW");
var MAX_LOG_LINES = 1e4;
var MAX_PHASE_ENTRIES = 1e4;
var ARGS_MAX_DEPTH = 64;
var DEFAULT_MAX_WALL_CLOCK_MS = 30 * 60 * 1e3;
function resolveMaxWallClockMs(opts) {
  if (typeof opts.maxWallClockMs === "number" && opts.maxWallClockMs > 0) {
    return opts.maxWallClockMs;
  }
  const envSec = Number(process.env["QWEN_CODE_MAX_WORKFLOW_SECONDS"]);
  if (Number.isFinite(envSec) && envSec > 0) return envSec * 1e3;
  return DEFAULT_MAX_WALL_CLOCK_MS;
}
__name(resolveMaxWallClockMs, "resolveMaxWallClockMs");
function validateArgs(val, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
  if (depth > ARGS_MAX_DEPTH) {
    throw new Error(
      `WorkflowSandbox: args exceeded max nesting depth of ${ARGS_MAX_DEPTH}`
    );
  }
  if (val === null) return;
  const t = typeof val;
  if (t === "function") {
    throw new Error(
      "WorkflowSandbox: args must be JSON-serializable (functions are not allowed)."
    );
  }
  if (t === "bigint") {
    throw new Error(
      "WorkflowSandbox: args must be JSON-serializable (BigInt is not allowed \u2014 pass as string)."
    );
  }
  if (t !== "object") return;
  const obj = val;
  if (seen.has(obj)) {
    throw new Error(
      "WorkflowSandbox: args must be JSON-serializable (circular reference detected)."
    );
  }
  seen.add(obj);
  if (Array.isArray(val)) {
    for (const item of val) validateArgs(item, depth + 1, seen);
  } else {
    for (const v of Object.values(val)) {
      validateArgs(v, depth + 1, seen);
    }
  }
}
__name(validateArgs, "validateArgs");
function createWorkflowSandbox(opts) {
  const phases = [];
  const logs = [];
  const safeLog = /* @__PURE__ */ __name((msg) => {
    if (logs.length < MAX_LOG_LINES) {
      const line = String(msg);
      logs.push(line);
      try {
        opts.emitter?.logAppended?.(line);
      } catch (e) {
        debugLogger.warn("emitter.logAppended threw:", e);
      }
    } else if (logs.length === MAX_LOG_LINES) {
      logs.push(`[workflow log truncated at ${MAX_LOG_LINES} lines]`);
    }
  }, "safeLog");
  const safePhase = /* @__PURE__ */ __name((title) => {
    if (phases.length < MAX_PHASE_ENTRIES) {
      const t = String(title);
      if (phases[phases.length - 1] === t) return;
      phases.push(t);
      try {
        opts.emitter?.phaseStarted?.(t);
      } catch (e) {
        debugLogger.warn("emitter.phaseStarted threw:", e);
      }
    } else if (phases.length === MAX_PHASE_ENTRIES) {
      phases.push(
        `[workflow phases truncated at ${MAX_PHASE_ENTRIES} entries]`
      );
    }
  }, "safePhase");
  if (opts.args !== void 0) validateArgs(opts.args);
  const argsJson = opts.args === void 0 ? null : JSON.stringify(opts.args);
  const bridge = {
    argsJson,
    pushPhase: safePhase,
    pushLog: safeLog,
    lastPhase: /* @__PURE__ */ __name(() => phases[phases.length - 1], "lastPhase"),
    hostAgent: opts.dispatch,
    // PR #4947 R2 T7 (qwen-code-ci-bot): host-side log hook for reviveInRealm's
    // catch path. Mirrors the rejection-logging in settleToNullArray so an
    // operator running with debug logging can distinguish "thunk rejected"
    // (settleToNullArray.warn) from "thunk resolved to a non-JSON-serializable
    // value" (this warn). Receives only primitive strings/numbers — the bridge
    // contract forbids host objects crossing back to the script.
    logRevivalFailure: /* @__PURE__ */ __name((idx, reason) => {
      debugLogger.warn(
        `Workflow result revival failed at index ${idx}: ${reason}; slot set to null (non-JSON-serializable thunk return).`
      );
    }, "logRevivalFailure"),
    // The truthy flags distinguish "injected" from "default stub" inside the
    // init script without leaking the host function itself when not used.
    hasParallel: !!opts.parallel,
    hasPipeline: !!opts.pipeline,
    hasWorkflow: !!opts.workflow,
    hasBudget: !!opts.budget,
    hostParallel: opts.parallel,
    hostPipeline: opts.pipeline,
    hostWorkflow: opts.workflow,
    budgetTotal: opts.budget ? opts.budget.total : null,
    hostBudgetSpent: opts.budget ? opts.budget.spent.bind(opts.budget) : null,
    hostBudgetRemaining: opts.budget ? opts.budget.remaining.bind(opts.budget) : null
  };
  Object.setPrototypeOf(bridge, null);
  const sandboxGlobals = Object.assign(
    /* @__PURE__ */ Object.create(null),
    { __workflowBridge: bridge }
  );
  const ctx = vm.createContext(sandboxGlobals);
  vm.runInContext(
    `(() => {
      const __b = globalThis.__workflowBridge;
      delete globalThis.__workflowBridge;

      // --- Math (vm-realm, random throws) ---
      const realMath = Math;
      const safeMath = Object.create(null);
      for (const k of Object.getOwnPropertyNames(realMath)) {
        if (k === 'random' || k === 'constructor') continue;
        safeMath[k] = realMath[k];
      }
      safeMath.random = () => {
        throw new Error(
          'Math.random() is unavailable in workflow scripts (breaks resume). ' +
          'For N independent samples, include the index in the agent label or prompt.'
        );
      };
      globalThis.Math = safeMath;

      // --- Date (vm-realm function that throws on any access) ---
      const dateMsg = 'Date.now() / new Date() are unavailable in workflow ' +
        'scripts (breaks resume). Stamp results after the workflow returns, ' +
        'or pass timestamps via args.';
      const safeDate = function Date() { throw new Error(dateMsg); };
      safeDate.now = () => { throw new Error(dateMsg); };
      safeDate.UTC = () => { throw new Error(dateMsg); };
      safeDate.parse = () => { throw new Error(dateMsg); };
      Object.setPrototypeOf(safeDate, null);
      Object.defineProperty(safeDate, 'constructor', {
        value: undefined, writable: false, configurable: false,
      });
      globalThis.Date = safeDate;

      // --- args (parsed via vm-realm JSON \u2192 vm-realm objects/arrays) ---
      // FIX-Round1-T2: vm-realm arrays keep their vm-realm Array.prototype,
      // so for...of, .map, .forEach, spread, destructuring all work \u2014 and
      // their inherited methods' constructors are vm-realm Function, which
      // cannot reach host process.
      globalThis.args = __b.argsJson === null ? undefined : JSON.parse(__b.argsJson);

      // --- Wrap a host async function so it returns a vm-realm Promise ---
      // FIX-Round1-T1/T8/T14: success and failure both cross the boundary
      // as vm-realm values: resolve with the host's value (a primitive
      // string for dispatch; vm-realm arrays for parallel/pipeline because
      // those wrappers will produce vm-realm results); reject with a
      // freshly-constructed vm-realm Error so e.constructor.constructor
      // stays in the vm realm.
      function vmAsync(hostFn) {
        return function (...vmArgs) {
          return new Promise(function (resolve, reject) {
            try {
              const hostPromise = hostFn.apply(null, vmArgs);
              hostPromise.then(
                function (value) { resolve(value); },
                function (hostErr) {
                  const msg = (hostErr && hostErr.message != null)
                    ? String(hostErr.message)
                    : String(hostErr);
                  reject(new Error(msg));
                }
              );
            } catch (hostErr) {
              const msg = (hostErr && hostErr.message != null)
                ? String(hostErr.message)
                : String(hostErr);
              reject(new Error(msg));
            }
          });
        };
      }

      // --- phase / log ---
      globalThis.phase = function phase(title) {
        __b.pushPhase(String(title));
      };
      globalThis.log = function log(msg) {
        __b.pushLog(msg);
      };

      // --- console (object with hardened methods, all in vm-realm) ---
      const safeConsole = Object.create(null);
      safeConsole.log = function () {
        const parts = [];
        for (let i = 0; i < arguments.length; i++) parts.push(String(arguments[i]));
        __b.pushLog(parts.join(' '));
      };
      safeConsole.warn = safeConsole.log;
      safeConsole.error = safeConsole.log;
      globalThis.console = safeConsole;

      // --- agent (with runtime allowlist + named throws, all vm-realm) ---
      // FIX-Round1-T13: throw on any opts key not in the allowlist \u2014 catches
      // typos like { scema: ... } that previously slipped through the
      // [key:string]: unknown index signature.
      const KNOWN_AGENT_OPTS = ['label', 'phase', 'schema', 'model', 'isolation', 'agentType', 'stallMs'];
      globalThis.agent = vmAsync(function (prompt, agentOpts) {
        agentOpts = agentOpts || {};
        const keys = Object.keys(agentOpts);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (KNOWN_AGENT_OPTS.indexOf(k) === -1) {
            throw new Error(
              "agent({" + k + "}): unknown option. " +
              "Known options are: " + KNOWN_AGENT_OPTS.join(', ') + "."
            );
          }
        }
        // P3: schema + model + agentType + isolation are all wired through
        // createProductionDispatch \u2192 SubagentManager.createAgentHeadless.
        // The dispatch surfaces descriptive errors for "agent type not found",
        // "isolation:'remote' is not available in this build", parent-dirty
        // refuse, worktree creation failures, and StructuredOutput contract
        // violations ("completed without calling StructuredOutput after 2
        // in-conversation nudges").
        if (
          agentOpts.isolation !== undefined &&
          agentOpts.isolation !== 'worktree' &&
          agentOpts.isolation !== 'remote'
        ) {
          throw new Error(
            "agent({isolation: '" + agentOpts.isolation + "'}): unknown isolation mode. " +
            "Known modes are: 'worktree', 'remote'."
          );
        }
        if (typeof agentOpts.phase === 'string' && agentOpts.phase.length > 0) {
          if (__b.lastPhase() !== agentOpts.phase) {
            __b.pushPhase(agentOpts.phase);
          }
        }
        // SECURITY (P3 R2 self-review): user-script-controlled agentOpts
        // cross the vm/host boundary verbatim via vmAsync's hostFn.apply.
        // A Proxy / inherited-getter / non-plain object in agentOpts.schema
        // would let host-side code (SyntheticOutputTool constructor + AJV
        // compile) trigger user-controlled trap handlers that execute with
        // the host realm's full surface. Revive agentOpts through JSON
        // round-trip BEFORE crossing so the host only ever sees vm-realm
        // plain objects with vm-realm prototypes. Same mechanism that
        // makes args + parallel/pipeline results safe.
        var safeOpts;
        try {
          safeOpts = JSON.parse(JSON.stringify(agentOpts));
        } catch (e) {
          throw new Error(
            "agent() opts contain a non-JSON-serializable value: " +
            String(e && e.message != null ? e.message : e)
          );
        }
        // SECURITY (PR #4947 R1 wenshao, extended for P3): vmAsync's resolve
        // path is verbatim (no re-wrap of resolved values). Host-realm
        // strings cross the boundary harmlessly because primitives have no
        // prototype identity. But P3's schema-mode dispatch returns the
        // validated structured_output args as a host-realm OBJECT --
        // handing that to the script reopens the T1/T8/T14 escape:
        // result.constructor.constructor("return process")() would walk
        // the host Object.prototype chain to the host Function
        // constructor. Per-call JSON revival inside this vm runInContext
        // block makes the returned object carry vm-realm prototypes (same
        // mechanism as parallel/pipeline reviveInRealm and the args
        // global revival). The fallback to null on a non-serializable
        // resolve mirrors the errors-as-data convention parallel/pipeline
        // already use for individual slot failures.
        // R3 review (wenshao T3 [Suggestion]): the null fallback below is
        // a SECURITY backstop, not a contract path. In schema mode the
        // host return is the validated args of a structured_output tool
        // call -- LLM tool_call payloads are always JSON-serializable
        // (the model sends them through the OpenAI tool-call protocol
        // which serializes through JSON itself) and SyntheticOutputTool's
        // AJV validation runs over the parsed JSON, so a non-serializable
        // host return is unreachable in production schema mode. The
        // sentinel preserves the errors-as-data convention parallel /
        // pipeline already use for individual slot failures, and stays as
        // residual defense for any future dispatch path whose return
        // value isn't a tool_call payload. logRevivalFailure surfaces
        // the actionable detail (slot 0 + the error string) to operators
        // so a real trigger in production isn't silent.
        return __b.hostAgent(prompt, safeOpts).then(function (value) {
          if (value === null || typeof value !== 'object') {
            return value;
          }
          try {
            return JSON.parse(JSON.stringify(value));
          } catch (e) {
            __b.logRevivalFailure(0, String(e && e.message != null ? e.message : e));
            return null;
          }
        });
      });

      // --- parallel / pipeline ---
      // SECURITY (PR #4732 P2): the host impl resolves with a HOST-realm array.
      // vmAsync's resolve path is verbatim (it does NOT re-wrap resolved
      // values), so handing that host array to the script would reopen the
      // T1/T8/T14 escape: result.constructor.constructor('return process')()
      // walks the host Array.prototype chain to the host Function constructor.
      // We revive the array INSIDE the vm realm with JSON.parse(JSON.stringify)
      // -- the same mechanism that makes the args global safe (see the args
      // revival above) -- so the value the script sees has vm-realm prototypes
      // whose constructors can't reach host process. Agent results are JSON
      // strings (and null slots), so the round-trip is lossless for P2.
      //
      // EAD-1 (P2 self-review): revive PER-ELEMENT, not the whole array in one
      // JSON.stringify. A single slot whose VALUE is non-serializable (a thunk
      // that returns a BigInt or a circular object) must become null at its
      // index -- it must NOT throw on the whole array and destroy every sibling
      // result, which would defeat errors-as-data for return values. The outer
      // [] is built in-realm here, so the result keeps vm-realm prototypes.
      //
      // SECURITY (PR #4947 R1 wenshao): reviveInRealm MUST remain inside this
      // vm init runInContext block. JSON, Array, Object here are vm-realm
      // globals; extracting this function to a host-side utility (e.g. a
      // shared utils/jsonRevive.ts) would resolve those references against
      // the HOST realm, silently reopening the T1/T8/T14 escape that the
      // revival is designed to prevent. The textual identity to a host-side
      // util is exactly the trap.
      function reviveInRealm(hostArr) {
        const out = [];
        for (let i = 0; i < hostArr.length; i++) {
          try {
            out[i] = JSON.parse(JSON.stringify(hostArr[i]));
          } catch (e) {
            // Cross to host realm for debug logging. The bridge function
            // accepts only primitive strings/numbers; the error message is
            // coerced to a String here so no vm-realm Error object crosses.
            __b.logRevivalFailure(i, String(e?.message ?? e));
            out[i] = null;
          }
        }
        return out;
      }
      if (__b.hasParallel) {
        const callParallel = vmAsync(function (thunks) {
          return __b.hostParallel(thunks);
        });
        globalThis.parallel = function parallel(thunks) {
          return callParallel(thunks).then(reviveInRealm);
        };
      } else {
        globalThis.parallel = function parallel() {
          return new Promise(function (_, reject) {
            reject(new Error(
              'parallel() is unavailable: this sandbox was created without a ' +
              'parallel implementation. The orchestrator injects one; a bare ' +
              'sandbox has no concurrent-dispatch capability.'
            ));
          });
        };
      }
      if (__b.hasPipeline) {
        const callPipeline = vmAsync(function (items) {
          const stages = [];
          for (let i = 1; i < arguments.length; i++) stages.push(arguments[i]);
          return __b.hostPipeline.apply(null, [items].concat(stages));
        });
        globalThis.pipeline = function pipeline() {
          return callPipeline.apply(null, arguments).then(reviveInRealm);
        };
      } else {
        globalThis.pipeline = function pipeline() {
          return new Promise(function (_, reject) {
            reject(new Error(
              'pipeline() is unavailable: this sandbox was created without a ' +
              'pipeline implementation. The orchestrator injects one; a bare ' +
              'sandbox has no staggered multi-stage capability.'
            ));
          });
        };
      }
      // --- workflow (nested, single-level) ---
      // Mirrors agent(): args cross vm\u2192host verbatim (safe direction), the
      // single result is revived back into the vm realm via JSON round-trip
      // (same T1/T8/T14 escape defense as agent / parallel / pipeline). The
      // host impl resolves a saved workflow and runs it sharing this run's
      // agent-count cap + token budget. When __b.hasWorkflow is false, the
      // sandbox is either bare (no resolver wired) OR is itself a nested
      // workflow \u2014 in both cases workflow() must throw, which is how the
      // single-level nesting limit is enforced (a nested sandbox is created
      // without a workflow impl, so its workflow() lands in the else branch).
      if (__b.hasWorkflow) {
        const callWorkflow = vmAsync(function (nameOrRef, wfArgs) {
          // Sanitize args through a JSON round-trip BEFORE crossing so the
          // host only ever sees vm-realm plain objects (same defense as
          // agent()'s safeOpts). nameOrRef may be a string or {scriptPath}.
          var safeRef;
          var safeArgs;
          try {
            safeRef = nameOrRef === undefined
              ? undefined
              : JSON.parse(JSON.stringify(nameOrRef));
            safeArgs = wfArgs === undefined
              ? undefined
              : JSON.parse(JSON.stringify(wfArgs));
          } catch (e) {
            throw new Error(
              'workflow() received a non-JSON-serializable argument: ' +
              String(e && e.message != null ? e.message : e)
            );
          }
          return __b.hostWorkflow(safeRef, safeArgs).then(function (value) {
            if (value === null || typeof value !== 'object') {
              return value;
            }
            try {
              return JSON.parse(JSON.stringify(value));
            } catch (e) {
              __b.logRevivalFailure(0, String(e && e.message != null ? e.message : e));
              return null;
            }
          });
        });
        globalThis.workflow = function workflow(nameOrRef, wfArgs) {
          return callWorkflow(nameOrRef, wfArgs);
        };
      } else {
        globalThis.workflow = function workflow() {
          return new Promise(function (_, reject) {
            reject(new Error(
              "workflow() is unavailable here. Either this sandbox was created " +
              "without a saved-workflow resolver, or this script is already " +
              "running as a nested workflow \u2014 workflow() nesting is limited to " +
              "a single level (a workflow cannot call another workflow that " +
              "itself calls workflow())."
            ));
          });
        };
      }

      // --- budget ---
      const safeBudget = Object.create(null);
      Object.defineProperty(safeBudget, 'total', {
        value: __b.budgetTotal,
        writable: false, configurable: false,
      });
      if (__b.hasBudget) {
        Object.defineProperty(safeBudget, 'spent', {
          value: function spent() { return __b.hostBudgetSpent(); },
          writable: false, configurable: false,
        });
        Object.defineProperty(safeBudget, 'remaining', {
          value: function remaining() { return __b.hostBudgetRemaining(); },
          writable: false, configurable: false,
        });
      } else {
        Object.defineProperty(safeBudget, 'spent', {
          value: function spent() {
            throw new Error(
              'budget.spent() is not supported in P1. Token tracking is scheduled for P5.'
            );
          },
          writable: false, configurable: false,
        });
        Object.defineProperty(safeBudget, 'remaining', {
          value: function remaining() {
            throw new Error(
              'budget.remaining() is not supported in P1. Token tracking is scheduled for P5.'
            );
          },
          writable: false, configurable: false,
        });
      }
      globalThis.budget = safeBudget;
    })();`,
    ctx,
    { filename: "workflow-sandbox-init.js" }
  );
  const maxWallClockMs = resolveMaxWallClockMs(opts);
  let extractedMeta = null;
  return {
    async run(scriptSource) {
      const { stripped, meta } = extractAndStripMeta(scriptSource);
      extractedMeta = meta;
      const wrapped = `(async () => {
${stripped}
})()`;
      const script = new vm.Script(wrapped, {
        filename: "workflow.js"
      });
      const runOpts = {
        timeout: 3e4
      };
      const result = script.runInContext(ctx, runOpts);
      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
          opts.abortOnTimeout?.abort();
          reject(
            new Error(
              `Workflow execution timed out after ${maxWallClockMs} ms wall clock. Override via SandboxOptions.maxWallClockMs or QWEN_CODE_MAX_WORKFLOW_SECONDS env var.`
            )
          );
        }, maxWallClockMs);
        timer.unref?.();
      });
      try {
        return await Promise.race([result, timeoutPromise]);
      } finally {
        if (timer !== void 0) clearTimeout(timer);
      }
    },
    getPhases: /* @__PURE__ */ __name(() => [...phases], "getPhases"),
    getLogs: /* @__PURE__ */ __name(() => [...logs], "getLogs"),
    getMeta: /* @__PURE__ */ __name(() => extractedMeta, "getMeta")
  };
}
__name(createWorkflowSandbox, "createWorkflowSandbox");

// packages/core/src/agents/runtime/workflow-budget.ts
init_esbuild_shims();
var debugLogger2 = createDebugLogger("WORKFLOW_BUDGET");
var MAX_TOKENS_PER_WORKFLOW_ENV = "QWEN_CODE_MAX_TOKENS_PER_WORKFLOW";
var HARD_MAX_TOKENS_CEILING = 1e8;
function resolveMaxTokensPerWorkflow(env = process.env) {
  const raw = env[MAX_TOKENS_PER_WORKFLOW_ENV];
  if (raw === void 0 || raw.trim() === "") {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    debugLogger2.warn(
      `Invalid ${MAX_TOKENS_PER_WORKFLOW_ENV}=${JSON.stringify(raw)}, treating as unset (no cap)`
    );
    return null;
  }
  if (parsed > HARD_MAX_TOKENS_CEILING) {
    debugLogger2.warn(
      `${MAX_TOKENS_PER_WORKFLOW_ENV}=${parsed} exceeds hard ceiling (${HARD_MAX_TOKENS_CEILING}); clamping.`
    );
    return HARD_MAX_TOKENS_CEILING;
  }
  return parsed;
}
__name(resolveMaxTokensPerWorkflow, "resolveMaxTokensPerWorkflow");
var WorkflowBudgetImpl = class _WorkflowBudgetImpl {
  static {
    __name(this, "WorkflowBudgetImpl");
  }
  total;
  _spent;
  constructor(total) {
    this.total = total;
    this._spent = 0;
  }
  spent() {
    return this._spent;
  }
  remaining() {
    if (this.total === null) return Infinity;
    return Math.max(0, this.total - this._spent);
  }
  /**
   * Host-side increment. NOT exposed to the script — the
   * `WorkflowBudget` interface deliberately omits any setter so a
   * malicious workflow cannot inflate / deflate the budget. Only the
   * orchestrator (in `countedDispatch`) calls this after a dispatch
   * resolves with the agent's output token count.
   *
   * Non-positive deltas are silently dropped (some dispatches return
   * `output_tokens: 0` on early failures); negative deltas would be a
   * caller bug and are also dropped rather than silently rewinding
   * the counter.
   */
  recordSpent(deltaTokens) {
    if (!Number.isFinite(deltaTokens) || deltaTokens <= 0) return;
    this._spent += deltaTokens;
  }
  /**
   * Factory: build a budget from the current environment. Convenience
   * over `new WorkflowBudgetImpl(resolveMaxTokensPerWorkflow(env))`.
   */
  static fromEnv(env = process.env) {
    return new _WorkflowBudgetImpl(resolveMaxTokensPerWorkflow(env));
  }
};
var WorkflowBudgetExceededError = class extends Error {
  static {
    __name(this, "WorkflowBudgetExceededError");
  }
  name = "WorkflowBudgetExceededError";
  runId;
  budgetTotal;
  spent;
  constructor(runId, budgetTotal, spent) {
    super(
      `Workflow ${runId} exceeded the token budget (${spent} / ${budgetTotal} output tokens spent).`
    );
    this.runId = runId;
    this.budgetTotal = budgetTotal;
    this.spent = spent;
  }
};

// packages/core/src/agents/runtime/workflow-stall.ts
init_esbuild_shims();
var DEFAULT_STALL_MS = 6e4;
var MAX_STALL_ATTEMPTS = 3;
var MAX_WORKFLOW_STALL_MS_ENV = "QWEN_CODE_WORKFLOW_STALL_SECONDS";
function resolveStallMs(perCall, env = process.env) {
  if (typeof perCall === "number" && Number.isFinite(perCall)) {
    if (perCall === 0) return 0;
    if (perCall > 0) return perCall;
  }
  const raw = env[MAX_WORKFLOW_STALL_MS_ENV];
  if (raw !== void 0 && raw.trim() !== "") {
    const sec = Number(raw);
    if (Number.isFinite(sec) && sec > 0) return sec * 1e3;
    if (sec === 0) return 0;
  }
  return DEFAULT_STALL_MS;
}
__name(resolveStallMs, "resolveStallMs");
var debugLogger3 = createDebugLogger("WORKFLOW_STALL");
function attachStallWatchdog(emitter, controller, stallMs) {
  if (stallMs <= 0) {
    return { stalled: /* @__PURE__ */ __name(() => false, "stalled"), dispose: /* @__PURE__ */ __name(() => {
    }, "dispose") };
  }
  let inFlightTools = 0;
  let fired = false;
  let timer;
  let disposed = false;
  const clear = /* @__PURE__ */ __name(() => {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
  }, "clear");
  const arm = /* @__PURE__ */ __name(() => {
    clear();
    if (disposed || fired) return;
    if (inFlightTools > 0) return;
    timer = setTimeout(() => {
      if (disposed || fired) return;
      fired = true;
      debugLogger3.warn(
        `[Workflow] agent dispatch stalled \u2014 no progress for ${stallMs}ms; aborting.`
      );
      try {
        controller.abort("stalled");
      } catch (e) {
        debugLogger3.warn("stall watchdog abort threw:", e);
      }
    }, stallMs);
    if (typeof timer.unref === "function") {
      timer.unref();
    }
  }, "arm");
  const onActivity = /* @__PURE__ */ __name(() => arm(), "onActivity");
  const onToolCall = /* @__PURE__ */ __name(() => {
    inFlightTools += 1;
    clear();
  }, "onToolCall");
  const onToolResult = /* @__PURE__ */ __name(() => {
    inFlightTools = Math.max(0, inFlightTools - 1);
    arm();
  }, "onToolResult");
  emitter.on("round_start" /* ROUND_START */, onActivity);
  emitter.on("round_end" /* ROUND_END */, onActivity);
  emitter.on("stream_text" /* STREAM_TEXT */, onActivity);
  emitter.on("usage_metadata" /* USAGE_METADATA */, onActivity);
  emitter.on("tool_call" /* TOOL_CALL */, onToolCall);
  emitter.on("tool_result" /* TOOL_RESULT */, onToolResult);
  return {
    stalled: /* @__PURE__ */ __name(() => fired, "stalled"),
    dispose: /* @__PURE__ */ __name(() => {
      if (disposed) return;
      disposed = true;
      clear();
      emitter.off("round_start" /* ROUND_START */, onActivity);
      emitter.off("round_end" /* ROUND_END */, onActivity);
      emitter.off("stream_text" /* STREAM_TEXT */, onActivity);
      emitter.off("usage_metadata" /* USAGE_METADATA */, onActivity);
      emitter.off("tool_call" /* TOOL_CALL */, onToolCall);
      emitter.off("tool_result" /* TOOL_RESULT */, onToolResult);
    }, "dispose")
  };
}
__name(attachStallWatchdog, "attachStallWatchdog");
async function runStallResilient(attemptFn, opts) {
  const { stallMs, signal, label } = opts;
  if (stallMs <= 0) {
    const emitter = new AgentEventEmitter();
    return attemptFn(signal ?? new AbortController().signal, emitter);
  }
  let attempt = 0;
  for (; ; ) {
    attempt += 1;
    const controller = new AbortController();
    let onParentAbort;
    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        onParentAbort = /* @__PURE__ */ __name(() => controller.abort(signal.reason), "onParentAbort");
        signal.addEventListener("abort", onParentAbort);
      }
    }
    const emitter = new AgentEventEmitter();
    const watchdog = attachStallWatchdog(emitter, controller, stallMs);
    try {
      return await attemptFn(controller.signal, emitter);
    } catch (err) {
      if (signal?.aborted) throw err;
      if (watchdog.stalled() && attempt < MAX_STALL_ATTEMPTS) {
        debugLogger3.warn(
          `[Workflow] agent "${label ?? "workflow-agent"}" stalled (attempt ${attempt}/${MAX_STALL_ATTEMPTS}) \u2014 retrying.`
        );
        continue;
      }
      if (watchdog.stalled()) {
        throw new Error(
          `agent "${label ?? "workflow-agent"}" stalled on all ${MAX_STALL_ATTEMPTS} attempts (no progress for ${stallMs}ms each).`
        );
      }
      throw err;
    } finally {
      watchdog.dispose();
      if (onParentAbort && signal) {
        signal.removeEventListener("abort", onParentAbort);
      }
    }
  }
}
__name(runStallResilient, "runStallResilient");

// packages/core/src/agents/runtime/workflow-journal.ts
init_esbuild_shims();
import { createHash } from "node:crypto";
var debugLogger4 = createDebugLogger("WORKFLOW_JOURNAL");
var JOURNAL_KEY_VERSION = "v2";
function canonicalizeAgentOpts(opts) {
  const projected = {};
  for (const k of ["schema", "model", "isolation", "agentType"]) {
    const v = opts[k];
    if (v === void 0 || typeof v === "function") continue;
    projected[k] = v;
  }
  const sortDeep = /* @__PURE__ */ __name((val) => {
    if (typeof val === "function") return void 0;
    if (Array.isArray(val)) return val.map(sortDeep);
    if (val && typeof val === "object") {
      const out = {};
      for (const key of Object.keys(val).sort()) {
        if (key === "__proto__") continue;
        out[key] = sortDeep(val[key]);
      }
      return out;
    }
    return val;
  }, "sortDeep");
  try {
    return JSON.stringify(sortDeep(projected));
  } catch {
    return "{}";
  }
}
__name(canonicalizeAgentOpts, "canonicalizeAgentOpts");
function deriveAgentKey(prefixHash, prompt, opts) {
  const hash = createHash("sha256");
  hash.update(prefixHash);
  hash.update("\0");
  hash.update(prompt);
  hash.update("\0");
  hash.update(canonicalizeAgentOpts(opts));
  return `${JOURNAL_KEY_VERSION}:${hash.digest("hex")}`;
}
__name(deriveAgentKey, "deriveAgentKey");
function deriveArgsSeed(args) {
  const hash = createHash("sha256");
  let serialized;
  try {
    serialized = JSON.stringify(args ?? null) ?? "null";
  } catch {
    serialized = "non-serializable-args";
  }
  hash.update(serialized);
  return `${JOURNAL_KEY_VERSION}:${hash.digest("hex")}`;
}
__name(deriveArgsSeed, "deriveArgsSeed");
function buildReplay(entries) {
  const results = /* @__PURE__ */ new Map();
  const started = /* @__PURE__ */ new Map();
  for (const e of entries) {
    if (e.type === "result") {
      results.set(e.key, e);
    } else if (e.type === "started") {
      const list = started.get(e.key);
      if (list) list.push(e);
      else started.set(e.key, [e]);
    }
  }
  return { results, started };
}
__name(buildReplay, "buildReplay");
var WorkflowJournal = class {
  constructor(path2) {
    this.path = path2;
  }
  static {
    __name(this, "WorkflowJournal");
  }
  /** Load + parse all entries into replay maps. Empty maps if no file. */
  async load() {
    try {
      const entries = await read(this.path);
      return buildReplay(entries);
    } catch (e) {
      debugLogger4.warn(`WorkflowJournal.load failed for ${this.path}: ${e}`);
      return { results: /* @__PURE__ */ new Map(), started: /* @__PURE__ */ new Map() };
    }
  }
  /** Append one entry. Rejects only on I/O error (callers `.catch`). */
  append(entry) {
    return writeLine(this.path, entry);
  }
};

// packages/core/src/agents/runtime/workflow-prompts.ts
init_esbuild_shims();
var WORKFLOW_SUBAGENT_SYSTEM_PROMPT = 'You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.\nCRITICAL: Your final text response is returned **verbatim** as a string to the calling script \u2014 it is your return value, not a message to a human.\n- Output the literal result (data, JSON, text). Do NOT output confirmations like "Done." or "Sent."\n- If asked for JSON, return ONLY the raw JSON \u2014 no code fences, no prose, no markdown.\n- Do NOT use SendUserMessage to deliver your answer. Put your answer in your final text response.\n- Be concise. The script will parse your output.';
var WORKFLOW_SUBAGENT_SYSTEM_PROMPT_WITH_SCHEMA = "You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.\nCRITICAL: You MUST deliver your final answer by calling the `structured_output` tool with arguments that conform to its parameter schema. Plain-text final answers are DISCARDED \u2014 only a valid `structured_output` call returns a result to the calling script.\n- Use other tools (Read, Grep, etc.) to gather information first.\n- When ready, call `structured_output` ONCE with the conforming JSON object.\n- If validation fails, the error tells you what to fix. Try again with corrected fields.\n- After two failed attempts, the run terminates \u2014 get the arguments right.\n- Do NOT use SendUserMessage to deliver your answer.\n- Be concise; the script reads only the structured payload, not your prose.";

// packages/core/src/utils/concurrencyLimiter.ts
init_esbuild_shims();
function abortError() {
  return new DOMException("Concurrency limiter aborted.", "AbortError");
}
__name(abortError, "abortError");
function createConcurrencyLimiter(limit, signal) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error(
      `Concurrency limit must be a positive integer, got ${String(limit)}.`
    );
  }
  let active = 0;
  const queue = [];
  const pump = /* @__PURE__ */ __name(() => {
    while (active < limit && queue.length > 0) {
      const job = queue.shift();
      if (signal?.aborted) {
        job.reject(abortError());
        continue;
      }
      active++;
      Promise.resolve().then(job.thunk).then(job.resolve, job.reject).finally(() => {
        active--;
        pump();
      });
    }
  }, "pump");
  const run = /* @__PURE__ */ __name((thunk) => new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    queue.push({
      thunk,
      resolve,
      reject
    });
    pump();
  }), "run");
  if (signal && !signal.aborted) {
    signal.addEventListener(
      "abort",
      () => {
        while (queue.length > 0) queue.shift().reject(abortError());
      },
      { once: true }
    );
  }
  return { run };
}
__name(createConcurrencyLimiter, "createConcurrencyLimiter");

// packages/core/src/agents/runtime/workflow-orchestrator.ts
var DEFAULT_MAX_AGENTS_PER_RUN = 1e3;
var MAX_WORKFLOW_AGENTS_ENV = "QWEN_CODE_MAX_WORKFLOW_AGENTS";
var HARD_MAX_AGENTS_PER_RUN_CEILING = 1e4;
function resolveMaxAgentsPerRun(env = process.env) {
  const raw = env[MAX_WORKFLOW_AGENTS_ENV];
  if (raw === void 0 || raw.trim() === "") {
    return DEFAULT_MAX_AGENTS_PER_RUN;
  }
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    debugLogger.warn(
      `Invalid ${MAX_WORKFLOW_AGENTS_ENV}=${JSON.stringify(raw)}, using default (${DEFAULT_MAX_AGENTS_PER_RUN})`
    );
    return DEFAULT_MAX_AGENTS_PER_RUN;
  }
  if (parsed > HARD_MAX_AGENTS_PER_RUN_CEILING) {
    debugLogger.warn(
      `${MAX_WORKFLOW_AGENTS_ENV}=${parsed} exceeds hard ceiling (${HARD_MAX_AGENTS_PER_RUN_CEILING}); clamping.`
    );
    return HARD_MAX_AGENTS_PER_RUN_CEILING;
  }
  return parsed;
}
__name(resolveMaxAgentsPerRun, "resolveMaxAgentsPerRun");
var MAX_WORKFLOW_CONCURRENCY_ENV = "QWEN_CODE_MAX_WORKFLOW_CONCURRENCY";
var HARD_MAX_CONCURRENCY_CEILING = 64;
function resolveConcurrencyLimit(env = process.env) {
  const raw = env[MAX_WORKFLOW_CONCURRENCY_ENV];
  if (raw !== void 0 && raw.trim() !== "") {
    const parsed = Number(raw);
    if (Number.isInteger(parsed) && parsed >= 1) {
      if (parsed > HARD_MAX_CONCURRENCY_CEILING) {
        debugLogger.warn(
          `${MAX_WORKFLOW_CONCURRENCY_ENV}=${parsed} exceeds hard ceiling (${HARD_MAX_CONCURRENCY_CEILING}); clamping.`
        );
        return HARD_MAX_CONCURRENCY_CEILING;
      }
      return parsed;
    }
    debugLogger.warn(
      `Invalid ${MAX_WORKFLOW_CONCURRENCY_ENV}=${JSON.stringify(raw)}, using cpu-derived default`
    );
  }
  return Math.max(1, Math.min(16, os.cpus().length - 2));
}
__name(resolveConcurrencyLimit, "resolveConcurrencyLimit");
var WORKFLOW_SUBAGENT_MAX_TURNS = 50;
var WORKFLOW_SUBAGENT_MAX_TIME_MINUTES = 10;
var WORKFLOW_SUBAGENT_DISALLOWED_TOOLS = [
  ToolNames.SEND_MESSAGE,
  ToolNames.EXIT_PLAN_MODE
];
var WorkflowExecutionError = class extends Error {
  constructor(message, phases, logs, meta = null) {
    super(message);
    this.phases = phases;
    this.logs = logs;
    this.meta = meta;
  }
  static {
    __name(this, "WorkflowExecutionError");
  }
  name = "WorkflowExecutionError";
};
function generateRunId() {
  return `wf_${randomBytes(8).toString("hex")}`;
}
__name(generateRunId, "generateRunId");
function sanitizeForErrorMessage(value) {
  return stripAnsiAndControl(value);
}
__name(sanitizeForErrorMessage, "sanitizeForErrorMessage");
function createProductionDispatch(config, signal, onTokens) {
  return async (prompt, opts) => {
    const stallMs = resolveStallMs(
      typeof opts.stallMs === "number" ? opts.stallMs : void 0
    );
    return runStallResilient(
      (attemptSignal, emitter) => runSingleDispatch(config, prompt, opts, attemptSignal, emitter, onTokens),
      {
        stallMs,
        signal,
        label: typeof opts.label === "string" ? opts.label : void 0
      }
    );
  };
}
__name(createProductionDispatch, "createProductionDispatch");
async function runSingleDispatch(config, prompt, opts, attemptSignal, emitter, onTokens) {
  const { AgentHeadless, ContextState } = await import("./agent-headless-ST7YVQ62.js");
  const ctx = new ContextState();
  ctx.set("task_prompt", prompt);
  if (opts.agentType === void 0 && opts.model === void 0 && opts.isolation === void 0 && opts.schema === void 0) {
    const subagent = await AgentHeadless.create(
      opts.label ?? "workflow-agent",
      config,
      {
        systemPrompt: WORKFLOW_SUBAGENT_SYSTEM_PROMPT,
        initialMessages: []
      },
      {},
      // T11 (PR #4732 R1): bound resource ceiling so a single agent() call
      // cannot loop the model indefinitely. Without this, runConfig was {}
      // and the loop guards never tripped — combined with the cancellation
      // bug below, workflows were effectively unkillable.
      {
        max_turns: WORKFLOW_SUBAGENT_MAX_TURNS,
        max_time_minutes: WORKFLOW_SUBAGENT_MAX_TIME_MINUTES
      },
      // T11 (PR #4732 R1): disallow SendMessage / ExitPlanMode to align with
      // upstream Tg8 — closes the back-channel that would let a subagent
      // deliver its answer via user message instead of the script's read.
      { tools: ["*"], disallowedTools: WORKFLOW_SUBAGENT_DISALLOWED_TOOLS },
      // P-stall: the stall-watchdog emitter observes reasoning-loop events
      // (round/tool/usage) to detect a hang and abort `attemptSignal`.
      emitter
    );
    try {
      await subagent.execute(ctx, attemptSignal);
    } finally {
      reportTokens(subagent, opts, onTokens);
    }
    const mode = subagent.getTerminateMode();
    if (mode !== "GOAL" /* GOAL */) {
      throw new Error(
        `Workflow subagent did not complete (terminate mode: ${mode}).`
      );
    }
    return subagent.getFinalText();
  }
  return runOverridePath(config, ctx, opts, attemptSignal, onTokens, emitter);
}
__name(runSingleDispatch, "runSingleDispatch");
function reportTokens(subagent, opts, onTokens) {
  if (!onTokens) return;
  try {
    const summary = subagent.getExecutionSummary();
    onTokens(summary.outputTokens, opts);
  } catch (e) {
    debugLogger.warn("onTokens callback threw:", e);
  }
}
__name(reportTokens, "reportTokens");
async function runOverridePath(config, ctx, opts, signal, onTokens, emitter) {
  if (opts.isolation === "remote") {
    throw new Error(
      "agent({isolation:'remote'}) is not available in this build."
    );
  }
  const subagentMgr = config.getSubagentManager();
  let baseConfig;
  if (opts.agentType !== void 0) {
    const resolved = await subagentMgr.findSubagentByName(opts.agentType);
    if (!resolved) {
      const safeAgentType = sanitizeForErrorMessage(opts.agentType);
      throw new Error(
        `agent({agentType}): agent type '${safeAgentType}' not found.`
      );
    }
    baseConfig = resolved;
  } else {
    baseConfig = {
      name: opts.label ?? "workflow-agent",
      description: "Default workflow subagent (per-call overrides).",
      systemPrompt: WORKFLOW_SUBAGENT_SYSTEM_PROMPT,
      level: "session",
      isBuiltin: false
    };
  }
  let schemaSystemPrompt;
  if (opts.schema !== void 0) {
    schemaSystemPrompt = opts.agentType !== void 0 && baseConfig.systemPrompt ? `${baseConfig.systemPrompt}

${WORKFLOW_SUBAGENT_SYSTEM_PROMPT_WITH_SCHEMA}` : WORKFLOW_SUBAGENT_SYSTEM_PROMPT_WITH_SCHEMA;
  }
  let schemaTools;
  if (opts.schema !== void 0 && baseConfig.tools && baseConfig.tools.length > 0 && !baseConfig.tools.includes("*") && !baseConfig.tools.includes(ToolNames.STRUCTURED_OUTPUT)) {
    schemaTools = [...baseConfig.tools, ToolNames.STRUCTURED_OUTPUT];
  }
  const augmented = {
    ...baseConfig,
    ...opts.model !== void 0 ? { model: opts.model } : {},
    ...schemaSystemPrompt !== void 0 ? { systemPrompt: schemaSystemPrompt } : {},
    ...schemaTools !== void 0 ? { tools: schemaTools } : {},
    disallowedTools: Array.from(
      /* @__PURE__ */ new Set([
        ...baseConfig.disallowedTools ?? [],
        ...WORKFLOW_SUBAGENT_DISALLOWED_TOOLS
      ])
    )
  };
  let worktreeIsolation = null;
  let effectiveContext = config;
  if (opts.isolation === "worktree") {
    worktreeIsolation = await provisionWorkflowWorktree(config);
    effectiveContext = createWorktreeConfigOverride(
      config,
      worktreeIsolation.path
    );
  }
  let onParentAbort;
  try {
    let schemaState = null;
    if (opts.schema !== void 0) {
      effectiveContext = await createSchemaConfigOverride(
        effectiveContext,
        opts.schema
      );
      schemaState = createSchemaModeState();
    }
    let dispatchSignal = signal;
    if (schemaState) {
      const child = new AbortController();
      if (signal) {
        if (signal.aborted) {
          child.abort(signal.reason);
        } else {
          onParentAbort = /* @__PURE__ */ __name(() => child.abort(signal.reason), "onParentAbort");
          signal.addEventListener("abort", onParentAbort);
        }
      }
      schemaState.abortController = child;
      dispatchSignal = child.signal;
    }
    const eventEmitter = emitter ?? (schemaState ? new AgentEventEmitter() : void 0);
    if (schemaState && eventEmitter) {
      attachSchemaListeners(eventEmitter, schemaState);
    }
    const { subagent, dispose } = await subagentMgr.createAgentHeadless(
      augmented,
      effectiveContext,
      {
        // Workflow always bounds resource ceiling regardless of agentType's
        // own runConfig / maxTurns — these are workflow-level safety bounds,
        // not subagent-level preferences. P5 will refine via budget.
        runConfigOverrides: {
          max_turns: WORKFLOW_SUBAGENT_MAX_TURNS,
          max_time_minutes: WORKFLOW_SUBAGENT_MAX_TIME_MINUTES
        },
        eventEmitter
      }
    );
    try {
      try {
        await subagent.execute(ctx, dispatchSignal);
      } finally {
        reportTokens(subagent, opts, onTokens);
      }
      if (schemaState) {
        if (schemaState.result !== null) {
          if (worktreeIsolation) {
            const isolation = worktreeIsolation;
            worktreeIsolation = null;
            const preserved = await cleanupWorkflowWorktree(isolation);
            if (preserved) {
              debugLogger.info(
                `[Workflow] Schema-mode subagent preserved worktree at ${preserved.path ?? "(directory removed)"} on branch ${preserved.branch}. The structured payload is returned verbatim; recover the work from the preserved path / branch.`
              );
            }
          }
          return schemaState.result;
        }
        if (signal?.aborted) {
          throw new DOMException("Workflow aborted.", "AbortError");
        }
        const mode2 = subagent.getTerminateMode();
        if (mode2 !== "GOAL" /* GOAL */ && mode2 !== "CANCELLED" /* CANCELLED */) {
          throw new Error(
            `Workflow subagent did not complete (terminate mode: ${mode2}).`
          );
        }
        if (schemaState.attempts > 2) {
          throw new Error(
            "subagent completed without calling StructuredOutput (after 2 in-conversation nudges)."
          );
        }
        throw new Error(
          "subagent completed without calling structured_output (no validation attempt \u2014 model produced plain-text content)."
        );
      }
      const mode = subagent.getTerminateMode();
      if (mode !== "GOAL" /* GOAL */) {
        throw new Error(
          `Workflow subagent did not complete (terminate mode: ${mode}).`
        );
      }
      let finalText = subagent.getFinalText();
      if (worktreeIsolation) {
        const isolation = worktreeIsolation;
        worktreeIsolation = null;
        const preserved = await cleanupWorkflowWorktree(isolation);
        if (preserved && typeof finalText === "string") {
          finalText = appendWorktreePreservedSuffix(finalText, preserved);
        }
      }
      return finalText;
    } finally {
      await dispose();
    }
  } finally {
    if (onParentAbort && signal) {
      signal.removeEventListener("abort", onParentAbort);
    }
    if (worktreeIsolation) {
      try {
        await cleanupWorkflowWorktree(worktreeIsolation);
      } catch (error) {
        debugLogger.warn(
          `Workflow worktree cleanup in fallback finally failed for ${worktreeIsolation.path}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }
}
__name(runOverridePath, "runOverridePath");
async function provisionWorkflowWorktree(config) {
  const cwd = config.getTargetDir();
  if (/\.qwen[\\/]worktrees[\\/]/.test(cwd)) {
    throw new Error(
      `agent({isolation:'worktree'}): parent is already inside a worktree (${cwd}). Nested isolation worktrees are not supported \u2014 the subagent's inherited paths would still reference the outer worktree.`
    );
  }
  const probe = new GitWorktreeService(cwd);
  const gitCheck = await probe.checkGitAvailable();
  if (!gitCheck.available) {
    throw new Error(
      `agent({isolation:'worktree'}): ${gitCheck.error ?? "git is not available"}.`
    );
  }
  if (!await probe.isGitRepository()) {
    throw new Error(
      `agent({isolation:'worktree'}): ${cwd} is not a git repository.`
    );
  }
  const projectRoot = await probe.getRepoTopLevel() ?? cwd;
  const wtService = projectRoot === cwd ? probe : new GitWorktreeService(projectRoot);
  let parentDirty = false;
  try {
    parentDirty = await wtService.hasWorktreeChanges(projectRoot);
  } catch (error) {
    debugLogger.warn(
      `[Workflow] hasWorktreeChanges failed at ${projectRoot}: ${error}`
    );
    parentDirty = true;
  }
  if (parentDirty) {
    throw new Error(
      `agent({isolation:'worktree'}): parent working tree at ${projectRoot} has uncommitted changes that would not propagate into the isolated worktree. The subagent would see the prior HEAD instead of the current state. Commit or stash the changes, then re-run.`
    );
  }
  const slug = generateAgentWorktreeSlug();
  let parentBranch;
  try {
    parentBranch = await wtService.getCurrentBranch();
  } catch (error) {
    debugLogger.warn(
      `[Workflow] getCurrentBranch failed at ${projectRoot}: ${error}`
    );
  }
  const created = await wtService.createUserWorktree(slug, parentBranch, {
    symlinkDirectories: config.getWorktreeSymlinkDirectories()
  });
  if (!created.success || !created.worktree) {
    throw new Error(
      `agent({isolation:'worktree'}): failed to create worktree: ${created.error ?? "unknown error"}.`
    );
  }
  try {
    await writeWorktreeSessionMarker(
      created.worktree.path,
      config.getSessionId()
    );
  } catch (error) {
    debugLogger.warn(
      `[Workflow] failed to write session marker at ${created.worktree.path}: ${error}`
    );
  }
  return {
    slug,
    path: created.worktree.path,
    branch: created.worktree.branch,
    repoRoot: projectRoot
  };
}
__name(provisionWorkflowWorktree, "provisionWorkflowWorktree");
function createWorktreeConfigOverride(base, wtPath) {
  const ov = Object.create(base);
  ov.targetDir = wtPath;
  ov.cwd = wtPath;
  ov.getTargetDir = () => wtPath;
  ov.getCwd = () => wtPath;
  ov.getWorkingDir = () => wtPath;
  ov.getProjectRoot = () => wtPath;
  const wtFileService = new FileDiscoveryService(wtPath);
  ov.fileDiscoveryService = wtFileService;
  ov.getFileService = () => wtFileService;
  const wtWorkspace = new WorkspaceContext(wtPath);
  ov.workspaceContext = wtWorkspace;
  ov.getWorkspaceContext = () => wtWorkspace;
  return ov;
}
__name(createWorktreeConfigOverride, "createWorktreeConfigOverride");
async function cleanupWorkflowWorktree(isolation) {
  const wtService = new GitWorktreeService(isolation.repoRoot);
  const [hasChanges, hasUnmerged] = await Promise.all([
    wtService.hasWorktreeChanges(isolation.path).catch((error) => {
      debugLogger.warn(
        `[Workflow] hasWorktreeChanges failed for ${isolation.path}: ${error}`
      );
      return true;
    }),
    wtService.hasUnmergedWorktreeCommits(isolation.slug).catch((error) => {
      debugLogger.warn(
        `[Workflow] hasUnmergedWorktreeCommits failed for ${isolation.slug}: ${error}`
      );
      return true;
    })
  ]);
  if (hasChanges || hasUnmerged) {
    debugLogger.info(
      `[Workflow] Preserving isolation worktree ${isolation.path} (branch ${isolation.branch}, hasChanges=${hasChanges}, hasUnmerged=${hasUnmerged})`
    );
    return { path: isolation.path, branch: isolation.branch };
  }
  try {
    const result = await wtService.removeUserWorktree(isolation.slug, {
      deleteBranch: true
    });
    if (!result.success) {
      debugLogger.warn(
        `[Workflow] Failed to remove ephemeral worktree ${isolation.path}: ${result.error}`
      );
      return { path: isolation.path, branch: isolation.branch };
    }
    if (result.branchPreserved) {
      debugLogger.warn(
        `[Workflow] Removed worktree directory ${isolation.path} but kept branch ${isolation.branch} (unmerged commits at delete time)`
      );
      return { branch: isolation.branch };
    }
  } catch (error) {
    debugLogger.warn(
      `[Workflow] Failed to remove ephemeral worktree ${isolation.path}: ${error}`
    );
    return { path: isolation.path, branch: isolation.branch };
  }
  return null;
}
__name(cleanupWorkflowWorktree, "cleanupWorkflowWorktree");
function appendWorktreePreservedSuffix(finalText, preserved) {
  const sep = finalText.endsWith("\n") ? "\n" : "\n\n";
  if (preserved.path) {
    return `${finalText}${sep}[worktree preserved: ${preserved.path} (branch ${preserved.branch})]`;
  }
  return `${finalText}${sep}[worktree directory removed; branch ${preserved.branch} preserved \u2014 recover with \`git worktree add <path> ${preserved.branch}\`]`;
}
__name(appendWorktreePreservedSuffix, "appendWorktreePreservedSuffix");
function createSchemaModeState() {
  return {
    result: null,
    attempts: 0,
    pendingArgs: /* @__PURE__ */ new Map(),
    abortController: new AbortController()
  };
}
__name(createSchemaModeState, "createSchemaModeState");
function attachSchemaListeners(emitter, state) {
  const targetTool = ToolNames.STRUCTURED_OUTPUT;
  emitter.on("tool_call" /* TOOL_CALL */, (evt) => {
    if (evt.name !== targetTool) return;
    state.pendingArgs.set(evt.callId, evt.args);
  });
  emitter.on("tool_result" /* TOOL_RESULT */, (evt) => {
    if (evt.name !== targetTool) return;
    const args = state.pendingArgs.get(evt.callId);
    state.pendingArgs.delete(evt.callId);
    if (evt.success) {
      if (args !== void 0 && state.result === null) {
        state.result = args;
        state.abortController.abort();
      }
      return;
    }
    state.attempts += 1;
    if (state.attempts > 2 && state.result === null) {
      state.abortController.abort();
    }
  });
}
__name(attachSchemaListeners, "attachSchemaListeners");
async function createSchemaConfigOverride(base, schema) {
  const override = Object.create(base);
  await rebuildToolRegistryOnOverride(override, base);
  const registry = override.getToolRegistry();
  registry.registerTool(new SyntheticOutputTool(schema));
  return override;
}
__name(createSchemaConfigOverride, "createSchemaConfigOverride");
var WorkflowOrchestrator = class {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }
  static {
    __name(this, "WorkflowOrchestrator");
  }
  async run(req) {
    const runId = req.runId ?? generateRunId();
    const maxAgents = resolveMaxAgentsPerRun();
    const signal = req.abortOnTimeout?.signal;
    const limiter = createConcurrencyLimiter(resolveConcurrencyLimit(), signal);
    let agentCount = 0;
    const emitter = req.emitter;
    const budget = req.budget;
    const journal = req.journal;
    const replay = req.resumeReplay;
    let prefixHash = deriveArgsSeed(req.args);
    let hadMiss = false;
    let journalAgentId = 0;
    const countedDispatch = /* @__PURE__ */ __name((prompt, opts) => {
      let journalKey;
      let journalEntryId;
      if (journal) {
        journalKey = deriveAgentKey(prefixHash, prompt, opts);
        prefixHash = journalKey;
        if (!hadMiss && replay) {
          const cached = replay.results.get(journalKey);
          if (cached !== void 0) {
            const respawns = replay.started.get(journalKey);
            if (respawns && respawns.length > 0) {
              debugLogger.info(
                `[Workflow] resume cache hit after ${respawns.length} prior respawn(s) for runId=${runId}.`
              );
            }
            const label2 = typeof opts.label === "string" ? opts.label : void 0;
            try {
              emitter?.agentDispatched?.(label2);
            } catch (e) {
              debugLogger.warn("emitter.agentDispatched threw:", e);
            }
            try {
              emitter?.agentCompleted?.(label2);
            } catch (e) {
              debugLogger.warn("emitter.agentCompleted threw:", e);
            }
            return Promise.resolve(cached.result);
          }
        }
        hadMiss = true;
        journalEntryId = String(journalAgentId += 1);
        journal.append({ type: "started", key: journalKey, agentId: journalEntryId }).catch(
          (e) => debugLogger.warn(`journal started-append failed: ${e}`)
        );
      }
      if (budget && budget.total !== null && budget.remaining() <= 0) {
        debugLogger.warn(
          `[Workflow] budget gate refused dispatch at entry: runId=${runId} spent=${budget.spent()} total=${budget.total}`
        );
        return Promise.reject(
          new WorkflowBudgetExceededError(runId, budget.total, budget.spent())
        );
      }
      agentCount += 1;
      if (agentCount > maxAgents) {
        return Promise.reject(
          new Error(
            `Workflow exceeded the maximum of ${maxAgents} agent() calls per run.`
          )
        );
      }
      const label = typeof opts.label === "string" ? opts.label : void 0;
      try {
        emitter?.agentDispatched?.(label);
      } catch (e) {
        debugLogger.warn("emitter.agentDispatched threw:", e);
      }
      return limiter.run(() => {
        if (budget && budget.total !== null && budget.remaining() <= 0) {
          debugLogger.warn(
            `[Workflow] budget gate refused dispatch at slot-acquire: runId=${runId} spent=${budget.spent()} total=${budget.total}`
          );
          throw new WorkflowBudgetExceededError(
            runId,
            budget.total,
            budget.spent()
          );
        }
        return this.dispatch(prompt, opts);
      }).then(
        (result) => {
          try {
            emitter?.agentCompleted?.(label);
          } catch (e) {
            debugLogger.warn("emitter.agentCompleted threw:", e);
          }
          if (journal && journalKey !== void 0) {
            journal.append({
              type: "result",
              key: journalKey,
              agentId: journalEntryId ?? "",
              result
            }).catch(
              (e) => debugLogger.warn(`journal result-append failed: ${e}`)
            );
          }
          if (budget) {
            try {
              emitter?.budgetUpdated?.(budget.spent(), budget.total);
            } catch (e) {
              debugLogger.warn("emitter.budgetUpdated threw:", e);
            }
          }
          return result;
        },
        (err) => {
          const msg = err instanceof Error ? err.message : String(err);
          try {
            emitter?.agentCompleted?.(label, msg);
          } catch (e) {
            debugLogger.warn("emitter.agentCompleted threw:", e);
          }
          if (budget) {
            try {
              emitter?.budgetUpdated?.(budget.spent(), budget.total);
            } catch (e) {
              debugLogger.warn("emitter.budgetUpdated threw:", e);
            }
          }
          throw err;
        }
      );
    }, "countedDispatch");
    const parallelImpl = makeParallelImpl(signal);
    const pipelineImpl = makePipelineImpl(signal);
    const resolveSavedWorkflow = req.resolveSavedWorkflow;
    const workflowImpl = resolveSavedWorkflow ? async (nameOrRef, nestedArgs) => {
      const resolved = await resolveSavedWorkflow(nameOrRef);
      const nestedSandbox = createWorkflowSandbox({
        args: nestedArgs,
        dispatch: countedDispatch,
        parallel: parallelImpl,
        pipeline: pipelineImpl,
        abortOnTimeout: req.abortOnTimeout,
        emitter,
        budget
        // No `workflow` — single-level nesting limit.
      });
      return nestedSandbox.run(resolved.script);
    } : void 0;
    const sandbox = createWorkflowSandbox({
      args: req.args,
      dispatch: countedDispatch,
      parallel: parallelImpl,
      pipeline: pipelineImpl,
      workflow: workflowImpl,
      abortOnTimeout: req.abortOnTimeout,
      emitter,
      budget
    });
    try {
      const result = await sandbox.run(req.script);
      return {
        runId,
        result,
        phases: sandbox.getPhases(),
        logs: sandbox.getLogs(),
        meta: sandbox.getMeta()
      };
    } catch (err) {
      throw new WorkflowExecutionError(
        extractErrorMessage(err),
        sandbox.getPhases(),
        sandbox.getLogs(),
        sandbox.getMeta()
      );
    }
  }
};
async function settleToNullArray(thunks, signal, kind = "parallel") {
  const settled = await Promise.allSettled(
    thunks.map((t) => Promise.resolve().then(t))
  );
  if (signal?.aborted)
    throw new DOMException("Workflow run aborted.", "AbortError");
  let budgetDropped = 0;
  const result = settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const reason = r.reason;
    if (reason?.name === "WorkflowBudgetExceededError") {
      budgetDropped += 1;
    } else {
      debugLogger.warn(
        `Workflow thunk at index ${i} rejected: ${String(reason?.message ?? r.reason)}`
      );
    }
    return null;
  });
  if (budgetDropped > 0) {
    debugLogger.warn(
      `${kind}: ${budgetDropped} slot${budgetDropped === 1 ? "" : "s"} dropped \u2014 token budget exceeded.`
    );
  }
  return result;
}
__name(settleToNullArray, "settleToNullArray");
function makeParallelImpl(signal) {
  return (thunks) => {
    if (!Array.isArray(thunks)) {
      return Promise.reject(
        new Error(
          "parallel() expects an array of thunks (functions returning promises)."
        )
      );
    }
    for (const t of thunks) {
      if (typeof t !== "function") {
        return Promise.reject(
          new Error(
            "parallel() expects an array of functions, not values \u2014 wrap each call: parallel([() => agent(...), () => agent(...)])."
          )
        );
      }
    }
    return settleToNullArray(thunks, signal);
  };
}
__name(makeParallelImpl, "makeParallelImpl");
function makePipelineImpl(signal) {
  return (items, ...stages) => {
    if (!Array.isArray(items)) {
      return Promise.reject(
        new Error(
          "pipeline() expects an array of items as its first argument."
        )
      );
    }
    for (const s of stages) {
      if (typeof s !== "function") {
        return Promise.reject(
          new Error(
            "pipeline() stages must be functions: pipeline(items, item => ..., result => ...)."
          )
        );
      }
    }
    const chains = items.map(
      (item, idx) => () => runPipelineChain(item, idx, stages)
    );
    return settleToNullArray(chains, signal, "pipeline");
  };
}
__name(makePipelineImpl, "makePipelineImpl");
async function runPipelineChain(item, idx, stages) {
  let prev = item;
  for (const stage of stages) {
    if (prev === null) break;
    prev = await stage(prev, item, idx);
  }
  return prev;
}
__name(runPipelineChain, "runPipelineChain");
function extractErrorMessage(err) {
  if (err && typeof err === "object" && "message" in err) {
    const m = err.message;
    if (typeof m === "string") return m;
    return String(m);
  }
  return String(err);
}
__name(extractErrorMessage, "extractErrorMessage");

// packages/core/src/tools/workflow/workflow.ts
import { randomBytes as randomBytes2 } from "node:crypto";
import * as path from "node:path";
var WORKFLOW_PARAM_SCHEMA = {
  type: "object",
  properties: {
    script: {
      type: "string",
      description: "JavaScript source of the workflow. Wrapped as an async IIFE. May call the injected globals `phase(title)`, `log(msg)`, `agent(prompt, opts?)`, and read `args`. agent() opts: `{ label?, phase?, schema?, model?, agentType?, isolation? }`. `schema` (JSON Schema object): the subagent must deliver its result by calling `structured_output` with arguments matching the schema; agent() resolves to the validated object. Two failed attempts produce a terminal error \"subagent completed without calling StructuredOutput (after 2 in-conversation nudges)\". `agentType` (string): resolves against the declarative-agents registry (`.qwen/agents/<name>.md`, project then user then built-in). Unresolved names throw \"agent({agentType}): agent type 'X' not found\". `model` (string): per-call model override; routes provider correctly via the subagent runtime view. `isolation`: `'worktree'` provisions a fresh git worktree under `<projectRoot>/.qwen/worktrees/agent-<7hex>`; the worktree is auto-removed if no changes, otherwise the path and branch are returned alongside the result. `'remote'` throws \"agent({isolation:'remote'}) is not available in this build\" (parity with upstream). isolation=worktree refuses to run when the parent working tree has uncommitted changes (the subagent would see a stale HEAD). Workflow subagents always have SendMessage / ExitPlanMode in their disallowed-tool floor regardless of agentType. Concurrency: `parallel([() => agent(...), ...])` runs thunks through a shared per-run window (default `max(1, min(16, cpus-2))` agents in flight; override via `QWEN_CODE_MAX_WORKFLOW_CONCURRENCY`) and resolves to a position-aligned array \u2014 a thunk that throws, or resolves to a non-JSON-serializable value, becomes `null` at its index (errors-as-data); parallel() itself rejects only on invalid arguments or abort. `pipeline(items, ...stages)` runs each item through the stages (staggered, no inter-stage barrier); a stage that throws, returns `null`, or returns a non-JSON-serializable value drops that item to `null`. Pass THUNKS to parallel, not eager calls: `parallel([() => agent(...)])`, not `parallel([agent(...)])`. At most 1000 agent() calls per run (override via `QWEN_CODE_MAX_WORKFLOW_AGENTS`). `Date.now()` and `Math.random()` both throw \u2014 workflow scripts must be deterministic for resume. `export const meta = {...}` declarations are stripped before execution."
    },
    scriptPath: {
      type: "string",
      description: "Optional. Absolute path to a saved workflow `.js` file to load and run instead of inline `script`. Primarily set by the `/<name>` saved-workflow slash command. Provide exactly ONE of `script` or `scriptPath`. The file is read at execution time, so edits to a saved workflow take effect on the next run."
    },
    args: {
      description: "Optional structured value bound to the `args` global. Pass actual JSON, not a stringified value."
    },
    resumeFromRunId: {
      type: "string",
      description: "Optional. Resume a prior workflow run by id (e.g. wf_abc123\u2026). Re-runs the SAME script; agent() calls whose rolling prefix-hash (prompt + opts, chained in call order) matches a journaled result are served from cache for the longest unchanged prefix, and the first changed/missing call onward runs live. Pass the same script and args as the original run for the cache to apply."
    }
  }
  // `script` is required UNLESS `scriptPath` is supplied; this XOR can't be
  // expressed as a plain `required` list, so it's enforced in
  // `validateToolParamValues`. Inline authoring (the LLM path) should always
  // pass `script`; the `scriptPath` property description states the XOR.
};
var WorkflowToolInvocation = class extends BaseToolInvocation {
  constructor(config, toolOptions, params) {
    super(params);
    this.config = config;
    this.toolOptions = toolOptions;
  }
  static {
    __name(this, "WorkflowToolInvocation");
  }
  getDescription() {
    if (this.params.scriptPath && this.params.script === void 0) {
      return `Run saved workflow (${path.basename(this.params.scriptPath)})`;
    }
    return `Run a workflow script (${this.params.script?.length ?? 0} chars)`;
  }
  toolLocations() {
    return [];
  }
  getDefaultPermission() {
    return Promise.resolve("ask");
  }
  async execute(signal, updateOutput, _shellExecutionConfig) {
    const dispatchController = createChildAbortController(signal);
    const budget = WorkflowBudgetImpl.fromEnv();
    const dispatch = this.toolOptions.dispatch ?? createProductionDispatch(
      this.config,
      dispatchController.signal,
      // P5 T3: production-dispatch onTokens callback. Test-injected
      // dispatches (`toolOptions.dispatch`) handle their own
      // recording — they don't surface stats the same way.
      (outputTokens) => budget.recordSpent(outputTokens)
    );
    const orchestrator = new WorkflowOrchestrator(dispatch);
    let resolvedScript = this.params.script ?? "";
    let resolvedScriptPath = this.params.scriptPath;
    if (this.params.scriptPath && this.params.script === void 0) {
      const loaded = await resolveSavedWorkflowScript(
        { scriptPath: this.params.scriptPath },
        this.config
      );
      resolvedScript = loaded.script;
      resolvedScriptPath = loaded.scriptPath;
    }
    const runId = this.params.resumeFromRunId ?? `wf_${randomBytes2(8).toString("hex")}`;
    let journal;
    let resumeReplay;
    const storage = this.config.storage;
    if (storage) {
      journal = new WorkflowJournal(storage.getWorkflowRunJournalPath(runId));
      if (this.params.resumeFromRunId) {
        resumeReplay = await journal.load();
      }
    }
    const registry = this.config.getWorkflowRunRegistry?.();
    const registryEntry = registry?.register({
      runId,
      meta: null,
      // populated after meta parses; safe default until then
      status: "running",
      startTime: Date.now(),
      outputFile: "",
      // P4b reserves the field but doesn't materialize
      abortController: dispatchController,
      // P5: seed the cap so the dialog can render the `M / N` form
      // immediately, before the first `budgetUpdated` fires. Stays
      // `null` when no env override.
      tokenBudgetTotal: budget.total,
      // P7b: carry the script source so a completed run can be snapshotted
      // to disk and saved to `.qwen/workflows/<name>.js` from the dialog.
      // `scriptPath` is set when the run was launched from a saved file (run
      // provenance for the snapshot).
      script: resolvedScript,
      scriptPath: resolvedScriptPath
    });
    const emitter = {
      phaseStarted: /* @__PURE__ */ __name((title) => {
        registry?.onPhaseStarted(runId, title);
        safeEmitUpdate(updateOutput, registryEntry);
      }, "phaseStarted"),
      agentDispatched: /* @__PURE__ */ __name(() => {
        registry?.onAgentDispatched(runId);
        safeEmitUpdate(updateOutput, registryEntry);
      }, "agentDispatched"),
      agentCompleted: /* @__PURE__ */ __name(() => {
        registry?.onAgentCompleted(runId);
      }, "agentCompleted"),
      logAppended: /* @__PURE__ */ __name(() => {
      }, "logAppended"),
      budgetUpdated: /* @__PURE__ */ __name((spent, total) => {
        registry?.onBudgetUpdated(runId, spent, total);
        safeEmitUpdate(updateOutput, registryEntry);
      }, "budgetUpdated")
    };
    try {
      const outcome = await orchestrator.run({
        script: resolvedScript,
        args: this.params.args,
        abortOnTimeout: dispatchController,
        runId,
        emitter,
        budget,
        // P-nested: resolve `workflow('<name>')` / `workflow({scriptPath})`
        // against the saved-workflow scripts in `.qwen/workflows/`.
        resolveSavedWorkflow: /* @__PURE__ */ __name((ref) => resolveSavedWorkflowScript(ref, this.config), "resolveSavedWorkflow"),
        // P6: resume journal (always wired) + replay maps (resume only).
        journal,
        resumeReplay
      });
      if (registryEntry) {
        registryEntry.meta = outcome.meta;
        if (outcome.meta?.name && registryEntry.description === runId) {
          registryEntry.description = outcome.meta.name;
        }
      }
      registry?.setRecentLogs(runId, outcome.logs);
      registry?.complete(runId, outcome.result, Date.now());
      const usageBanner = resolveUsageBanner(
        this.config,
        registry,
        budget.total
      );
      const llmText = safeStringifyResult(outcome.result);
      const displayJson = safeStringifyDisplayPayload({
        runId: outcome.runId,
        ...outcome.meta ? { meta: outcome.meta } : {},
        phases: outcome.phases,
        logs: outcome.logs,
        result: outcome.result,
        // P5: surface the per-run token total in the terminal display so
        // the user sees actual usage even without opening the dialog.
        // P5 R1 (#11): align with `buildLivePhaseTreeDisplay` — include
        // tokens whenever ANY usage is reported OR a cap is set, not
        // only when spend > 0. A capped-but-zero-spend run still wants
        // the cap visible so the user sees the gate engaged.
        ...budget.spent() > 0 || budget.total !== null ? {
          tokens: {
            spent: budget.spent(),
            total: budget.total
          }
        } : {}
      });
      return {
        llmContent: [{ text: llmText }],
        returnDisplay: usageBanner + "```json\n" + displayJson + "\n```"
      };
    } catch (err) {
      const message = extractErrorMessage2(err);
      const phases = err instanceof WorkflowExecutionError ? err.phases : void 0;
      const logs = err instanceof WorkflowExecutionError ? err.logs : void 0;
      const meta = err instanceof WorkflowExecutionError ? err.meta : void 0;
      if (registryEntry) {
        if (meta && !registryEntry.meta) registryEntry.meta = meta;
      }
      if (logs) registry?.setRecentLogs(runId, logs);
      if (signal.aborted) {
        registry?.cancel(runId, Date.now());
      } else {
        registry?.fail(runId, message, Date.now());
      }
      const display = phases || logs || meta ? `Workflow failed: ${message}

${safeStringifyDisplayPayload({
        ...meta ? { meta } : {},
        phases: phases ?? [],
        logs: logs ?? []
      })}` : `Workflow failed: ${message}`;
      return {
        llmContent: [{ text: `Workflow failed: ${message}` }],
        returnDisplay: display,
        // FIX-10 (REUSE-I1): use the standard ToolErrorType.EXECUTION_FAILED
        // code so error routing / dashboards can classify workflow failures
        // the same way as other execution-time tool errors.
        error: { message, type: "execution_failed" /* EXECUTION_FAILED */ }
      };
    } finally {
      dispatchController.abort();
      if (registryEntry && registryEntry.status !== "running") {
        await writeWorkflowSnapshot(this.config, registryEntry);
        try {
          logWorkflowRun(
            this.config,
            new WorkflowRunEvent({
              status: registryEntry.status,
              agents_dispatched: registryEntry.agentsDispatched,
              agents_completed: registryEntry.agentsCompleted,
              phase_count: registryEntry.phases.length,
              tokens_spent: registryEntry.tokensSpent,
              duration_ms: (registryEntry.endTime ?? registryEntry.startTime) - registryEntry.startTime
            })
          );
        } catch {
        }
      }
    }
  }
};
function buildLivePhaseTreeDisplay(entry) {
  const payload = {
    runId: entry.runId,
    ...entry.meta ? { meta: entry.meta } : {},
    status: entry.status,
    currentPhase: entry.currentPhase,
    phases: entry.phases,
    agentsDispatched: entry.agentsDispatched,
    agentsCompleted: entry.agentsCompleted
  };
  if (entry.tokensSpent > 0 || entry.tokenBudgetTotal !== null) {
    payload["tokens"] = {
      spent: entry.tokensSpent,
      total: entry.tokenBudgetTotal
    };
  }
  try {
    return "```json\n" + JSON.stringify(payload, null, 2) + "\n```";
  } catch {
    return `Workflow ${entry.runId} \u2014 ${entry.status} \u2014 ${entry.phases.length} phase(s)`;
  }
}
__name(buildLivePhaseTreeDisplay, "buildLivePhaseTreeDisplay");
function resolveUsageBanner(config, registry, budgetTotal) {
  if (!registry) return "";
  if (config.getSkipWorkflowUsageWarning?.()) return "";
  if (!registry.shouldShowUsageWarning()) return "";
  return buildUsageBanner(budgetTotal);
}
__name(resolveUsageBanner, "resolveUsageBanner");
function buildUsageBanner(total) {
  if (total === null) {
    return `> Workflows have no per-run token cap. Set \`${MAX_TOKENS_PER_WORKFLOW_ENV}=<n>\` (env) for a soft cap. Suppress this notice with \`skipWorkflowUsageWarning: true\` in settings.

`;
  }
  return `> Workflow token cap is ${total} (per \`${MAX_TOKENS_PER_WORKFLOW_ENV}\`). Suppress this notice with \`skipWorkflowUsageWarning: true\` in settings.

`;
}
__name(buildUsageBanner, "buildUsageBanner");
function safeEmitUpdate(updateOutput, entry) {
  if (!updateOutput || !entry) return;
  try {
    updateOutput(buildLivePhaseTreeDisplay(entry));
  } catch {
  }
}
__name(safeEmitUpdate, "safeEmitUpdate");
function safeStringifyResult(result) {
  if (result === void 0) return "(workflow returned no value)";
  if (typeof result === "string") return result;
  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return `(workflow returned a non-JSON-serializable value of type ${typeof result})`;
  }
}
__name(safeStringifyResult, "safeStringifyResult");
function safeStringifyDisplayPayload(payload) {
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    if (payload && typeof payload === "object") {
      const sanitized = {};
      for (const [key, value] of Object.entries(payload)) {
        try {
          JSON.stringify(value);
          sanitized[key] = value;
        } catch {
          sanitized[key] = `(non-JSON-serializable value of type ${typeof value})`;
        }
      }
      try {
        return JSON.stringify(sanitized, null, 2);
      } catch {
      }
    }
    return "(display payload not JSON-serializable)";
  }
}
__name(safeStringifyDisplayPayload, "safeStringifyDisplayPayload");
function extractErrorMessage2(err) {
  if (err && typeof err === "object" && "message" in err) {
    const m = err.message;
    if (typeof m === "string") return m;
    return String(m);
  }
  return String(err);
}
__name(extractErrorMessage2, "extractErrorMessage");
var WorkflowTool = class extends BaseDeclarativeTool {
  constructor(config, toolOptions = {}) {
    super(
      ToolNames.WORKFLOW,
      ToolDisplayNames.WORKFLOW,
      "Execute a workflow script that orchestrates subagents. Supports `phase`, `log`, sequential `agent`, concurrent fan-out via `parallel(thunks)` / `pipeline(items, ...stages)` (default `max(1, min(16, cpus-2))` agents in flight per run, up to 1000 agents total; both env-overridable), per-call `agent({ schema, agentType, model, isolation: 'worktree' })` for structured-output contracts, declarative-agent selection, model override, and git-worktree-isolated subagents. Pass `resumeFromRunId` to resume a prior run \u2014 agent() calls whose rolling prefix-hash matches the journal are served from cache for the longest unchanged prefix. Runs are tracked in the background-tasks view and the `/workflows` dialog (live phase tree, token usage, cancel). Scripts run in a node:vm sandbox without access to the filesystem or shell; all I/O happens through the spawned agents.",
      "other" /* Other */,
      WORKFLOW_PARAM_SCHEMA,
      /* isOutputMarkdown */
      true,
      /* canUpdateOutput */
      true
    );
    this.config = config;
    this.toolOptions = toolOptions;
  }
  static {
    __name(this, "WorkflowTool");
  }
  validateToolParamValues(params) {
    const hasScript = typeof params.script === "string" && params.script.length > 0;
    const hasPath = typeof params.scriptPath === "string" && params.scriptPath.length > 0;
    if (!hasScript && !hasPath) {
      return "WorkflowTool: provide `script` (inline source) or `scriptPath` (a saved workflow file).";
    }
    if (hasScript && hasPath) {
      return "WorkflowTool: provide exactly one of `script` or `scriptPath`, not both.";
    }
    if (params.resumeFromRunId !== void 0 && !/^wf_[0-9a-f]+$/.test(params.resumeFromRunId)) {
      return "WorkflowTool: `resumeFromRunId` must match the generated id format `wf_<hex>`.";
    }
    return null;
  }
  createInvocation(params) {
    return new WorkflowToolInvocation(this.config, this.toolOptions, params);
  }
};
export {
  WorkflowTool
};
/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
