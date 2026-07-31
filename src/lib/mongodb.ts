import { MongoClient, type Db } from "mongodb";
import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "suraj-cleaning";

let client: MongoClient | null = null;
let db: Db | null = null;
let connectingPromise: Promise<Db> | null = null;

/** Create a minimal no-op Db that returns empty results for all operations.
 *  This avoids error spam when MONGODB_URI is not set (e.g., preview deploys
 *  that only serve static pages). */
function createNoopDb(): Db {
  const noop = () => Promise.resolve();
  const collection = (_name: string) => ({
    findOne: async () => null,
    find: () => ({ toArray: async () => [] }),
    updateOne: async () => ({ matchedCount: 0, modifiedCount: 0 }),
    deleteMany: async () => ({ deletedCount: 0 }),
    insertMany: async () => [],
    createIndex: async () => {},
  });
  return {
    collection,
    listCollections: async () => [],
    command: async () => ({}),
    dropDatabase: async () => {},
    stats: async () => ({}),
  } as unknown as Db;
}

async function connect(): Promise<Db> {
  if (!MONGODB_URI) {
    if (!(globalThis as any).__mongoUriMissingLogged) {
      (globalThis as any).__mongoUriMissingLogged = true;
      logger.warn("MONGODB_URI not set — using JSON file fallback for all data reads");
    }
    return createNoopDb();
  }

  if (client) {
    try {
      await client.close();
    } catch {
      // ignore
    }
    client = null;
    db = null;
  }

  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });

    await client.connect();
    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    if (!(globalThis as any).__mongoConnFailLogged) {
      (globalThis as any).__mongoConnFailLogged = true;
      logger.error("MongoDB connection failed — using JSON fallback", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
    return createNoopDb();
  }
}

export async function getDb(): Promise<Db> {
  if (db) return db;
  // Prevent concurrent connections from racing on the same module instance
  if (connectingPromise) return connectingPromise;
  connectingPromise = connect().finally(() => {
    connectingPromise = null;
  });
  return connectingPromise;
}

export async function resetDb(): Promise<void> {
  if (client) {
    try {
      await client.close();
    } catch {
      // ignore
    }
    client = null;
    db = null;
  }
}

/** Access the raw client for sessions (may be null if not yet connected) */
export function _getClientSync(): MongoClient | null {
  return client;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}