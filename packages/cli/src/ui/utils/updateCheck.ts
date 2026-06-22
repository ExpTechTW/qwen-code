/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// [exptech-fork] This file is fork-owned: the upstream version checks the npm
// registry (@qwen-code/qwen-code) via update-notifier, which would nag fork
// users toward the UPSTREAM release. The fork ships via the prebuilt `release`
// branch, so we check that branch's package.json version instead and point the
// user at FORK_INSTALL_COMMAND. On upstream merges, reconcile per CLAUDE.md
// §Fork edits (this whole file is intentionally divergent).

import type { UpdateInfo } from 'update-notifier';
import semver from 'semver';
import { getPackageJson } from '../../utils/package.js';
import { createDebugLogger } from '@qwen-code/qwen-code-core';
import {
  FORK_RELEASE_PACKAGE_JSON_URL,
  FORK_INSTALL_COMMAND,
} from '../../fork/fork-config.js';

const debugLogger = createDebugLogger('UPDATE_CHECK');

export const FETCH_TIMEOUT_MS = 2000;

export interface UpdateObject {
  message: string;
  update: UpdateInfo;
}

export async function checkForUpdates(): Promise<UpdateObject | null> {
  try {
    // Skip update check when running from source (development mode)
    if (process.env['DEV'] === 'true') {
      return null;
    }
    const packageJson = await getPackageJson();
    const currentVersion = packageJson?.version;
    const name = packageJson?.name ?? '@qwen-code/qwen-code';
    if (!currentVersion) {
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let latest: string | undefined;
    try {
      const resp = await fetch(FORK_RELEASE_PACKAGE_JSON_URL, {
        signal: controller.signal,
        headers: { accept: 'application/json' },
      });
      if (resp.ok) {
        const remote = (await resp.json()) as { version?: string };
        latest = remote.version;
      }
    } finally {
      clearTimeout(timeout);
    }

    if (
      latest &&
      semver.valid(latest) &&
      semver.gt(latest, currentVersion)
    ) {
      const message = `Qwen Code (ExpTech fork) update available! ${currentVersion} → ${latest}\nRun: ${FORK_INSTALL_COMMAND}`;
      return {
        message,
        update: {
          name,
          current: currentVersion,
          latest,
          type: 'latest',
        } as UpdateInfo,
      };
    }

    return null;
  } catch (e) {
    debugLogger.warn('Failed to check for updates: ' + e);
    return null;
  }
}
