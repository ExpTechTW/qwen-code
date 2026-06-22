#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Qwen Code
 * SPDX-License-Identifier: Apache-2.0
 */

// [exptech-fork] NEW FILE — build the prebuilt, consumer-installable `release` branch.
//
// `npm i -g github:ExpTechTW/qwen-code#release` must work with NO build and NO
// patch-package on the consumer. We achieve that by publishing the contents of
// ./dist (a flat, scriptless, zero-dependency package produced by
// build → bundle → prepare:package) to the ROOT of the `release` branch.
//
// Usage:
//   node scripts/build-release-branch.mjs            # build + commit to local `release`
//   node scripts/build-release-branch.mjs --push     # also push origin/release
//   node scripts/build-release-branch.mjs --skip-build --push   # reuse existing ./dist
//
// See CLAUDE.md §Fork edits → Build & release procedure.

import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const BRANCH = 'release';

const args = new Set(process.argv.slice(2));
const skipBuild = args.has('--skip-build');
const doPush = args.has('--push');

function git(cwd, ...gitArgs) {
  return execFileSync('git', gitArgs, { cwd, encoding: 'utf8' });
}
function gitInherit(cwd, ...gitArgs) {
  execFileSync('git', gitArgs, { cwd, stdio: 'inherit' });
}
function npm(...npmArgs) {
  execFileSync('npm', npmArgs, { cwd: root, stdio: 'inherit' });
}

// 1. Build the publishable artifact (./dist).
if (!skipBuild) {
  console.log('[release] building dist/ (build → bundle → prepare:package)...');
  npm('run', 'build');
  npm('run', 'bundle');
  npm('run', 'prepare:package');
}
if (!existsSync(join(dist, 'package.json'))) {
  console.error(
    '[release] ERROR: dist/package.json is missing — the build did not produce a publishable package.',
  );
  process.exit(1);
}

const version = JSON.parse(
  readFileSync(join(dist, 'package.json'), 'utf8'),
).version;
const sha = git(root, 'rev-parse', '--short', 'HEAD').trim();
console.log(`[release] publishing dist/ for version ${version} (${sha})`);

// 2. Prepare a throwaway worktree on the `release` branch.
git(root, 'worktree', 'prune');
const worktree = mkdtempSync(join(tmpdir(), 'qwen-release-'));

let remoteHasRelease = false;
try {
  git(root, 'ls-remote', '--exit-code', '--heads', 'origin', BRANCH);
  remoteHasRelease = true;
} catch {
  remoteHasRelease = false;
}

try {
  if (remoteHasRelease) {
    git(root, 'fetch', 'origin', BRANCH);
    gitInherit(root, 'worktree', 'add', '-B', BRANCH, worktree, `origin/${BRANCH}`);
  } else {
    // First release: base the branch on HEAD; contents are replaced below.
    gitInherit(root, 'worktree', 'add', '-B', BRANCH, worktree, 'HEAD');
  }

  // 3. Replace the worktree contents with ./dist.
  for (const entry of readdirSync(worktree)) {
    if (entry === '.git') continue;
    rmSync(join(worktree, entry), { recursive: true, force: true });
  }
  for (const entry of readdirSync(dist)) {
    cpSync(join(dist, entry), join(worktree, entry), { recursive: true });
  }

  // 4. Commit (and optionally push).
  gitInherit(worktree, 'add', '-A');
  const status = git(worktree, 'status', '--porcelain').trim();
  if (status) {
    gitInherit(worktree, 'commit', '-m', `release ${version} (${sha})`);
  } else {
    console.log('[release] no changes — release branch already up to date.');
  }

  if (doPush) {
    gitInherit(worktree, 'push', '-u', 'origin', BRANCH);
    console.log(`[release] pushed origin/${BRANCH}.`);
  } else {
    console.log(
      `[release] local '${BRANCH}' branch updated. Re-run with --push to publish.`,
    );
  }
} finally {
  try {
    git(root, 'worktree', 'remove', '--force', worktree);
  } catch {
    /* best-effort cleanup */
  }
}

console.log('[release] done. Consumers: npm i -g github:ExpTechTW/qwen-code#release');
