import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

const DATA_DIR = join(process.cwd(), "src", "data");

// In-memory cache — keeps data consistent across reads/writes in the same process
const memoryCache = new Map<string, unknown>();

function dataPath(relativePath: string): string {
  return join(DATA_DIR, relativePath);
}

export function readJsonFile<T>(relativePath: string): T {
  const key = relativePath;

  // Serve from memory cache if we have it (guarantees reads see latest writes)
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  // Read from disk
  try {
    const fullPath = dataPath(relativePath);
    const content = readFileSync(fullPath, "utf-8");
    const parsed = JSON.parse(content) as T;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    // File not found or invalid — return empty default
    return [] as T;
  }
}

export function writeJsonFile<T>(relativePath: string, data: T): void {
  const key = relativePath;

  // Always update memory cache first (fast, guaranteed to work)
  memoryCache.set(key, data);

  // Persist to disk — same location as reads
  try {
    const fullPath = dataPath(relativePath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Log so we can debug on Vercel, but don't crash the request
    console.error(`Failed to write ${relativePath}:`, err);
  }
}
