// Force strict mode and setup for ESM
"use strict";
import {
  Client,
  StdioClientTransport,
  extract
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
  safeJsonStringify
} from "./chunk-VIC4RJDL.js";
import "./chunk-3PJXIDKI.js";
import "./chunk-UWCTAVOD.js";
import "./chunk-OMX7CUOE.js";
import "./chunk-BNXANYLH.js";
import "./chunk-T2VDEFUU.js";
import "./chunk-XSYS2SJX.js";
import {
  BaseDeclarativeTool,
  BaseToolInvocation
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
import "./chunk-C4K3FEQ2.js";
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

// packages/core/src/tools/computer-use/index.ts
init_esbuild_shims();

// packages/core/src/tools/computer-use/tool.ts
init_esbuild_shims();

// packages/core/src/tools/computer-use/client.ts
init_esbuild_shims();
import { homedir as homedir2 } from "node:os";

// packages/core/src/tools/computer-use/constants.ts
init_esbuild_shims();
import { join } from "node:path";
import { homedir } from "node:os";
var CUA_DRIVER_VERSION = "0.5.2";
var OSS_MIRROR_BASE = "https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/computer-use";
var GITHUB_RELEASE_BASE = "https://github.com/trycua/cua/releases/download";
function resolveAssetTarget(platform = process.platform, arch = process.arch, version = CUA_DRIVER_VERSION) {
  const v = version;
  if (platform === "darwin") {
    const slug = arch === "arm64" ? "darwin-arm64" : "darwin-x86_64";
    const extractDir = `cua-driver-rs-${v}-${slug}`;
    return {
      asset: `${extractDir}.tar.gz`,
      extractDir,
      // Spawn the binary INSIDE CuaDriver.app, not the bare one beside it.
      // cua-driver only triggers its TCC auto-relaunch (`open -a CuaDriver
      // serve`, which attributes Accessibility/Screen-Recording grants to
      // com.trycua.driver rather than the launching terminal) when its
      // running image resolves into `/CuaDriver.app/Contents/MacOS/`
      // (see bundle.rs `is_executable_inside_cuadriver_app`). Pointing at
      // the bare `cua-driver` made TCC attribute to the parent terminal
      // (e.g. iTerm) — wrong identity, per-terminal, oversized privacy.
      binaryRelPath: "CuaDriver.app/Contents/MacOS/cua-driver",
      hasApp: true
    };
  }
  if (platform === "linux") {
    if (arch !== "x64") {
      throw new Error(
        `Computer Use: unsupported Linux arch '${arch}' (only x64).`
      );
    }
    return {
      asset: `cua-driver-rs-${v}-linux-x86_64-binary.tar.gz`,
      extractDir: ".",
      binaryRelPath: "cua-driver",
      hasApp: false
    };
  }
  if (platform === "win32") {
    const slug = arch === "arm64" ? "windows-arm64" : "windows-x86_64";
    const extractDir = `cua-driver-rs-${v}-${slug}`;
    return {
      asset: `${extractDir}.zip`,
      extractDir,
      binaryRelPath: "cua-driver.exe",
      hasApp: false
    };
  }
  throw new Error(`Computer Use: unsupported platform '${platform}'.`);
}
__name(resolveAssetTarget, "resolveAssetTarget");
function resolveAssetUrls(asset, env = process.env, version = CUA_DRIVER_VERSION) {
  const urls = [];
  const override = env["QWEN_COMPUTER_USE_DOWNLOAD_HOST"];
  if (override) {
    urls.push(`${trimSlash(override)}/cua-driver-rs/v${version}/${asset}`);
  }
  urls.push(`${OSS_MIRROR_BASE}/cua-driver-rs/v${version}/${asset}`);
  urls.push(`${GITHUB_RELEASE_BASE}/cua-driver-rs-v${version}/${asset}`);
  return urls;
}
__name(resolveAssetUrls, "resolveAssetUrls");
function resolveChecksumUrls(env = process.env, version = CUA_DRIVER_VERSION) {
  return resolveAssetUrls("checksums.txt", env, version);
}
__name(resolveChecksumUrls, "resolveChecksumUrls");
var MAX_IMAGE_DIMENSION_ENV = "QWEN_COMPUTER_USE_MAX_IMAGE_DIMENSION";
function coerceImageDimension(value) {
  if (value === void 0) return void 0;
  if (typeof value === "string" && value.trim() === "") return void 0;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 0) return void 0;
  return n;
}
__name(coerceImageDimension, "coerceImageDimension");
function resolveMaxImageDimension(settingValue, env = process.env) {
  const fromEnv = coerceImageDimension(env[MAX_IMAGE_DIMENSION_ENV]);
  if (fromEnv !== void 0) return fromEnv;
  return coerceImageDimension(settingValue);
}
__name(resolveMaxImageDimension, "resolveMaxImageDimension");
function computerUseRoot(home = homedir()) {
  return join(home, ".qwen", "computer-use");
}
__name(computerUseRoot, "computerUseRoot");
function versionDir(home = homedir(), version = CUA_DRIVER_VERSION) {
  return join(computerUseRoot(home), `cua-driver-rs-${version}`);
}
__name(versionDir, "versionDir");
function binaryPath(home = homedir(), platform = process.platform, arch = process.arch, version = CUA_DRIVER_VERSION) {
  const target = resolveAssetTarget(platform, arch, version);
  return join(
    versionDir(home, version),
    target.extractDir,
    target.binaryRelPath
  );
}
__name(binaryPath, "binaryPath");
function approvalKey(version = CUA_DRIVER_VERSION) {
  return `cua-driver-rs@${version}`;
}
__name(approvalKey, "approvalKey");
function trimSlash(s) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}
__name(trimSlash, "trimSlash");

