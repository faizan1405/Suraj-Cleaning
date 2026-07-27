import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { tmpdir } from "os";

const SOURCE_DIR = join(process.cwd(), "src", "data");
const TMP_DIR = join(tmpdir(), "suraj-cleaning-data");

// In-memory write cache — keeps data consistent across reads/writes in the same process
const writeCache = new Map<string, unknown>();

function ensureDirs(): void {
  try {
    mkdirSync(TMP_DIR, { recursive: true });
  } catch {
    // tmpdir always exists on all platforms
  }
  try {
    mkdirSync(SOURCE_DIR, { recursive: true });
  } catch {
    // source dir always exists in a Next.js project
  }
}

// Resolve the writable path for a given relative file.
// Prefer SOURCE_DIR so admin edits are always persisted to git-tracked data.
// Falls back to TMP_DIR only if SOURCE_DIR is not writable.
function getWritablePath(relativePath: string): string {
  const sourcePath = join(SOURCE_DIR, relativePath);
  try {
    // Probe write access by attempting to write a zero-byte file and clean up
    writeFileSync(sourcePath, readFileSync(sourcePath, "utf-8"), "utf-8");
    return sourcePath;
  } catch {
    const tmpPath = join(TMP_DIR, relativePath);
    mkdirSync(dirname(tmpPath), { recursive: true });
    return tmpPath;
  }
}

export function readJsonFile<T>(relativePath: string): T {
  const key = relativePath;

  // Serve from memory cache if we have it (guarantees reads see latest writes)
  if (writeCache.has(key)) {
    return writeCache.get(key) as T;
  }

  // Try SOURCE_DIR first — this is the persistent source of truth
  try {
    const sourcePath = join(SOURCE_DIR, relativePath);
    const content = readFileSync(sourcePath, "utf-8");
    const parsed = JSON.parse(content) as T;
    writeCache.set(key, parsed);
    return parsed;
  } catch {
    // Fall through to TMP_DIR
  }

  // Try TMP_DIR (instance-scoped, may have runtime overrides)
  try {
    const tmpPath = join(TMP_DIR, relativePath);
    const content = readFileSync(tmpPath, "utf-8");
    const data = JSON.parse(content) as T;
    writeCache.set(key, data);
    return data;
  } catch {
    // File not found or invalid — return empty default
    return [] as T;
  }
}

export function writeJsonFile<T>(relativePath: string, data: T): void {
  const key = relativePath;

  // Always update memory cache first (fast, guaranteed to work)
  writeCache.set(key, data);

  ensureDirs();

  // Write to SOURCE_DIR (src/data) — this is the persistent source of truth
  try {
    const sourcePath = join(SOURCE_DIR, relativePath);
    mkdirSync(dirname(sourcePath), { recursive: true });
    writeFileSync(sourcePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to write ${relativePath} to source:`, err);
  }

  // Also persist to TMP_DIR as a runtime cache
  try {
    const tmpPath = join(TMP_DIR, relativePath);
    mkdirSync(dirname(tmpPath), { recursive: true });
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to write ${relativePath} to tmp:`, err);
  }
}
