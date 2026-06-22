#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Qwen Code
 * SPDX-License-Identifier: Apache-2.0
 */

// [exptech-fork] NEW FILE — build & publish the fork's `release` branch.
//
// Produces ./dist (flat, scriptless, zero-dep package via build → bundle →
// prepare:package), then publishes TWO consumer install paths to an ORPHAN
// `release` branch (single commit, tiny history):
//
//   1. FAST  — a prebuilt npm tarball `qwen-code-fork.tgz` at the branch root.
//      Install: npm i -g https://raw.githubusercontent.com/ExpTechTW/qwen-code/release/qwen-code-fork.tgz
//      (one download, NO git clone — by far the fastest.)
//   2. git   — the unpacked package at the branch root.
//      Install: npm i -g github:ExpTechTW/qwen-code#release
//      (works, but npm full-clones the repo — slow; kept as a fallback.)
//
// The bulky web-shell SPA (`qwen serve` UI, ~17 MB) is stripped from the release
// to keep both paths small. The core CLI is unaffected; `qwen serve` is not
// available in the release build (build from source if you need it).
//
// Usage:
//   node scripts/build-release-branch.mjs            # build + commit locally
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
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const BRANCH = 'release';
const TMP_BRANCH = 'exptech-release-build';
const TARBALL_NAME = 'qwen-code-fork.tgz';

const args = new Set(process.argv.slice(2));
const skipBuild = args.has('--skip-build');
const doPush = args.has('--push');

const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8' });
const gitIO = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: 'inherit' });
const npm = (cwd, ...a) => execFileSync('npm', a, { cwd, stdio: 'inherit' });
const npmOut = (cwd, ...a) => execFileSync('npm', a, { cwd, encoding: 'utf8' });
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
  npm(root, 'run', 'build');
  npm(root, 'run', 'bundle');
  npm(root, 'run', 'prepare:package');
}
if (!existsSync(join(dist, 'package.json'))) {
  console.error(
    '[release] ERROR: dist/package.json missing — build did not produce a publishable package.',
  );
  process.exit(1);
}

// 2. Slim the release: drop the web-shell SPA (only used by `qwen serve`).
const webShell = join(dist, 'web-shell');
if (existsSync(webShell)) {
  rmSync(webShell, { recursive: true, force: true });
  console.log('[release] stripped dist/web-shell (qwen serve UI not in release build)');
}
const pkgPath = join(dist, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
if (Array.isArray(pkg.files)) {
  pkg.files = pkg.files.filter((f) => f !== 'web-shell' && f !== 'web-shell/');
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}
const version = pkg.version;
const sha = git(root, 'rev-parse', '--short', 'HEAD').trim();

// 3. Pack the prebuilt npm tarball (fast install path).
quiet(() => rmSync(join(dist, TARBALL_NAME), { force: true }));
const packOut = npmOut(dist, 'pack', '--silent').trim();
const producedTgz = packOut.split('\n').filter(Boolean).pop();
if (!producedTgz || !existsSync(join(dist, producedTgz))) {
  console.error(`[release] ERROR: npm pack did not produce a tarball (got "${packOut}").`);
  process.exit(1);
}
renameSync(join(dist, producedTgz), join(dist, TARBALL_NAME));
console.log(`[release] packed ${TARBALL_NAME} from ${producedTgz}`);

console.log(`[release] publishing version ${version} (${sha}) as orphan`);

// 4. Fresh orphan branch in a throwaway worktree.
quiet(() => git(root, 'worktree', 'prune'));
quiet(() => git(root, 'branch', '-D', TMP_BRANCH));
const worktree = mkdtempSync(join(tmpdir(), 'qwen-release-'));

try {
  gitIO(root, 'worktree', 'add', '--detach', worktree, 'HEAD');
  gitIO(worktree, 'checkout', '--orphan', TMP_BRANCH);
  quiet(() => gitIO(worktree, 'rm', '-rf', '--quiet', '.'));
  for (const entry of readdirSync(worktree)) {
    if (entry === '.git') continue;
    rmSync(join(worktree, entry), { recursive: true, force: true });
  }
  for (const entry of readdirSync(dist)) {
    cpSync(join(dist, entry), join(worktree, entry), { recursive: true });
  }
  gitIO(worktree, 'add', '-A');
  gitIO(worktree, 'commit', '-m', `release ${version} (${sha})`);

  if (doPush) {
    gitIO(worktree, 'push', '--force', 'origin', `${TMP_BRANCH}:${BRANCH}`);
    console.log(`[release] force-pushed origin/${BRANCH} (orphan).`);
  } else {
    console.log(
      `[release] built local orphan '${TMP_BRANCH}'. Re-run with --push to publish.`,
    );
  }
} finally {
  quiet(() => git(root, 'worktree', 'remove', '--force', worktree));
  quiet(() => git(root, 'branch', '-D', TMP_BRANCH));
}

console.log('[release] done.');
console.log(
  `[release] FAST:  npm i -g https://raw.githubusercontent.com/ExpTechTW/qwen-code/${BRANCH}/${TARBALL_NAME}`,
);
console.log(`[release] git:   npm i -g github:ExpTechTW/qwen-code#${BRANCH}`);
