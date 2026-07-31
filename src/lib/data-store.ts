/**
 * This module previously attempted to persist mutable business data to the
 * local filesystem at `src/data/` and `os.tmpdir()`. That approach is
 * unsound for serverless deployments such as Vercel, where the runtime
 * filesystem is read-only and ephemeral.
 *
 * Mutable data — products, categories, orders, settings, submissions —
 * now lives in MongoDB via `@/lib/db` and `@/lib/mongodb`. The functions
 * in this file now throw explicit errors so any stray caller surfaces the
 * defect loudly instead of silently dropping writes.
 */

export function readJsonFile<T>(_relativePath: string): T {
  throw new Error(
    "data-store.ts: filesystem reads are disabled. Use `@/lib/db` to read from MongoDB."
  );
}

export function writeJsonFile<T>(_relativePath: string, _data: T): void {
  throw new Error(
    "data-store.ts: filesystem writes are disabled. Use `@/lib/db` to write to MongoDB."
  );
}