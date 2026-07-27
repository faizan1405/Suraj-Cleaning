import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "suraj-cleaning";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
  });

  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

export async function getDb(): Promise<Db> {
  if (db) return db;
  return connect();
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