// packages/core/src/tools/computer-use/client.ts
var ComputerUseClient = class _ComputerUseClient {
  static {
    __name(this, "ComputerUseClient");
  }
  static singleton;
  binary;
  onProgress;
  maxImageDimension;
  client;
  startPromise;
  constructor(options) {
    this.binary = options.binary;
    this.onProgress = options.onProgress ?? (() => {
    });
    this.maxImageDimension = options.maxImageDimension;
  }
  /**
   * Set the screenshot longest-edge cap applied on the next (re)connect via
   * `set_config`. Cheap to call before every `start()`; the value is only
   * pushed to cua-driver inside `doStart` (once per spawn, re-applied after a
   * reconnect). `undefined` means "don't override".
   */
  setMaxImageDimension(value) {
    this.maxImageDimension = value;
  }
  /**
   * Shared singleton instance, created with default options on first
   * access. Tests can replace it via `setSharedForTest()`.
   *
   * The binary path is derived from the pinned `CUA_DRIVER_VERSION` in
   * constants.ts, the single source of truth the downloaded binary +
   * generated `schemas.ts` agree on.
   */
  static shared() {
    if (!_ComputerUseClient.singleton) {
      _ComputerUseClient.singleton = new _ComputerUseClient({
        binary: binaryPath(homedir2())
      });
    }
    return _ComputerUseClient.singleton;
  }
  /** Test-only: replace the singleton. */
  static setSharedForTest(replacement) {
    _ComputerUseClient.singleton = replacement;
  }
  isStarted() {
    return this.client !== void 0;
  }
  /**
   * Start the upstream MCP server. Idempotent: concurrent callers share
   * the same in-flight start promise.
   *
   * An optional `onProgress` callback can be supplied to receive download
   * and startup messages during this call. It overrides the instance-level
   * callback for the duration of the start operation only.
   *
   * Throws on spawn failure (binary missing / not executable, daemon
   * launch failure, etc.). The caller (bootstrap state machine) is
   * responsible for mapping the throw into user-facing UX.
   */
  async start(onProgress) {
    if (this.client) return;
    if (this.startPromise) return this.startPromise;
    this.startPromise = this.doStart(onProgress).finally(() => {
      this.startPromise = void 0;
    });
    return this.startPromise;
  }
  async doStart(onProgress) {
    const progress = onProgress ?? this.onProgress;
    progress("Starting Computer Use driver...");
    const transport = new StdioClientTransport({
      command: this.binary,
      args: ["mcp"],
      // Inherit env so HTTPS_PROXY / cua-driver config env flow through.
      env: { ...process.env }
    });
    const client = new Client(
      { name: "qwen-code-computer-use", version: "1.0.0" },
      { capabilities: {} }
    );
    await client.connect(transport);
    this.client = client;
    await this.applyRuntimeConfig(client, progress);
  }
  /**
   * Push session-level runtime config to a freshly connected daemon. Today
   * that is just `max_image_dimension` (the screenshot longest-edge cap),
   * applied via the `set_config` tool when an override is configured.
   *
   * Runs once per spawn — including after the reconnect in `callTool`, since a
   * daemon restart resets runtime config to its persisted default. Best-effort:
   * a failed `set_config` must NOT abort startup (the driver is still usable at
   * its default dimension), so the error is surfaced via `progress` and
   * swallowed. Calls the inner client directly to avoid recursing through
   * `callTool`'s reconnect path.
   */
  async applyRuntimeConfig(client, progress) {
    if (this.maxImageDimension === void 0) return;
    try {
      await client.callTool({
        name: "set_config",
        arguments: { max_image_dimension: this.maxImageDimension }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      progress(
        `Computer Use: could not apply max_image_dimension=${this.maxImageDimension} (${msg}); using driver default.`
      );
    }
  }
  /**
   * List the tools exposed by the upstream server. Used by the schema
   * sync script and bootstrap diagnostics.
   */
  async listTools() {
    if (!this.client) throw new Error("ComputerUseClient not started");
    return this.client.listTools();
  }
  /**
   * Call a tool by upstream name (NOT the qwen-code-facing
   * `computer_use__` prefixed name). Returns the raw MCP result so the
   * caller can inspect `isError` and parse text content.
   *
   * On transport-closed errors (e.g. macOS kills the upstream binary after
   * the user grants Screen Recording permission), this method transparently
   * tears down the stale connection, reconnects, and retries the call once.
   * If the retry also fails, the error is re-thrown without further
   * reconnect attempts.
   */
  async callTool(name, args) {
    if (!this.client) throw new Error("ComputerUseClient not started");
    try {
      return await this.client.callTool({
        name,
        arguments: args
      });
    } catch (err) {
      if (!isTransportClosedError(err)) throw err;
      let lastErr = err;
      for (let attempt = 0; attempt < 3; attempt++) {
        await this.stop();
        await this.start();
        if (!this.client) throw new Error("ComputerUseClient reconnect failed");
        try {
          return await this.client.callTool({
            name,
            arguments: args
          });
        } catch (retryErr) {
          if (!isTransportClosedError(retryErr)) throw retryErr;
          lastErr = retryErr;
          await new Promise((r) => setTimeout(r, 1e3));
        }
      }
      throw lastErr;
    }
  }
  /** Tear down the child process. Safe to call multiple times. */
  async stop() {
    const client = this.client;
    this.client = void 0;
    if (client) {
      try {
        await client.close();
      } catch {
      }
    }
  }
};
function isTransportClosedError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return /connection closed|not connected|connection refused|daemon transport error|os error 61/i.test(
    msg
  );
}
__name(isTransportClosedError, "isTransportClosedError");

// packages/core/src/tools/computer-use/schemas.ts
init_esbuild_shims();
var COMPUTER_USE_TOOL_NAMES = [
  "bring_to_front",
  "check_for_update",
  "check_permissions",
  "click",
  "double_click",
  "drag",
  "end_session",
  "get_accessibility_tree",
  "get_agent_cursor_state",
  "get_config",
  "get_cursor_position",
  "get_recording_state",
  "get_screen_size",
  "get_window_state",
  "hotkey",
  "kill_app",
  "launch_app",
  "list_apps",
  "list_windows",
  "move_cursor",
  "page",
  "press_key",
  "replay_trajectory",
  "right_click",
  "scroll",
  "set_agent_cursor_enabled",
  "set_agent_cursor_motion",
  "set_agent_cursor_style",
  "set_config",
  "set_value",
  "start_recording",
  "start_session",
  "stop_recording",
  "type_text",
  "zoom"
];
var COMPUTER_USE_SCHEMAS = {
  bring_to_front: {
    description: 'Activate a window so subsequent input tools with `dispatch:"foreground"` land on it without a per-call SetForegroundWindow flash. **Windows-only:** on macOS this tool returns an error pointing to the platform-native `NSRunningApplication.activate` (which the macOS input tools don\'t need because CGEvent.postToPid reaches backgrounded windows). On Linux this tool also stubs out; use `wmctrl -a` or `xdotool windowactivate` if you need explicit activation.',
    parameterSchema: {
      additionalProperties: false,
      properties: {
        pid: {
          type: "integer"
        },
        window_id: {
          type: "integer"
        }
      },
      required: ["pid"],
      type: "object"
    }
  },
  check_for_update: {
    description: "Check whether a newer cua-driver-rs release is available on GitHub. Returns the current and latest versions, an `update_available` boolean, the install one-liner, and the release notes URL. Read-only \u2014 never installs. Mirror of `cua-driver check-update --json`.",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  check_permissions: {
    description: "Report TCC permission status for Accessibility and Screen Recording. By default also raises the system permission dialogs for any missing grants \u2014 Apple's request APIs are no-ops when the grant is already active, so this is safe to call repeatedly. Pass {\"prompt\": false} for a purely read-only status check.\n\nReturns: `accessibility` + `screen_recording` (booleans from the TCC preflight APIs), `screen_recording_capturable` (a live ScreenCaptureKit probe \u2014 if it disagrees with `screen_recording`, the preflight grant belongs to a different process), and `source` (which TCC identity the booleans reflect: the CuaDriver daemon vs the launching terminal/IDE). macOS attributes grants to the responsible process, so a standalone call from a terminal reports the terminal's grants, not the driver's.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        prompt: {
          description: "Raise the system permission prompts for missing grants. Default true.",
          type: "boolean"
        }
      },
      type: "object"
    }
  },
  click: {
    description: "Left-click against a target pid. **Prefer `element_index` over pixel coordinates** \u2014 element_index works on backgrounded / minimized / hidden / off-Space windows, surfaces a stable handle that survives rebuilds, and tells you what you're clicking via the cached element's role + label. Reach for `x, y` only when the target is a canvas / video / WebGL / custom-drawn surface that doesn't appear in the AX tree.\n\nTwo addressing modes:\n\n- element_index + window_id (from last get_window_state): AX action path. Works on backgrounded/hidden windows. No cursor move, no focus steal. element_index cache is scoped per (pid, window_id) and is replaced by the next snapshot of the same window \u2014 re-snapshot every turn before clicking.\n\n- x, y (window-local screenshot pixels, top-left origin of the PNG returned by get_window_state): CGEvent path. Synthesizes mouse events and posts to pid. Use modifier for cmd/shift/option/ctrl. Needs a visible on-screen window to anchor the conversion.\n\naction: press (default), show_menu, pick, confirm, cancel, open.\nfrom_zoom: set true after a zoom call to auto-translate zoom-image pixel coordinates to full-window space.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        action: {
          description: "AX action: press, show_menu, pick, confirm, cancel, open.",
          type: "string"
        },
        count: {
          description: "Click count (pixel path only). Default 1.",
          type: "integer"
        },
        debug_image_out: {
          description: "Optional file path. When set on a pixel-addressed click, captures a fresh screenshot, draws a red crosshair at (x, y), and writes the PNG. Use to verify coordinate spaces. Requires window_id; incompatible with from_zoom.",
          type: "string"
        },
        element_index: {
          description: "Element index from last get_window_state.",
          type: "integer"
        },
        from_zoom: {
          description: "When true, x and y are in the last zoom image for this pid; driver translates back to full-window coordinates.",
          type: "boolean"
        },
        modifier: {
          description: "Modifier keys: cmd, shift, option/alt, ctrl.",
          items: {
            type: "string"
          },
          type: "array"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          description: "Target window ID. Required for element_index.",
          type: "integer"
        },
        x: {
          description: "Window-local screenshot X coordinate.",
          type: "number"
        },
        y: {
          description: "Window-local screenshot Y coordinate.",
          type: "number"
        }
      },
      required: ["pid"],
      type: "object"
    }
  },
  double_click: {
    description: "Double-click at (x, y) or on an AX element identified by element_index + window_id.\n\nAX path (element_index provided): performs `AXOpen` when the element advertises it (Finder items, openable list rows/cells); otherwise resolves the element's on-screen center and falls back to a pixel double-click there.\n\nPixel path (x, y provided): two down/up pairs ~80 ms apart at the given coordinates.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        element_index: {
          description: "Element index from last get_window_state. Uses AX path.",
          type: "integer"
        },
        pid: {
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          description: "CGWindowID. Required when element_index is used.",
          type: "integer"
        },
        x: {
          description: "Screen X coordinate (pixel path).",
          type: "number"
        },
        y: {
          description: "Screen Y coordinate (pixel path).",
          type: "number"
        }
      },
      required: ["pid"],
      type: "object"
    }
  },
  drag: {
    description: "Press-drag-release gesture from (from_x, from_y) to (to_x, to_y) in window-local screenshot pixels \u2014 the same space get_window_state returns. Top-left origin of the target's window.\n\nUse for: marquee/lasso selection, drag-and-drop, resizing via a handle, scrubbing a slider, repositioning a panel.\n\n`duration_ms` (default 500) is the wall-clock budget for the path between mouse-down and mouse-up; `steps` (default 20) is the number of intermediate mouseDragged events linearly interpolated along the path. Increase both for slower, more human drags; decrease for snap gestures.\n\n`modifier` keys (cmd/shift/option/ctrl) are held across the entire gesture.\n\nWhen `from_zoom` is true, coordinates are in the last zoom image for this pid; the driver maps them back to window coordinates before dispatching.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        button: {
          description: "Mouse button used for the drag. Default: left.",
          enum: ["left", "right", "middle"],
          type: "string"
        },
        duration_ms: {
          description: "Wall-clock duration of the drag path between mouseDown and mouseUp. Default: 500.",
          maximum: 1e4,
          minimum: 0,
          type: "integer"
        },
        from_x: {
          description: "Drag-start X in window-local screenshot pixels. Top-left origin.",
          type: "number"
        },
        from_y: {
          description: "Drag-start Y in window-local screenshot pixels. Top-left origin.",
          type: "number"
        },
        from_zoom: {
          description: "When true, coordinates are in the last zoom image for this pid; driver maps back to window coordinates.",
          type: "boolean"
        },
        modifier: {
          description: "Modifier keys held across the entire gesture: cmd/shift/option/ctrl.",
          items: {
            type: "string"
          },
          type: "array"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        steps: {
          description: "Number of intermediate mouseDragged events linearly interpolated along the path. Default: 20.",
          maximum: 200,
          minimum: 1,
          type: "integer"
        },
        to_x: {
          description: "Drag-end X in window-local screenshot pixels.",
          type: "number"
        },
        to_y: {
          description: "Drag-end Y in window-local screenshot pixels.",
          type: "number"
        },
        window_id: {
          description: "CGWindowID for the window the pixel coordinates were measured against. Optional \u2014 when omitted the driver picks the frontmost window of pid.",
          type: "integer"
        }
      },
      required: ["pid", "from_x", "from_y", "to_x", "to_y"],
      type: "object"
    }
  },
  end_session: {
    description: "End a session declared with `start_session`: removes its agent cursor, stops any recording it owns, and clears its per-session config. Call this when a run finishes so its cursor doesn't linger (otherwise the idle-TTL reclaims it after a period of inactivity). Idempotent.",
    parameterSchema: {
      additionalProperties: true,
      properties: {
        session: {
          description: "The session id to end.",
          type: "string"
        }
      },
      required: ["session"],
      type: "object"
    }
  },
  get_accessibility_tree: {
    description: "Return a lightweight snapshot of the desktop: running regular apps and on-screen visible windows with their bounds, z-order, and owner pid.\n\nFor the full AX subtree of a single window (with interactive element indices you can click by), use `get_window_state` instead \u2014 that's the heavy per-window tool. This one is a fast discovery read that needs no TCC grants.",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  get_agent_cursor_state: {
    description: "Return the current state of THIS session's agent cursor: position, config (color, icon, label, size, opacity), enabled flag. Pass cursor_id to inspect a specific instance.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        cursor_id: {
          description: "Cursor instance. Default: this session's cursor.",
          type: "string"
        }
      },
      type: "object"
    }
  },
  get_config: {
    description: "Return the current cua-driver-rs configuration.",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  get_cursor_position: {
    description: "Return the current mouse cursor position in screen points (origin top-left).",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  get_recording_state: {
    description: "Report the current trajectory recorder state: whether recording is enabled, the output directory (when enabled), and the 1-based counter for the next turn folder that will be written. Counter increments on every recorded action tool call and resets to 1 each time recording is (re-)enabled.\n\nPure read-only.",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  get_screen_size: {
    description: "Return the logical size of the main display in points plus its backing scale factor. Agents click in points; Retina displays have scale_factor 2.0. Requires no TCC permissions.",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  get_window_state: {
    description: "Walk a running app's AX tree and return a Markdown rendering of its UI, tagging every actionable element with [element_index N]. Pass those indices to click, type_text, press_key, etc.\n\nINVARIANT: call get_window_state once per turn per (pid, window_id) before any element-indexed action. The index map is replaced by the next snapshot.\n\nAlso captures a PNG screenshot of the specified window.\n\nOptional `query` filters the tree_markdown to matching lines plus their ancestor chain (case-insensitive substring). The element_index values are unchanged \u2014 filtering only trims the rendered Markdown.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        capture_mode: {
          description: "som=AX+screenshot (default), vision=screenshot only (no AX walk), ax=AX only (no screenshot).",
          enum: ["som", "vision", "ax"],
          type: "string"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        query: {
          description: "Case-insensitive filter for tree_markdown.",
          type: "string"
        },
        screenshot_out_file: {
          description: "When set, write the PNG to this file path (~ expanded) instead of embedding base64 in the response. The structured output will contain screenshot_file_path instead.",
          type: "string"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          description: "Target window ID from list_windows.",
          type: "integer"
        }
      },
      required: ["pid", "window_id"],
      type: "object"
    }
  },
  hotkey: {
    description: 'Press a combination of keys simultaneously \u2014 e.g. `["cmd", "c"]` for Copy, `["cmd", "shift", "4"]` for screenshot selection. The combo is posted directly to the target pid\'s event queue; the target does NOT need to be frontmost.\n\nTwo delivery paths:\n\u2022 Default (no window_id): auth-message envelope \u2014 Chromium/Electron apps accept the keystrokes as trusted live input on macOS 14+.\n\u2022 With window_id: NSMenu path \u2014 briefly activates the target WindowServer-frontmost via SLPSSetFrontProcessWithOptions (kCPSNoWindows, < 1 ms), posts WITHOUT the auth envelope so IOHIDPostEvent fires and NSApplication.sendEvent: dispatches NSMenu key equivalents (e.g. Cmd+Z undo, Cmd+W close). Restores prior frontmost immediately. Use this path when you need native menu-bar actions on non-Chromium apps.\n\nRecognized modifiers: cmd/command, shift, option/alt, ctrl/control, fn. Non-modifier keys use the same vocabulary as `press_key` (return, tab, escape, up/down/left/right, space, delete, home, end, pageup, pagedown, f1-f12, letters, digits). Order: modifiers first, one non-modifier last.',
    parameterSchema: {
      additionalProperties: false,
      properties: {
        keys: {
          description: 'Modifier(s) and one non-modifier key, e.g. ["cmd", "c"].',
          items: {
            type: "string"
          },
          minItems: 2,
          type: "array"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          description: "When set, uses NSMenu path: briefly activates the window for menu key dispatch, then restores prior frontmost.",
          type: "integer"
        }
      },
      required: ["pid", "keys"],
      type: "object"
    }
  },
  kill_app: {
    description: "Force-terminate a process by pid (kill -9 equivalent on macOS / Linux; taskkill /F equivalent on Windows). Use as escalation when the cooperative close path (hotkey cmd+q on macOS, click-the-X on Windows) failed to make the process exit. Unsaved state is lost \u2014 prefer the cooperative path first.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        pid: {
          description: "PID of the process to terminate.",
          type: "integer"
        }
      },
      required: ["pid"],
      type: "object"
    }
  },
  launch_app: {
    description: "Launch a macOS app in the background \u2014 the target does NOT come to the foreground.\n\nProvide either `bundle_id` (preferred \u2014 unambiguous, e.g. `com.apple.calculator`) or `name` (e.g. \"Calculator\"). If both are given, bundle_id wins.\n\nOptional `urls` are handed to the app as open targets \u2014 for Finder, pass a folder path to open a backgrounded Finder window there.\n\nOptional `electron_debugging_port`: opens a Chrome DevTools Protocol (CDP) server on the specified port (appends --remote-debugging-port=N to the app's argv). Use this to automate Electron/VS Code/Cursor via CDP.\n\nOptional `webkit_inspector_port`: opens a WebKit inspector server on the specified port (sets WEBKIT_INSPECTOR_SERVER=127.0.0.1:N + TAURI_WEBVIEW_AUTOMATION=1). Use this for Tauri/WebKit-based apps.\n\nOptional `creates_new_application_instance`: when true, forces a new app instance even if one is already running (passes -n to open). Reach for this when another agent or session may drive the SAME app concurrently \u2014 it returns a fresh pid + window so each session acts on its own isolated window instead of clobbering one shared instance. Without it, single-instance apps (Calculator, many utilities) hand every caller the same window, so two sessions fight over it.\n\nOptional `additional_arguments`: extra argv strings appended after --args.\n\nReturns the launched app's pid, bundle_id, name, and a `windows` array (same shape as `list_windows`) so callers can skip an extra round-trip before `get_window_state(pid, window_id)`. When the focus-steal belt-and-braces demotion check ran (target pid \u2260 prior frontmost), the response also includes `self_activation_suppressed: bool` \u2014 true if focus stayed with the prior frontmost, false if the launched app held focus despite the re-demote attempt.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        additional_arguments: {
          description: "Extra arguments appended after --args when launching.",
          items: {
            type: "string"
          },
          type: "array"
        },
        bundle_id: {
          description: "App bundle identifier, e.g. com.apple.calculator. Preferred over name.",
          type: "string"
        },
        creates_new_application_instance: {
          description: "When true, force a new app instance even if already running (open -n). Use for concurrent multi-agent/multi-session work so each session gets an isolated instance + window instead of sharing one \u2014 on single-instance apps (e.g. Calculator) every caller otherwise gets the same window and the sessions clobber each other.",
          type: "boolean"
        },
        electron_debugging_port: {
          description: "Open a Chrome DevTools Protocol server on this port (appends --remote-debugging-port=N).",
          type: "integer"
        },
        name: {
          description: "App display name. Used only when bundle_id is absent.",
          type: "string"
        },
        urls: {
          description: "Optional file paths or URLs to open with the app (e.g. a folder path for Finder).",
          items: {
            type: "string"
          },
          type: "array"
        },
        webkit_inspector_port: {
          description: "Open a WebKit inspector server on this port (sets WEBKIT_INSPECTOR_SERVER env var).",
          type: "integer"
        }
      },
      type: "object"
    }
  },
  list_apps: {
    description: 'List macOS apps \u2014 both currently running and installed-but-not-running \u2014 with per-app state flags:\n\n- running: is a process for this app live? (pid is 0 when false)\n- active: is it the system-frontmost app? (implies running)\n- launch_path: filesystem path to the `.app` bundle, when known. Pass this to `launch_app` to start the app cold.\n- kind: `"desktop"` for `.app` bundles on macOS.\n- last_used: RFC3339 timestamp from the bundle\'s filesystem mtime, when readable; otherwise null.\n\nOnly apps with NSApplicationActivationPolicyRegular are included \u2014 background helpers and system UI agents are filtered out. Installed apps come from scanning /Applications, /Applications/Utilities, ~/Applications, /System/Applications, and /System/Applications/Utilities.\n\nUse this for "is X installed?" as well as "is X running?". For per-window state \u2014 on-screen, on-current-Space, minimized, window titles \u2014 call list_windows instead. For just opening an app \u2014 running or not \u2014 call launch_app({bundle_id: ...}) directly; list_apps is not a prerequisite.',
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  list_windows: {
    description: "List all layer-0 top-level windows currently known to WindowServer. Includes off-screen windows (minimized, on another Space, hidden-launched). Use this to find a window_id before calling get_window_state.\n\nPer-record fields: window_id, pid, app_name, title, bounds (x/y/width/height, top-left origin), z_index (higher = frontmost), is_on_screen, on_current_space.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        on_screen_only: {
          description: "When true, drop windows not on the current Space. Default false.",
          type: "boolean"
        },
        pid: {
          description: "Optional pid filter. When set, only this pid's windows are returned.",
          type: "integer"
        }
      },
      type: "object"
    }
  },
  move_cursor: {
    description: "Move the agent cursor overlay to (x, y). Does NOT move the real mouse cursor \u2014 the user's cursor stays where it is. Useful for showing the agent's attention without interrupting the user.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        cursor_id: {
          description: "Cursor instance to move. Default: 'default'.",
          type: "string"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        x: {
          type: "number"
        },
        y: {
          type: "number"
        }
      },
      required: ["x", "y"],
      type: "object"
    }
  },
  page: {
    description: "Interact with the browser page loaded in a running app. Supports Chrome, Brave, Edge, Safari (via AppleScript on macOS), Electron apps (via CDP), Chromium/Firefox on Windows (via UIA for read; CDP for execute_javascript when --remote-debugging-port is set), and WKWebView/Tauri/AT-SPI fallbacks.\n\nActions:\n- execute_javascript: Run JS and return the result.\n- get_text: Extract visible text from the page.\n- query_dom: Find elements matching a CSS selector.\n- click_element: Click a CSS-selected element AND animate the agent cursor to its on-screen center first (so the user sees what the agent is doing). Prefer over `execute_javascript('el.click()')` whenever you want visible cursor feedback.\n- enable_javascript_apple_events: macOS-only \u2014 patch the browser's Preferences to allow JS from Apple Events (Chrome/Brave/Edge, requires user confirmation and a browser restart).",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        action: {
          description: "Action to perform.",
          enum: [
            "execute_javascript",
            "get_text",
            "query_dom",
            "click_element",
            "enable_javascript_apple_events"
          ],
          type: "string"
        },
        attributes: {
          description: "Element attributes to include in query_dom results.",
          items: {
            type: "string"
          },
          type: "array"
        },
        bundle_id: {
          description: "Bundle ID of the browser. Required for enable_javascript_apple_events (macOS only).",
          type: "string"
        },
        css_selector: {
          description: "CSS selector for query_dom (e.g. 'a', 'button', 'input', 'h1'-'h6', 'p', 'img', 'select', '*').",
          type: "string"
        },
        javascript: {
          description: "JavaScript to execute. Required for execute_javascript.",
          type: "string"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        selector: {
          description: "CSS selector for click_element (e.g. 'button.submit', '#login a').",
          type: "string"
        },
        user_has_confirmed_enabling: {
          description: "Must be true to proceed with enable_javascript_apple_events. This will quit and relaunch the browser.",
          type: "boolean"
        },
        window_id: {
          description: "Target window ID from list_windows.",
          type: "integer"
        }
      },
      required: ["action"],
      type: "object"
    }
  },
  press_key: {
    description: "Press and release a single key, delivered to the target pid via CGEventPostToPid. No focus steal.\n\nTwo delivery paths:\n\u2022 window_id + element_index: focuses the AX element first, then posts via the auth-message path (Chromium-safe).\n\u2022 window_id only (no element_index): NSMenu path \u2014 briefly activates the window WindowServer-frontmost via SLPSSetFrontProcessWithOptions (kCPSNoWindows, < 1 ms), posts WITHOUT the auth envelope so IOHIDPostEvent fires and NSApplication.sendEvent: dispatches NSMenu key equivalents. Restores prior frontmost immediately.\n\u2022 No window_id: standard auth-message path.\n\nKey names: return, tab, escape, up/down/left/right, space, delete, home, end, pageup, pagedown, f1-f12, plus any letter or digit.\nModifiers array: cmd, shift, option/alt, ctrl, fn.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        element_index: {
          type: "integer"
        },
        key: {
          description: "Key name: return, tab, escape, up, down, etc.",
          type: "string"
        },
        modifiers: {
          description: "Modifier keys: cmd, shift, option/alt, ctrl, fn.",
          items: {
            type: "string"
          },
          type: "array"
        },
        pid: {
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          type: "integer"
        }
      },
      required: ["pid", "key"],
      type: "object"
    }
  },
  replay_trajectory: {
    description: "Replay a recorded trajectory by re-invoking every turn's tool call in lexical order. `dir` must point at a directory previously written by `start_recording`. Each `turn-NNNNN/` is parsed for `action.json`, and the recorded tool is called with its recorded `arguments` via the same dispatch path an MCP / CLI call uses.\n\nCaveats:\n- Element-indexed actions (`click({pid, element_index})` etc.) will fail because element indices are per-snapshot and don't survive across sessions. Pixel clicks (`click({pid, x, y})`) and all keyboard tools replay cleanly. Failures are reported but don't stop replay unless `stop_on_error` is true.\n- `get_window_state` and other read-only tools are NOT currently recorded, so replays do not re-populate the per-(pid, window_id) element cache.\n- If recording is ENABLED while replay runs, the replay itself is recorded into the currently configured output directory.  That's deliberate: recording a replay against a new build and diffing the two trajectories is the regression-test workflow.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        delay_ms: {
          description: "Milliseconds to sleep between turns, for human-observable pacing. Default 500.",
          maximum: 1e4,
          minimum: 0,
          type: "integer"
        },
        dir: {
          description: "Trajectory directory previously written by `set_recording`. Absolute or ~-rooted.",
          type: "string"
        },
        stop_on_error: {
          description: "Stop replay on the first tool-call error. Default true \u2014 set false to best-effort through the full trajectory.",
          type: "boolean"
        }
      },
      required: ["dir"],
      type: "object"
    }
  },
  right_click: {
    description: "Right-click against a target pid. Two addressing modes:\n\n- `element_index` + `window_id` (from the last `get_window_state` snapshot) \u2014 performs `AXShowMenu` on the cached element. Pure AX RPC, works on backgrounded / hidden windows, no cursor move or focus steal. Requires a prior `get_window_state(pid, window_id)` in this turn.\n\n- `x`, `y` \u2014 synthesizes `rightMouseDown` / `rightMouseUp` CGEvent pair posted to the pid. Driver converts image-pixel \u2192 screen-point internally. `modifier` forces the CGEvent path (AX actions don't propagate modifier keys).\n\nExactly one of `element_index` or (`x` AND `y`) must be provided. `pid` always required. `window_id` required when `element_index` is used.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        element_index: {
          description: "Element index from last get_window_state. Routes through AXShowMenu. Requires window_id.",
          type: "integer"
        },
        modifier: {
          description: "Modifier keys held during the right-click: cmd/shift/option/ctrl. Pixel path only.",
          items: {
            type: "string"
          },
          type: "array"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          description: "CGWindowID. Required when element_index is used.",
          type: "integer"
        },
        x: {
          description: "X in window-local screenshot pixels. Must be provided together with y.",
          type: "number"
        },
        y: {
          description: "Y in window-local screenshot pixels. Must be provided together with x.",
          type: "number"
        }
      },
      required: ["pid"],
      type: "object"
    }
  },
  scroll: {
    description: "Scroll the target pid's focused region by synthesized keystrokes.\n\nMapping: by='page' \u2192 PageDown/PageUp \xD7 amount; by='line' \u2192 DownArrow/UpArrow \xD7 amount. Horizontal variants use Left/Right arrow keys.\n\nOptional element_index + window_id pre-focuses the element before scrolling.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        amount: {
          description: "Number of keystroke repetitions. Default: 3.",
          maximum: 50,
          minimum: 1,
          type: "integer"
        },
        by: {
          description: "Scroll granularity. Default: line.",
          enum: ["line", "page"],
          type: "string"
        },
        direction: {
          description: "Scroll direction.",
          enum: ["up", "down", "left", "right"],
          type: "string"
        },
        element_index: {
          type: "integer"
        },
        pid: {
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        window_id: {
          type: "integer"
        }
      },
      required: ["pid", "direction"],
      type: "object"
    }
  },
  set_agent_cursor_enabled: {
    description: "Show or hide the agent cursor for a session. A cursor exists only for a DECLARED session: pass `session` (the same id you start_session / drive actions with) and the cursor appears on that session's first action \u2014 its color is derived from the id. Without a `session`, actions run cursor-less. Use enabled=false to hide a session's cursor, enabled=true to re-show it. (`cursor_id` is a legacy alias for `session`.)",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        cursor_id: {
          description: "Cursor instance. Default: 'default'.",
          type: "string"
        },
        enabled: {
          description: "true = show, false = hide.",
          type: "boolean"
        }
      },
      required: ["enabled"],
      type: "object"
    }
  },
  set_agent_cursor_motion: {
    description: "Configure the visual appearance and motion curve of an agent cursor instance.\n\nAppearance (multi-cursor customization):\n- cursor_id: instance name (default='default')\n- cursor_icon: built-in ('arrow','crosshair','hand','dot') or PNG/SVG file path\n- cursor_color: hex color e.g. '#00FFFF' or CSS name\n- cursor_label: short text shown near the cursor\n- cursor_size: dot radius in points (default=16)\n- cursor_opacity: 0.0\u20131.0 (default=0.85)\n\nMotion curve (Bezier path shape):\n- start_handle: departure control-point fraction [0,1]. Default 0.3\n- end_handle: arrival control-point fraction [0,1]. Default 0.3\n- arc_size: perpendicular deflection as fraction of path length [0,1]. Default 0.25\n- arc_flow: asymmetry [-1,1]; positive bulges toward destination. Default 0.0\n- spring: settle damping [0.3,1.0]; 1.0=no overshoot. Default 0.72\n- glide_duration_ms: fixed flight duration per move [50,5000]; omit for speed-based (the default)\n- dwell_after_click_ms: pause after click ripple [0,5000]. Default 80\n- idle_hide_ms: auto-hide delay [0,60000]; 0=never. Default 20000",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        arc_flow: {
          description: "Asymmetry bias in [-1, 1]. Default 0.0.",
          type: "number"
        },
        arc_size: {
          description: "Arc deflection as fraction of path length [0, 1]. Default 0.25.",
          type: "number"
        },
        cursor_color: {
          description: "Hex color (e.g. '#00FFFF') or CSS color name.",
          type: "string"
        },
        cursor_icon: {
          description: "Built-in icon name or file path to PNG/SVG.",
          type: "string"
        },
        cursor_id: {
          description: "Cursor instance name. Default: 'default'.",
          type: "string"
        },
        cursor_label: {
          description: "Short label near the cursor dot.",
          type: "string"
        },
        cursor_opacity: {
          description: "Opacity 0.0\u20131.0. Default: 0.85.",
          type: "number"
        },
        cursor_size: {
          description: "Dot radius in points. Default: 16.",
          type: "number"
        },
        dwell_after_click_ms: {
          description: "Pause after click ripple in ms. Default 80.",
          maximum: 5e3,
          minimum: 0,
          type: "number"
        },
        end_handle: {
          description: "End-handle fraction in [0, 1]. Default 0.3.",
          type: "number"
        },
        glide_duration_ms: {
          description: "Fixed flight duration per move in ms; omit for speed-based timing (the default).",
          maximum: 5e3,
          minimum: 50,
          type: "number"
        },
        idle_hide_ms: {
          description: "Auto-hide delay in ms. 0 = never hide. Default 20000.",
          maximum: 6e4,
          minimum: 0,
          type: "number"
        },
        spring: {
          description: "Settle damping in [0.3, 1.0]. Default 0.72.",
          type: "number"
        },
        start_handle: {
          description: "Start-handle fraction in [0, 1]. Default 0.3.",
          type: "number"
        },
        turn_radius: {
          description: "Minimum turning radius of the glide path in points; smaller = tighter curves. Default 80.",
          maximum: 1e3,
          minimum: 1,
          type: "number"
        }
      },
      type: "object"
    }
  },
  set_agent_cursor_style: {
    description: 'Update the visual style of the agent cursor overlay.\n\n- gradient_colors: array of CSS hex strings (e.g. ["#FF0000","#0000FF"]) used as the arrow fill gradient from tip to tail. Empty array reverts to the default palette colours.\n- bloom_color: hex string for the radial halo/bloom behind the cursor (e.g. "#00FFFF"). Empty string reverts to the default.\n- image_path: path to a PNG, JPEG, SVG, or ICO file to use as the cursor icon instead of the default gradient arrow. Empty string reverts to the procedural arrow.\nAll parameters are optional; omit any you do not want to change.',
    parameterSchema: {
      additionalProperties: false,
      properties: {
        bloom_color: {
          description: "Hex bloom/halo colour (e.g. '#00FFFF'). '' = revert to default.",
          type: "string"
        },
        cursor_id: {
          description: "Cursor instance. Default: 'default'.",
          type: "string"
        },
        gradient_colors: {
          description: "CSS hex gradient stops tip\u2192tail. [] = revert to default.",
          items: {
            type: "string"
          },
          type: "array"
        },
        image_path: {
          description: "Path to PNG/JPEG/SVG/ICO cursor image. '' = revert to arrow.",
          type: "string"
        }
      },
      type: "object"
    }
  },
  set_config: {
    description: "Update cua-driver-rs configuration. Changes to capture_mode and max_image_dimension take effect immediately. The experimental_pip keys are persisted to ~/.cua-driver/config.json and take effect on the next daemon restart (the PiP backend is initialised once at startup).",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        capture_mode: {
          description: "Default capture mode for get_window_state.",
          enum: ["som", "vision", "ax"],
          type: "string"
        },
        experimental_pip: {
          description: "Enable the experimental picture-in-picture preview window. Applies on next daemon restart.",
          type: "boolean"
        },
        experimental_pip_geometry: {
          description: "PiP window size + optional position in `WxH` or `WxH+X+Y` form (e.g. `320x200+24+24`). Applies on next daemon restart.",
          type: "string"
        },
        max_image_dimension: {
          description: "Max dimension for screenshot resizing (0 = no limit).",
          type: "integer"
        }
      },
      type: "object"
    }
  },
  set_value: {
    description: "Set a value on a UI element. Two modes depending on element role:\n\n- **AXPopUpButton / select dropdown**: finds the child option whose title or value matches `value` (case-insensitive) and AXPresses it directly \u2014 the native macOS popup menu is never opened, so focus is never stolen. Use this for HTML <select> elements in Safari or any native NSPopUpButton.\n\n- **All other elements**: writes AXValue directly (sliders, steppers, date pickers, native text fields that expose settable AXValue).\n\nFor free-form text entry into web inputs, prefer `type_text_chars` which synthesises key events \u2014 AXValue writes are ignored by WebKit.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        element_index: {
          type: "integer"
        },
        pid: {
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        value: {
          description: "New value. AX will coerce to the element's native type.",
          type: "string"
        },
        window_id: {
          description: "CGWindowID for the window whose get_window_state produced the element_index.",
          type: "integer"
        }
      },
      required: ["pid", "window_id", "element_index", "value"],
      type: "object"
    }
  },
  start_recording: {
    description: "Start trajectory recording. Every subsequent action-tool invocation (click, right_click, scroll, type_text, press_key, hotkey, set_value) writes a turn folder under `output_dir`:\n\n- `app_state.json` \u2014 post-action AX/UIA snapshot for the target pid.\n- `screenshot.png` \u2014 post-action per-window screenshot of the target's frontmost on-screen window.\n- `action.json` \u2014 tool name, full input arguments, result summary, pid, click point (when applicable), ISO-8601 timestamp.\n- `click.png` \u2014 for click-family actions only, `screenshot.png` with a red dot drawn at the click point.\n\nTurn folders are named `turn-00001/`, `turn-00002/`, etc.  Turn numbering restarts at 1 each time recording is (re-)started.\n\n**Video is off by default.** Pass `record_video: true` to also capture the main display to `<output_dir>/recording.mp4` (H.264 / 30 fps) for the lifetime of the session. The recording is torn down automatically when the MCP client disconnects.\n\n**macOS uses native ScreenCaptureKit** (in-process SCStream + SCRecordingOutput) so video inherits Cua Driver's own Screen Recording grant \u2014 no extra TCC prompt, no ffmpeg subprocess. Requires macOS 15.0+.\n\n**Windows + Linux use an ffmpeg subprocess** (`gdigrab` / `x11grab` + libx264). Requires ffmpeg on PATH (winget install Gyan.FFmpeg / apt install ffmpeg); when ffmpeg is missing or fails on startup the per-turn capture (screenshots + action.json) still runs and the session's `last_error` field carries the diagnostic.\n\nState persists for the life of the daemon / MCP session; a restart resets to disabled with no on-disk state. Call `stop_recording` to disable + finalize the mp4.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        output_dir: {
          description: "Absolute or ~-rooted directory where turn folders and (when enabled) the video file are written.",
          type: "string"
        },
        record_video: {
          description: "Capture the main display to <output_dir>/recording.mp4. Default: false. Set to true to also capture the main display to recording.mp4 (otherwise only the per-turn screenshots + JSON are recorded). On macOS this uses native ScreenCaptureKit (no extra TCC prompt, macOS 15.0+); on Windows + Linux it requires ffmpeg on PATH.",
          type: "boolean"
        }
      },
      required: ["output_dir"],
      type: "object"
    }
  },
  start_session: {
    description: "Declare a session \u2014 a named, color-coded identity for THIS agent run. Pass a stable `session` id; the agent cursor, per-session config, and recording all key on it, and it follows the run across any apps/windows. The cursor's color is derived from the id, so distinct runs are visually distinct. A cursor is shown only for a declared session \u2014 call this (or pass `session` on your first action) to opt in. Idempotent: re-calling with the same id just refreshes its idle-TTL. End it with `end_session` (or let the idle-TTL reclaim it). Concurrent runs/subagents each pass their own `session` to get their own cursor.",
    parameterSchema: {
      additionalProperties: true,
      properties: {
        session: {
          description: 'Stable session id for this run (e.g. "research-run-1").',
          type: "string"
        }
      },
      required: ["session"],
      type: "object"
    }
  },
  stop_recording: {
    description: "Stop trajectory recording. Disables further per-turn capture and, when video was enabled, gracefully terminates the ffmpeg subprocess so the mp4's moov atom is finalized (the file is playable). Calling stop on an already-stopped session is a no-op. The response carries `last_video_path` pointing at the finalized mp4 (when video was on).\n\nA manual `stop_recording` is **unconditional** \u2014 it stops whatever recording is active regardless of which session started it. Ownership-scoped teardown (so one MCP client disconnecting can't stop a recording a later client started) is handled by the daemon's `session_end` lifecycle signal, not by this tool.",
    parameterSchema: {
      additionalProperties: false,
      properties: {},
      type: "object"
    }
  },
  type_text: {
    description: "Insert text into the target pid via `AXSetAttribute(kAXSelectedText)`. Works for standard Cocoa text fields and text views. No keystrokes are synthesized \u2014 special keys (Return / Escape / arrows) go through `press_key` / `hotkey`. For Chromium / Electron inputs that don't implement `kAXSelectedText`, the tool falls back to CGEvent character synthesis automatically.\n\nOptional `element_index` + `window_id` (from the last `get_window_state` snapshot) directs the write to a specific field. Without `element_index`, the write goes to the pid's currently focused element.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        delay_ms: {
          description: "Milliseconds between characters in the CGEvent fallback path. Default 30. Ignored when the AX path succeeds.",
          maximum: 200,
          minimum: 0,
          type: "integer"
        },
        element_index: {
          description: "Element index from last get_window_state. Directs the write to a specific field. Requires window_id.",
          type: "integer"
        },
        pid: {
          description: "Target process ID.",
          type: "integer"
        },
        session: {
          description: "Optional session id: declares/uses the agent cursor and per-session state for this run. The same id works over MCP, the CLI, or the raw socket, and follows the run across apps/windows. Omit to run cursor-less.",
          type: "string"
        },
        text: {
          description: "Text to insert at the target's cursor.",
          type: "string"
        },
        window_id: {
          description: "CGWindowID. Required when element_index is used.",
          type: "integer"
        }
      },
      required: ["pid", "text"],
      type: "object"
    }
  },
  zoom: {
    description: "Capture a cropped JPEG of a window region (x1,y1)\u2013(x2,y2) in screenshot pixel coordinates, with 20% padding added on each side. The output image is at most 500 px wide.\n\nAfter a zoom, pass `from_zoom=true` to click/type_text to auto-translate coordinates back to full-window space.",
    parameterSchema: {
      additionalProperties: false,
      properties: {
        pid: {
          description: "Target pid \u2014 required for from_zoom click/type translation.",
          type: "integer"
        },
        window_id: {
          description: "CGWindowID from list_windows.",
          type: "integer"
        },
        x1: {
          description: "Left edge of region in screenshot pixels.",
          type: "number"
        },
        x2: {
          description: "Right edge of region in screenshot pixels.",
          type: "number"
        },
        y1: {
          description: "Top edge of region in screenshot pixels.",
          type: "number"
        },
        y2: {
          description: "Bottom edge of region in screenshot pixels.",
          type: "number"
        }
      },
      required: ["window_id", "x1", "y1", "x2", "y2"],
      type: "object"
    }
  }
};

