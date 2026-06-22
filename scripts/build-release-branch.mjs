#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Qwen Code
 * SPDX-License-Identifier: Apache-2.0
 */

// [exptech-fork] NEW FILE — build the prebuilt, consumer-installable `release` branch.
//
// `npm i -g github:ExpTechTW/qwen-code#release` must work with NO build and NO
// patch-package on the consumer. We publish the contents of ./dist (a flat,
// scriptless, zero-dependency package produced by build → bundle →
// prepare:package) to the ROOT of the `release` branch.
//
// The branch is published as an ORPHAN single commit (no source history), so
// the consumer's `npm install` clone is tiny and fast.
//
// Usage:
//   node scripts/build-release-branch.mjs            # build + commit locally (temp branch)
//   node scripts/build-release-branch.mjs --push     # also force-push origin/release
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
const TMP_BRANCH = 'exptech-release-build'; // local-only orphan; never collides with `release`

const args = new Set(process.argv.slice(2));
const skipBuild = args.has('--skip-build');
const doPush = args.has('--push');

const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8' });
const gitIO = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: 'inherit' });
const npm = (...a) => execFileSync('npm', a, { cwd: root, stdio: 'inherit' });
const quiet = (fn) => {
  try {
    fn();
  } catch {
    /* best-effort */
  }
};

// 1. Build the publishable artifact (./dist).
if (!skipBuild) {
  console.log('[release] building dist/ (build → bundle → prepare:package)...');
  npm('run', 'build');
  npm('run', 'bundle');
  npm('run', 'prepare:package');
}
if (!existsSync(join(dist, 'package.json'))) {
  console.error(
    '[release] ERROR: dist/package.json missing — build did not produce a publishable package.',
  );
  process.exit(1);
}

const version = JSON.parse(
  readFileSync(join(dist, 'package.json'), 'utf8'),
).version;
const sha = git(root, 'rev-parse', '--short', 'HEAD').trim();
console.log(`[release] publishing dist/ for version ${version} (${sha}) as orphan`);

// 2. Fresh orphan branch in a throwaway worktree.
quiet(() => git(root, 'worktree', 'prune'));
quiet(() => git(root, 'branch', '-D', TMP_BRANCH));
const worktree = mkdtempSync(join(tmpdir(), 'qwen-release-'));

try {
  gitIO(root, 'worktree', 'add', '--detach', worktree, 'HEAD');
  gitIO(worktree, 'checkout', '--orphan', TMP_BRANCH);

  // 3. Clear the worktree and replace with ./dist contents.
  quiet(() => gitIO(worktree, 'rm', '-rf', '--quiet', '.'));
  for (const entry of readdirSync(worktree)) {
    if (entry === '.git') continue;
    rmSync(join(worktree, entry), { recursive: true, force: true });
  }
  for (const entry of readdirSync(dist)) {
    cpSync(join(dist, entry), join(worktree, entry), { recursive: true });
  }

  // 4. Single orphan commit.
  gitIO(worktree, 'add', '-A');
  gitIO(worktree, 'commit', '-m', `release ${version} (${sha})`);

  // 5. Force-push the orphan to origin/release (tiny, single-commit branch).
  if (doPush) {
    gitIO(worktree, 'push', '--force', 'origin', `${TMP_BRANCH}:${BRANCH}`);
    console.log(`[release] force-pushed origin/${BRANCH} (orphan).`);
  } else {
    console.log(
      `[release] built local orphan '${TMP_BRANCH}'. Re-run with --push to publish to '${BRANCH}'.`,
    );
  }
} finally {
  quiet(() => git(root, 'worktree', 'remove', '--force', worktree));
  quiet(() => git(root, 'branch', '-D', TMP_BRANCH));
}

console.log('[release] done. Consumers: npm i -g github:ExpTechTW/qwen-code#release');
