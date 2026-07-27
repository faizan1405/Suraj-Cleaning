import { readFileSync, writeFileSync, renameSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "src", "data");

export function readJsonFile<T>(relativePath: string): T {
  const content = readFileSync(join(DATA_DIR, relativePath), "utf-8");
  return JSON.parse(content) as T;
}

export function writeJsonFile<T>(relativePath: string, data: T): void {
  const fullPath = join(DATA_DIR, relativePath);
  const tmpPath = fullPath + ".tmp";
  mkdirSync(join(fullPath, ".."), { recursive: true });
  writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  renameSync(tmpPath, fullPath);
}