// packages/core/src/tools/computer-use/bootstrap.ts
init_esbuild_shims();
import { execFile, spawnSync } from "node:child_process";
import { promisify } from "node:util";
import { rmSync } from "node:fs";
import { homedir as homedir4 } from "node:os";
import { join as join4 } from "node:path";

// packages/core/src/tools/computer-use/install-state.ts
init_esbuild_shims();
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir as homedir3 } from "node:os";
import { join as join2, dirname } from "node:path";
function installStatePathFor(home = homedir3()) {
  return join2(home, ".qwen", "computer-use", "installed.json");
}
__name(installStatePathFor, "installStatePathFor");
async function loadInstallState(home = homedir3()) {
  try {
    const text = await readFile(installStatePathFor(home), "utf8");
    const parsed = JSON.parse(text);
    if (typeof parsed?.approvedPackageSpec !== "string") return void 0;
    if (typeof parsed?.approvedAtIso !== "string") return void 0;
    return parsed;
  } catch (err) {
    if (err?.code === "ENOENT") return void 0;
    return void 0;
  }
}
__name(loadInstallState, "loadInstallState");
async function saveInstallState(home = homedir3(), state) {
  const path = installStatePathFor(home);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(state, null, 2), "utf8");
}
__name(saveInstallState, "saveInstallState");
async function isPackageSpecApproved(home = homedir3(), packageSpec) {
  const state = await loadInstallState(home);
  return state?.approvedPackageSpec === packageSpec;
}
__name(isPackageSpecApproved, "isPackageSpecApproved");

