import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const DATA_DIR = join(process.cwd(), "src", "data");
const TMP_DIR = "/tmp/suraj-cleaning-data";

// In-memory write cache — keeps data consistent across reads/writes in the same process
const writeCache = new Map<string, unknown>();

function ensureTmpDir(): void {
  try {
    mkdirSync(TMP_DIR, { recursive: true });
  } catch {
    // /tmp always exists on Vercel's Node.js runtime
  }
}

export function readJsonFile<T>(relativePath: string): T {
  const key = relativePath;

  // Serve from memory cache if we have it (guarantees reads see latest writes)
  if (writeCache.has(key)) {
    return writeCache.get(key) as T;
  }

  // Try /tmp first (writable on Vercel, survives across requests in same instance)
  try {
    const tmpPath = join(TMP_DIR, relativePath);
    const content = readFileSync(tmpPath, "utf-8");
    const data = JSON.parse(content) as T;
    writeCache.set(key, data);
    return data;
  } catch {
    // Fall back to bundled data files
  }

  // Read from disk (bundled data, read-only on Vercel)
  try {
    const fullPath = join(DATA_DIR, relativePath);
    const content = readFileSync(fullPath, "utf-8");
    const parsed = JSON.parse(content) as T;
    writeCache.set(key, parsed);
    return parsed;
  } catch {
    // File not found or invalid — return empty default
    return [] as T;
  }
}

export function writeJsonFile<T>(relativePath: string, data: T): void {
  const key = relativePath;

  // Always update memory cache first (fast, guaranteed to work)
  writeCache.set(key, data);

  // Persist to disk — uses /tmp on Vercel (writable, instance-scoped)
  try {
    ensureTmpDir();
    const tmpPath = join(TMP_DIR, relativePath);
    mkdirSync(dirname(tmpPath), { recursive: true });
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Log so we can debug on Vercel, but don't crash the request
    console.error(`Failed to write ${relativePath}:`, err);
  }
}
