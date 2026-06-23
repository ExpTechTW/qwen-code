#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, 'cli.js');

const result = spawnSync(
  process.execPath,
  ['--expose-gc', cliPath, ...process.argv.slice(2)],
  { stdio: 'inherit' },
);

if (result.signal) {
  process.kill(process.pid, result.signal);
} else {
  process.exit(result.status ?? 1);
}