// packages/core/src/tools/computer-use/downloader.ts
init_esbuild_shims();
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir as mkdir2, rm, stat, chmod, rename } from "node:fs/promises";
import { join as join3 } from "node:path";
import { tmpdir } from "node:os";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
function parseChecksums(body) {
  const map = /* @__PURE__ */ new Map();
  for (const line of body.split("\n")) {
    const m = line.trim().match(/^([0-9a-f]{64})\s+\*?(.+)$/i);
    if (m) map.set(m[2].trim(), m[1].toLowerCase());
  }
  return map;
}
__name(parseChecksums, "parseChecksums");
async function findInstalled(home, platform = process.platform, arch = process.arch, version = CUA_DRIVER_VERSION) {
  const p = binaryPath(home, platform, arch, version);
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch {
  }
  return void 0;
}
__name(findInstalled, "findInstalled");
async function fetchFirst(urls, fetchImpl, onProgress) {
  let lastErr;
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const headersTimeout = setTimeout(() => {
        controller.abort(new Error(`headers timeout after 30s for ${url}`));
      }, 3e4);
      try {
        const res = await fetchImpl(url, {
          redirect: "follow",
          signal: controller.signal
        });
        if (res.ok && res.body) return { url, res };
        await res.body?.cancel();
        lastErr = new Error(`HTTP ${res.status} for ${url}`);
      } finally {
        clearTimeout(headersTimeout);
      }
    } catch (err) {
      lastErr = err;
      onProgress?.(`Source unreachable, trying fallback\u2026`);
    }
  }
  throw new Error(
    `Computer Use: all download sources failed. Last error: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`
  );
}
__name(fetchFirst, "fetchFirst");
async function ensureInstalled(opts) {
  const platform = opts.platform ?? process.platform;
  const arch = opts.arch ?? process.arch;
  const version = opts.version ?? CUA_DRIVER_VERSION;
  const env = opts.env ?? process.env;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const onProgress = opts.onProgress;
  const existing = await findInstalled(opts.home, platform, arch, version);
  if (existing) return existing;
  const target = resolveAssetTarget(platform, arch, version);
  onProgress?.("Downloading Computer Use driver (~20MB, one time)...");
  const { res: sumRes } = await fetchFirst(
    resolveChecksumUrls(env, version),
    fetchImpl
  );
  const checksums = parseChecksums(await sumRes.text());
  const expectedSha = checksums.get(target.asset);
  if (!expectedSha) {
    throw new Error(
      `Computer Use: ${target.asset} missing from checksums.txt.`
    );
  }
  const { res } = await fetchFirst(
    resolveAssetUrls(target.asset, env, version),
    fetchImpl,
    onProgress
  );
  await mkdir2(computerUseTmp(opts.home), { recursive: true });
  const tmpFile = join3(computerUseTmp(opts.home), target.asset);
  const hash = createHash("sha256");
  const nodeStream = Readable.fromWeb(res.body);
  let idleTimer;
  const armIdle = /* @__PURE__ */ __name(() => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      nodeStream.destroy(new Error("download stalled: no data for 60s"));
    }, 6e4);
  }, "armIdle");
  nodeStream.on("data", (chunk) => {
    hash.update(chunk);
    armIdle();
  });
  armIdle();
  try {
    await pipeline(nodeStream, createWriteStream(tmpFile));
  } finally {
    clearTimeout(idleTimer);
  }
  const actualSha = hash.digest("hex");
  if (actualSha !== expectedSha) {
    await rm(tmpFile, { force: true });
    throw new Error(
      `Computer Use: checksum mismatch for ${target.asset} (expected ${expectedSha.slice(0, 12)}\u2026, got ${actualSha.slice(0, 12)}\u2026).`
    );
  }
  const dir = versionDir(opts.home, version);
  const stagingDir = `${dir}.staging`;
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir2(stagingDir, { recursive: true });
  await extractArchive(tmpFile, stagingDir, target.asset, opts.unzipImpl);
  await rm(tmpFile, { force: true });
  await rm(dir, { recursive: true, force: true });
  await rename(stagingDir, dir);
  const bin = binaryPath(opts.home, platform, arch, version);
  if (platform !== "win32") {
    await chmod(bin, 493);
  }
  if (platform === "darwin" && target.hasApp) {
    const extractRoot = join3(dir, target.extractDir);
    const appDir = join3(extractRoot, "CuaDriver.app");
    await stripQuarantine(extractRoot);
    await registerLaunchServices(appDir);
  }
  onProgress?.("Computer Use driver ready.");
  return bin;
}
__name(ensureInstalled, "ensureInstalled");
var LSREGISTER = "/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister";
async function registerLaunchServices(appPath) {
  try {
    const { execFile: execFile2 } = await import("node:child_process");
    const { promisify: promisify2 } = await import("node:util");
    await promisify2(execFile2)(LSREGISTER, ["-f", appPath], { timeout: 15e3 });
  } catch {
  }
}
__name(registerLaunchServices, "registerLaunchServices");
function computerUseTmp(home) {
  return join3(
    tmpdir(),
    "qwen-computer-use-dl",
    Buffer.from(home).toString("hex").slice(0, 8)
  );
}
__name(computerUseTmp, "computerUseTmp");
async function stripQuarantine(path) {
  try {
    const { execFile: execFile2 } = await import("node:child_process");
    const { promisify: promisify2 } = await import("node:util");
    await promisify2(execFile2)("xattr", ["-dr", "com.apple.quarantine", path], {
      timeout: 1e4
    });
  } catch {
  }
}
__name(stripQuarantine, "stripQuarantine");
async function extractArchive(archivePath, destDir, asset, unzipImpl) {
  if (asset.endsWith(".zip")) {
    await (unzipImpl ?? extractZipWindows)(archivePath, destDir);
  } else {
    await extract({ file: archivePath, cwd: destDir });
  }
}
__name(extractArchive, "extractArchive");
async function extractZipWindows(zipPath, destDir) {
  const { execFile: execFile2 } = await import("node:child_process");
  const { promisify: promisify2 } = await import("node:util");
  const run = promisify2(execFile2);
  const psCommand = `Expand-Archive -LiteralPath ${psSingleQuote(zipPath)} -DestinationPath ${psSingleQuote(destDir)} -Force`;
  const attempts = [
    { cmd: "tar", args: ["-xf", zipPath, "-C", destDir] },
    { cmd: "tar", args: ["--force-local", "-xf", zipPath, "-C", destDir] },
    {
      cmd: "powershell",
      args: ["-NoProfile", "-NonInteractive", "-Command", psCommand]
    }
  ];
  const errors = [];
  for (const { cmd, args } of attempts) {
    try {
      await run(cmd, args, { timeout: 18e4 });
      return;
    } catch (err) {
      errors.push(`${cmd} ${args[0]}: ${errMsg(err)}`);
    }
  }
  throw new Error(
    `Computer Use: failed to unzip ${zipPath} on Windows (${errors.join("; ")}).`
  );
}
__name(extractZipWindows, "extractZipWindows");
function psSingleQuote(s) {
  return `'${s.replace(/'/g, "''")}'`;
}
__name(psSingleQuote, "psSingleQuote");
function errMsg(e) {
  return e instanceof Error ? e.message : String(e);
}
__name(errMsg, "errMsg");

