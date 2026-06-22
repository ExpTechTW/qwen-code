/**
 * @license
 * Copyright 2025 Qwen Code
 * SPDX-License-Identifier: Apache-2.0
 */

// [exptech-fork] NEW FILE — central fork distribution/update constants.
// Every fork-specific URL / install command lives here so the upstream-file
// edits that consume them are 1-line imports and changing distribution never
// means re-touching upstream files. See CLAUDE.md §Fork edits.

/** GitHub "owner/repo" for the fork. */
export const FORK_REPO = 'ExpTechTW/qwen-code';

/** Branch that holds the prebuilt, scriptless package (consumer-installable). */
export const FORK_RELEASE_REF = 'release';

/** npm git-install spec for the prebuilt release branch. */
export const FORK_INSTALL_REF = `github:${FORK_REPO}#${FORK_RELEASE_REF}`;

/** The command a user runs to install / update the fork. */
export const FORK_INSTALL_COMMAND = `npm install -g ${FORK_INSTALL_REF}`;

/** Base URL for fork GitHub release assets (standalone binaries). */
export const FORK_GITHUB_RELEASE_BASE = `https://github.com/${FORK_REPO}/releases/download`;

/** Raw package.json on the release branch — used for lightweight version checks. */
export const FORK_RELEASE_PACKAGE_JSON_URL = `https://raw.githubusercontent.com/${FORK_REPO}/${FORK_RELEASE_REF}/package.json`;
