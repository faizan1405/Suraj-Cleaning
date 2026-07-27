import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const DATA_DIR = join(process.cwd(), "src", "data");
const TMP_DIR = "/tmp/suraj-cleaning-data";

// In-memory write cache — persists for this serverless instance lifetime
const writeCache = new Map<string, unknown>();

function ensureTmpDir(): void {
  try {
    mkdirSync(TMP_DIR, { recursive: true });
  } catch {
    // /tmp always exists on Vercel's Node.js runtime
  }
}

export function readJsonFile<T>(relativePath: string): T {
  // Check in-memory cache first (catches recent writes in this instance)
  const cacheKey = relativePath;
  if (writeCache.has(cacheKey)) {
    return writeCache.get(cacheKey) as T;
  }

  // Try reading from the bundled data files (read-only on Vercel)
  const fullPath = join(DATA_DIR, relativePath);
  try {
    const content = readFileSync(fullPath, "utf-8");
    const data = JSON.parse(content) as T;
    writeCache.set(cacheKey, data);
    return data;
  } catch {
    // File not found or unreadable — return empty default
    return [] as T;
  }
}

export function writeJsonFile<T>(relativePath: string, data: T): void {
  const cacheKey = relativePath;
  writeCache.set(cacheKey, data);

  // Attempt to persist to disk — uses /tmp on Vercel (writable, instance-scoped)
  // Writes survive across requests within this serverless instance.
  // On cold start (new instance), data resets to the bundled JSON defaults.
  // For fully persistent storage, connect a real database.
  try {
    ensureTmpDir();
    const tmpPath = join(TMP_DIR, relativePath);
    mkdirSync(dirname(tmpPath), { recursive: true });
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // If disk write fails, data is still available in memory for this instance
  }
}