// packages/core/src/tools/computer-use/bootstrap.ts
var execFileAsync = promisify(execFile);
function parsePermissionsStatus(json) {
  try {
    const o = JSON.parse(json);
    if (typeof o.accessibility !== "boolean") return "unknown";
    if (!o.accessibility) return "accessibility";
    if (!o.screen_recording) return "screenRecording";
    return "ok";
  } catch {
    return "unknown";
  }
}
__name(parsePermissionsStatus, "parsePermissionsStatus");
var SOCKET = /* @__PURE__ */ __name(() => join4(homedir4(), "Library", "Caches", "cua-driver", "cua-driver.sock"), "SOCKET");
function killServeDaemons() {
  try {
    spawnSync(
      "pkill",
      ["-f", "CuaDriver.app/Contents/MacOS/cua-driver serve"],
      {
        stdio: "ignore"
      }
    );
  } catch {
  }
  try {
    rmSync(SOCKET(), { force: true });
  } catch {
  }
}
__name(killServeDaemons, "killServeDaemons");
async function probePermissionsViaStatus() {
  try {
    const { stdout } = await execFileAsync(
      binaryPath(homedir4()),
      ["permissions", "status", "--json"],
      { timeout: 1e4, env: process.env }
    );
    return parsePermissionsStatus(stdout);
  } catch {
    return "unknown";
  }
}
__name(probePermissionsViaStatus, "probePermissionsViaStatus");
function startStatusDaemonProcess() {
  killServeDaemons();
  try {
    spawnSync(
      "open",
      [
        "-n",
        "-g",
        "-a",
        "CuaDriver",
        "--args",
        "serve",
        "--no-permissions-gate"
      ],
      { stdio: "ignore" }
    );
  } catch {
  }
  return { kill: killServeDaemons };
}
__name(startStatusDaemonProcess, "startStatusDaemonProcess");
function openPermissionPaneProcess(kind) {
  const anchor = kind === "accessibility" ? "Privacy_Accessibility" : "Privacy_ScreenCapture";
  try {
    spawnSync(
      "open",
      [`x-apple.systempreferences:com.apple.preference.security?${anchor}`],
      { stdio: "ignore" }
    );
  } catch {
  }
}
__name(openPermissionPaneProcess, "openPermissionPaneProcess");
function defaultDeps() {
  const home = homedir4();
  return {
    homeDir: home,
    approvalKey: approvalKey(),
    platform: process.platform,
    promptInstallApproval: /* @__PURE__ */ __name(async (key) => {
      process.stderr.write(
        `
[Computer Use] First-time setup
  Driver: ${key}
  This downloads a ~20MB signed + notarized binary into ~/.qwen/computer-use/.
  Computer Use can click, type, and read your desktop apps in the background.
  On macOS you'll be guided through Accessibility and Screen Recording permissions next.
Set QWEN_COMPUTER_USE_AUTO_APPROVE=1 to skip this prompt.
`
      );
      return process.env["QWEN_COMPUTER_USE_AUTO_APPROVE"] === "1";
    }, "promptInstallApproval"),
    install: /* @__PURE__ */ __name((onProgress) => ensureInstalled({ home, onProgress }), "install"),
    startStatusDaemon: startStatusDaemonProcess,
    probePermissions: probePermissionsViaStatus,
    openPermissionPane: openPermissionPaneProcess
  };
}
__name(defaultDeps, "defaultDeps");
async function runBootstrap(client, ctx, depsOverride) {
  const deps = { ...defaultDeps(), ...depsOverride };
  const pollIntervalMs = deps.pollIntervalMs ?? 5e3;
  const pollTimeoutMs = deps.pollTimeoutMs ?? 10 * 6e4;
  if (client.isStarted()) return;
  const approved = await isPackageSpecApproved(deps.homeDir, deps.approvalKey);
  if (!approved) {
    if (ctx.autoApproveInstall) {
      ctx.updateOutput?.("Computer Use install auto-approved (approval mode).");
    } else {
      ctx.updateOutput?.(
        "Computer Use needs a one-time driver download (first use)."
      );
      const ok = await deps.promptInstallApproval(deps.approvalKey);
      if (!ok) {
        throw new Error(
          `Computer Use install declined by user. Re-invoke the tool to be prompted again.`
        );
      }
    }
    await saveInstallState(deps.homeDir, {
      approvedPackageSpec: deps.approvalKey,
      approvedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  await deps.install(ctx.updateOutput);
  if (deps.platform === "darwin") {
    await ensurePermissions(deps, ctx, pollIntervalMs, pollTimeoutMs);
  }
  await client.start(ctx.updateOutput);
}
__name(runBootstrap, "runBootstrap");
async function ensurePermissions(deps, ctx, pollIntervalMs, pollTimeoutMs) {
  let daemon = deps.startStatusDaemon();
  let openedAccessibility = false;
  let openedScreenRecording = false;
  try {
    const startedAt = Date.now();
    for (; ; ) {
      if (ctx.signal.aborted)
        throw new Error("Computer Use bootstrap aborted.");
      if (Date.now() - startedAt > pollTimeoutMs) {
        throw new Error(
          `Computer Use permission grant timed out after ${Math.round(
            pollTimeoutMs / 1e3
          )}s. Re-invoke the tool to retry.`
        );
      }
      await sleep(pollIntervalMs);
      const probe = await deps.probePermissions();
      if (probe === "ok") return;
      if (probe === "unknown") {
        daemon.kill();
        daemon = deps.startStatusDaemon();
        const elapsed = Math.round((Date.now() - startedAt) / 1e3);
        ctx.updateOutput?.(
          `Bringing up Computer Use permissions check\u2026 (${elapsed}s)`
        );
        continue;
      }
      if (probe === "accessibility") {
        if (!openedAccessibility) {
          openedAccessibility = true;
          deps.openPermissionPane("accessibility");
          ctx.updateOutput?.(
            "Step 1/2 \u2014 In the System Settings window that opened (Privacy & Security \u2192 Accessibility), turn ON CuaDriver. This continues automatically."
          );
        } else {
          const elapsed = Math.round((Date.now() - startedAt) / 1e3);
          ctx.updateOutput?.(
            `Waiting for Accessibility\u2026 (${elapsed}s) \u2014 enable CuaDriver in System Settings.`
          );
        }
        continue;
      }
      if (!openedScreenRecording) {
        openedScreenRecording = true;
        deps.openPermissionPane("screenRecording");
        ctx.updateOutput?.(
          "Step 2/2 \u2014 Accessibility granted. Now in System Settings (Privacy & Security \u2192 Screen & System Audio Recording), turn ON CuaDriver. macOS will ask to restart CuaDriver \u2014 allow it; that is expected. This continues automatically."
        );
      } else {
        const elapsed = Math.round((Date.now() - startedAt) / 1e3);
        ctx.updateOutput?.(
          `Waiting for Screen Recording\u2026 (${elapsed}s) \u2014 enable CuaDriver in System Settings.`
        );
      }
    }
  } finally {
    daemon.kill();
  }
}
__name(ensurePermissions, "ensurePermissions");
var sleep = /* @__PURE__ */ __name((ms) => new Promise((r) => setTimeout(r, ms)), "sleep");

// packages/core/src/tools/computer-use/tool.ts
import { homedir as homedir5 } from "node:os";
var INSTALL_REASON = "This downloads the Computer Use driver (~20MB, signed + notarized) into ~/.qwen/computer-use/ the first time. Computer Use can click, type, and read your desktop apps in the background. On macOS you'll be guided through Accessibility / Screen Recording permissions next.";
var HIGH_RISK_TOOLS = /* @__PURE__ */ new Set([
  "kill_app",
  "launch_app",
  "start_recording",
  "set_config",
  "replay_trajectory"
]);
var HIGH_RISK_PAGE_ACTIONS = /* @__PURE__ */ new Set([
  "execute_javascript",
  "enable_javascript_apple_events"
]);
for (const t of HIGH_RISK_TOOLS) {
  if (!(t in COMPUTER_USE_SCHEMAS)) {
    throw new Error(`HIGH_RISK_TOOLS contains unknown tool: ${t}`);
  }
}
function isHighRiskCall(upstreamName, params) {
  if (HIGH_RISK_TOOLS.has(upstreamName)) return true;
  return upstreamName === "page" && HIGH_RISK_PAGE_ACTIONS.has(params["action"]);
}
__name(isHighRiskCall, "isHighRiskCall");
var ComputerUseInvocation = class extends BaseToolInvocation {
  constructor(upstreamName, params, config) {
    super(params);
    this.upstreamName = upstreamName;
    this.config = config;
  }
  static {
    __name(this, "ComputerUseInvocation");
  }
  getDescription() {
    return safeJsonStringify(this.params);
  }
  /**
   * Always returns 'ask' so every desktop action surfaces through the
   * standard tool-permission dialog. The PermissionManager rule system
   * handles "always allow" per tool via ProceedAlwaysTool — that's the
   * single source of truth for repeat-approval behavior.
   *
   * Earlier this returned 'allow' once the install-state file existed,
   * which conflated install approval with per-action approval and
   * effectively granted blanket permission for all 9 computer_use__*
   * tools (including mutating actions like click / type_text / drag)
   * after the first install confirmation. See PR #4590 review for the
   * full discussion.
   */
  async getDefaultPermission() {
    return "ask";
  }
  /**
   * Builds the confirmation dialog. Two variants:
   *
   * 1. Install not yet approved → show install info (download size,
   *    permission flow to follow). onConfirm writes the install state
   *    so runBootstrap() inside execute() skips its env-var fallback
   *    prompt for headless contexts.
   *
   * 2. Install already approved → show per-action info (which tool +
   *    which args) so the user can decide whether THIS specific action
   *    is OK to perform.
   *
   * Both variants set permissionRules so the standard "Always allow"
   * outcomes (ProceedAlwaysTool / ProceedAlwaysUser / ProceedAlwaysProject)
   * add a rule via PermissionManager — subsequent calls of the SAME
   * tool then skip the dialog. Different tools each need their own
   * "always allow" choice; install approval no longer grants blanket
   * access.
   *
   * On Cancel: install state is NOT written; execute() / runBootstrap()
   * will use the env-var fallback (QWEN_COMPUTER_USE_AUTO_APPROVE),
   * which defaults to refusing — producing a clear error message.
   */
  async getConfirmationDetails(_abortSignal) {
    const permissionRules = [`computer_use__${this.upstreamName}`];
    const installApproved = await isPackageSpecApproved(
      homedir5(),
      approvalKey()
    );
    const onConfirm = /* @__PURE__ */ __name(async (outcome, _payload) => {
      if (outcome !== "cancel" /* Cancel */) {
        await saveInstallState(homedir5(), {
          approvedPackageSpec: approvalKey(),
          approvedAtIso: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }, "onConfirm");
    if (isHighRiskCall(this.upstreamName, this.params)) {
      return {
        type: "mcp",
        title: installApproved ? `Allow high-risk Computer Use (${this.upstreamName})` : `Allow high-risk Computer Use (${this.upstreamName}) \u2014 first use also downloads the driver`,
        serverName: "cua-driver",
        toolName: this.upstreamName,
        toolDisplayName: `computer_use__${this.upstreamName}`,
        permissionRules,
        onConfirm
      };
    }
    const argsJson = safeJsonStringify(this.params);
    const prompt = installApproved ? `Tool: computer_use__${this.upstreamName}

Args: ${argsJson}

This will act on your desktop via the Computer Use binary.` : `Tool: computer_use__${this.upstreamName}

Args: ${argsJson}

${INSTALL_REASON}`;
    return {
      type: "info",
      title: `Allow Computer Use (${this.upstreamName})`,
      prompt,
      permissionRules,
      onConfirm
    };
  }
  async execute(signal, updateOutput) {
    const client = ComputerUseClient.shared();
    client.setMaxImageDimension(
      resolveMaxImageDimension(this.config?.getComputerUseMaxImageDimension())
    );
    const autoApproveInstall = !!this.config;
    await runBootstrap(client, { signal, updateOutput, autoApproveInstall });
    let mcpResult;
    try {
      mcpResult = await client.callTool(this.upstreamName, this.params);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        llmContent: `Computer Use tool '${this.upstreamName}' failed: ${message}`,
        returnDisplay: `Error: ${message}`,
        error: { message }
      };
    }
    const llmContent = buildLlmContent(
      mcpResult.content,
      this.upstreamName,
      mcpResult.structuredContent
    );
    const returnDisplay = buildDisplayText(mcpResult.content);
    if (mcpResult.isError) {
      const errorText = returnDisplay || `Tool '${this.upstreamName}' returned isError=true`;
      return {
        llmContent: llmContent || errorText,
        returnDisplay: errorText,
        error: { message: errorText }
      };
    }
    return {
      llmContent,
      returnDisplay
    };
  }
};
var ComputerUseTool = class extends BaseDeclarativeTool {
  constructor(upstreamName, schema, config) {
    const qwenName = `computer_use__${upstreamName}`;
    super(
      qwenName,
      qwenName,
      // displayName == name; no MCP branding in UI
      schema.description,
      "other" /* Other */,
      schema.parameterSchema,
      true,
      // isOutputMarkdown — many results are JSON-ish text or screenshots
      true,
      // canUpdateOutput — bootstrap streams progress
      true,
      // shouldDefer — surface only via ToolSearch
      false,
      // alwaysLoad
      `computer use desktop click type screenshot mouse keyboard scroll drag automation gui app native`
    );
    this.upstreamName = upstreamName;
    this.config = config;
  }
  static {
    __name(this, "ComputerUseTool");
  }
  /**
   * Coerce parameter types before schema validation.
   * Models can send the wrong JS type for a field:
   *  - qwen3.6 sends `element_index: 2` (number) but upstream wants "2" (string)
   *  - Some models send `x: "500"` (string) but upstream wants 500 (number)
   * Pre-coercing avoids spurious validation failures without loosening schema types.
   */
  validateToolParams(params) {
    const coerced = coerceTypes(
      params,
      this.parameterSchema
    );
    return super.validateToolParams(coerced);
  }
  build(params) {
    const coerced = coerceTypes(
      params,
      this.parameterSchema
    );
    return super.build(coerced);
  }
  createInvocation(params) {
    return new ComputerUseInvocation(this.upstreamName, params, this.config);
  }
};
function coerceTypes(params, schema) {
  const properties = schema.properties;
  if (!properties) return params;
  const result = { ...params };
  for (const [key, value] of Object.entries(result)) {
    const fieldType = properties[key]?.type;
    if ((fieldType === "integer" || fieldType === "number") && typeof value === "string") {
      const trimmed = value.trim();
      const matchesType = fieldType === "integer" ? /^-?\d+$/.test(trimmed) : /^-?\d+(\.\d+)?$/.test(trimmed);
      if (matchesType) {
        const parsed = fieldType === "integer" ? parseInt(trimmed, 10) : parseFloat(trimmed);
        if (Number.isFinite(parsed)) {
          result[key] = parsed;
        }
      }
    } else if (fieldType === "string" && typeof value === "number") {
      result[key] = String(value);
    }
  }
  return result;
}
__name(coerceTypes, "coerceTypes");
function buildLlmContent(content, toolName, structuredContent) {
  const parts = [];
  for (const block of content) {
    if (block.type === "text" && block.text) {
      parts.push({ text: block.text });
    } else if ((block.type === "image" || block.type === "audio") && block.mimeType && block.data) {
      parts.push({
        text: `[Tool '${toolName}' provided the following ${block.type} data with mime-type: ${block.mimeType}]`
      });
      parts.push({
        inlineData: {
          mimeType: block.mimeType,
          data: block.data
        }
      });
    }
  }
  const structuredText = stringifyStructured(structuredContent);
  if (structuredText) {
    parts.push({ text: `Structured result: ${structuredText}` });
  }
  const hasNonText = parts.some((p) => p.inlineData !== void 0);
  if (!hasNonText) {
    return parts.map((p) => p.text ?? "").filter(Boolean).join("\n");
  }
  return parts;
}
__name(buildLlmContent, "buildLlmContent");
function buildDisplayText(content) {
  return content.map((block) => block.type === "text" ? block.text ?? "" : "").filter(Boolean).join("\n");
}
__name(buildDisplayText, "buildDisplayText");
function stringifyStructured(structured) {
  if (!structured || typeof structured !== "object") return void 0;
  const rest = {};
  for (const [k, v] of Object.entries(structured)) {
    if (k === "tree_markdown") continue;
    rest[k] = v;
  }
  if (Object.keys(rest).length === 0) return void 0;
  return safeJsonStringify(rest);
}
__name(stringifyStructured, "stringifyStructured");

// packages/core/src/tools/computer-use/index.ts
async function registerComputerUseTools(registerLazy, config) {
  for (const upstreamName of COMPUTER_USE_TOOL_NAMES) {
    const schema = COMPUTER_USE_SCHEMAS[upstreamName];
    const qwenName = `computer_use__${upstreamName}`;
    await registerLazy(
      qwenName,
      async () => new ComputerUseTool(upstreamName, schema, config)
    );
  }
}
__name(registerComputerUseTools, "registerComputerUseTools");
export {
  COMPUTER_USE_SCHEMAS,
  COMPUTER_USE_TOOL_NAMES,
  ComputerUseClient,
  ComputerUseTool,
  registerComputerUseTools
};
/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
