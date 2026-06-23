// Force strict mode and setup for ESM
"use strict";
import {
  Mutex
} from "./chunk-OMX7CUOE.js";
import {
  atomicWriteJSON
} from "./chunk-3UALQ56H.js";
import {
  Storage,
  getProjectHash
} from "./chunk-C4K3FEQ2.js";
import {
  init_esbuild_shims
} from "./chunk-A4BMJM77.js";
import {
  __name
} from "./chunk-J2S4EL5Y.js";

// packages/core/src/services/cronTasksFile.ts
init_esbuild_shims();
import * as fs from "node:fs/promises";
import * as path from "node:path";
var TASKS_FILENAME = "scheduled_tasks.json";
var CRON_TASKS_DISPLAY_PATH = `~/.qwen/tmp/<project-hash>/${TASKS_FILENAME}`;
var UPDATE_LOCK_RETRY_MS = 15;
var UPDATE_LOCK_STALE_MS = 2e3;
var UPDATE_LOCK_TIMEOUT_MS = 3e3;
var updateStaleSeq = 0;
var updateMutexes = /* @__PURE__ */ new Map();
function getUpdateMutex(filePath) {
  let mutex = updateMutexes.get(filePath);
  if (!mutex) {
    mutex = new Mutex();
    updateMutexes.set(filePath, mutex);
  }
  return mutex;
}
__name(getUpdateMutex, "getUpdateMutex");
function getCronFilePath(projectRoot) {
  return path.join(
    Storage.getGlobalTempDir(),
    getProjectHash(projectRoot),
    TASKS_FILENAME
  );
}
__name(getCronFilePath, "getCronFilePath");
async function readCronTasks(projectRoot) {
  const filePath = getCronFilePath(projectRoot);
  let raw;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `Malformed JSON in ${filePath} \u2014 fix or delete the file; refusing to treat it as an empty schedule.`
    );
  }
  if (!Array.isArray(parsed)) {
    throw new Error(
      `Expected a JSON array in ${filePath} \u2014 fix or delete the file; refusing to treat it as an empty schedule.`
    );
  }
  for (const [index, task] of parsed.entries()) {
    if (!isValidTask(task)) {
      throw new Error(
        `Invalid task entry at index ${index} in ${filePath} \u2014 fix or delete the entry; refusing to drop it from the schedule.`
      );
    }
  }
  return parsed;
}
__name(readCronTasks, "readCronTasks");
async function writeCronTasks(projectRoot, tasks) {
  const filePath = getCronFilePath(projectRoot);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await atomicWriteJSON(filePath, tasks, { noFollow: true });
}
__name(writeCronTasks, "writeCronTasks");
async function acquireUpdateLock(filePath) {
  const lockPath = `${filePath}.lock`;
  await fs.mkdir(path.dirname(lockPath), { recursive: true });
  const deadline = Date.now() + UPDATE_LOCK_TIMEOUT_MS;
  for (; ; ) {
    if (Date.now() > deadline) {
      throw new Error(
        `Timed out waiting for scheduled-tasks lock (${lockPath})`
      );
    }
    try {
      await fs.writeFile(lockPath, String(process.pid), { flag: "wx" });
      return async () => {
        await fs.unlink(lockPath).catch(() => {
        });
      };
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
    try {
      const stat2 = await fs.stat(lockPath);
      if (Date.now() - stat2.mtimeMs > UPDATE_LOCK_STALE_MS) {
        const stalePath = `${lockPath}.stale.${process.pid}.${updateStaleSeq++}`;
        try {
          await fs.rename(lockPath, stalePath);
        } catch {
          continue;
        }
        const moved = await fs.stat(stalePath).catch(() => null);
        if (moved && Date.now() - moved.mtimeMs <= UPDATE_LOCK_STALE_MS) {
          await fs.link(stalePath, lockPath).catch(() => {
          });
        }
        await fs.unlink(stalePath).catch(() => {
        });
        continue;
      }
    } catch {
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, UPDATE_LOCK_RETRY_MS));
  }
}
__name(acquireUpdateLock, "acquireUpdateLock");
async function updateCronTasks(projectRoot, mutate) {
  const filePath = getCronFilePath(projectRoot);
  return getUpdateMutex(filePath).runExclusive(async () => {
    const release = await acquireUpdateLock(filePath);
    try {
      const tasks = await readCronTasks(projectRoot);
      const next = mutate(tasks);
      if (next !== tasks) {
        await writeCronTasks(projectRoot, next);
      }
    } finally {
      await release();
    }
  });
}
__name(updateCronTasks, "updateCronTasks");
async function addCronTask(projectRoot, task) {
  await updateCronTasks(projectRoot, (tasks) => [...tasks, task]);
}
__name(addCronTask, "addCronTask");
async function removeCronTasks(projectRoot, ids) {
  const idSet = new Set(ids);
  const current = await readCronTasks(projectRoot);
  if (!current.some((t) => idSet.has(t.id))) return 0;
  let removed = 0;
  await updateCronTasks(projectRoot, (tasks) => {
    const remaining = tasks.filter((t) => !idSet.has(t.id));
    removed = tasks.length - remaining.length;
    return removed === 0 ? tasks : remaining;
  });
  return removed;
}
__name(removeCronTasks, "removeCronTasks");
function isValidTask(value) {
  if (typeof value !== "object" || value === null) return false;
  const obj = value;
  return typeof obj["id"] === "string" && typeof obj["cron"] === "string" && typeof obj["prompt"] === "string" && typeof obj["recurring"] === "boolean" && typeof obj["createdAt"] === "number" && (obj["lastFiredAt"] === null || typeof obj["lastFiredAt"] === "number");
}
__name(isValidTask, "isValidTask");

export {
  CRON_TASKS_DISPLAY_PATH,
  getCronFilePath,
  readCronTasks,
  updateCronTasks,
  addCronTask,
  removeCronTasks
};
