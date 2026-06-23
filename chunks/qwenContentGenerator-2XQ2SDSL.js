// Force strict mode and setup for ESM
"use strict";
import {
  DashScopeOpenAICompatibleProvider,
  OpenAIContentGenerator
} from "./chunk-VI32S3UL.js";
import "./chunk-JRVB4QUY.js";
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
import "./chunk-V5A63HWJ.js";
import {
  SharedTokenManager
} from "./chunk-BGUDAULQ.js";
import "./chunk-EW6C27XX.js";
import "./chunk-22IFUCVR.js";
import "./chunk-64WXLC72.js";
import "./chunk-3UALQ56H.js";
import {
  DEFAULT_DASHSCOPE_BASE_URL
} from "./chunk-JDV3VBPY.js";
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

// packages/core/src/qwen/qwenContentGenerator.ts
init_esbuild_shims();
var QwenContentGenerator = class extends OpenAIContentGenerator {
  static {
    __name(this, "QwenContentGenerator");
  }
  debugLogger = createDebugLogger("QWEN");
  qwenClient;
  sharedManager;
  currentToken;
  constructor(qwenClient, contentGeneratorConfig, cliConfig) {
    const dashscopeProvider = new DashScopeOpenAICompatibleProvider(
      contentGeneratorConfig,
      cliConfig
    );
    super(contentGeneratorConfig, cliConfig, dashscopeProvider);
    this.qwenClient = qwenClient;
    this.sharedManager = SharedTokenManager.getInstance();
    if (contentGeneratorConfig?.baseUrl && contentGeneratorConfig?.apiKey) {
      this.pipeline.client.baseURL = contentGeneratorConfig?.baseUrl;
      this.pipeline.client.apiKey = contentGeneratorConfig?.apiKey;
    }
  }
  /**
   * Get the current endpoint URL with proper protocol and /v1 suffix
   */
  getCurrentEndpoint(resourceUrl) {
    const baseEndpoint = resourceUrl || DEFAULT_DASHSCOPE_BASE_URL;
    const suffix = "/v1";
    const normalizedUrl = /^https?:\/\//i.test(baseEndpoint) ? baseEndpoint : `https://${baseEndpoint}`;
    return normalizedUrl.endsWith(suffix) ? normalizedUrl : `${normalizedUrl}${suffix}`;
  }
  /**
   * Override error logging behavior to suppress auth errors during token refresh
   */
  shouldSuppressErrorLogging(error, _request) {
    return this.isAuthError(error);
  }
  /**
   * Get valid token and endpoint using the shared token manager
   */
  async getValidToken() {
    try {
      const credentials = await this.sharedManager.getValidCredentials(
        this.qwenClient
      );
      if (!credentials.access_token) {
        throw new Error("No access token available");
      }
      return {
        token: credentials.access_token,
        endpoint: this.getCurrentEndpoint(credentials.resource_url)
      };
    } catch (error) {
      if (this.isAuthError(error)) {
        throw error;
      }
      this.debugLogger.warn("Failed to get token from shared manager:", error);
      throw new Error(
        "Failed to obtain valid Qwen access token. Please re-authenticate."
      );
    }
  }
  /**
   * Execute an operation with automatic credential management and retry logic.
   * This method handles:
   * - Dynamic token and endpoint retrieval
   * - Client configuration updates
   * - Retry logic on authentication errors with token refresh
   *
   * @param operation - The operation to execute with updated client configuration
   * @returns The result of the operation
   */
  async executeWithCredentialManagement(operation) {
    const attemptOperation = /* @__PURE__ */ __name(async () => {
      const { token, endpoint } = await this.getValidToken();
      this.pipeline.client.apiKey = token;
      this.pipeline.client.baseURL = endpoint;
      return await operation();
    }, "attemptOperation");
    try {
      return await attemptOperation();
    } catch (error) {
      if (this.isAuthError(error)) {
        await this.sharedManager.getValidCredentials(this.qwenClient, true);
        return await attemptOperation();
      }
      throw error;
    }
  }
  /**
   * Override to use dynamic token and endpoint with automatic retry
   */
  async generateContent(request, userPromptId) {
    return this.executeWithCredentialManagement(
      () => super.generateContent(request, userPromptId)
    );
  }
  /**
   * Override to use dynamic token and endpoint with automatic retry
   */
  async generateContentStream(request, userPromptId) {
    return this.executeWithCredentialManagement(
      () => super.generateContentStream(request, userPromptId)
    );
  }
  /**
   * Override to use dynamic token and endpoint with automatic retry
   */
  async countTokens(request) {
    return super.countTokens(request);
  }
  /**
   * Override to use dynamic token and endpoint with automatic retry
   */
  async embedContent(request) {
    return this.executeWithCredentialManagement(
      () => super.embedContent(request)
    );
  }
  /**
   * Check if an error is related to authentication/authorization
   */
  isAuthError(error) {
    if (!error) return false;
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    const errorWithCode = error;
    const errorCode = errorWithCode?.status || errorWithCode?.code;
    return errorCode === 401 || errorCode === 403 || errorCode === "401" || errorCode === "403" || errorMessage.includes("unauthorized") || errorMessage.includes("forbidden") || errorMessage.includes("invalid api key") || errorMessage.includes("invalid access token") || errorMessage.includes("token expired") || errorMessage.includes("authentication") || errorMessage.includes("access denied") || errorMessage.includes("token") && errorMessage.includes("expired");
  }
  /**
   * Get the current cached token (may be expired)
   */
  getCurrentToken() {
    if (this.currentToken) {
      return this.currentToken;
    }
    const credentials = this.sharedManager.getCurrentCredentials();
    return credentials?.access_token || null;
  }
  /**
   * Clear the cached token
   */
  clearToken() {
    this.currentToken = void 0;
    this.sharedManager.clearCache();
  }
};
export {
  QwenContentGenerator
};
/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
