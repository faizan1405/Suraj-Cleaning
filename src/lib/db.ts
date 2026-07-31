import { getDb, resetDb } from "@/lib/mongodb";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const DB_NAME = "suraj-cleaning";
const DATA_DIR = join(process.cwd(), "src", "data");

const COLLECTION_MAP: Record<string, string> = {
  "products.json": "products",
  "categories.json": "categories",
  "company.json": "company",
  "testimonials.json": "testimonials",
  "qualityProcess.json": "qualityProcess",
  "submissions/contact.json": "contact",
  "submissions/distributor.json": "distributor",
  "submissions/newsletter.json": "newsletter",
  "orders.json": "orders",
  "users.json": "users",
};

const SINGLETON_COLLECTIONS = new Set(["company.json"]);

const INDEX_MAP: Record<string, Record<string, 1 | -1>> = {
  products: { category: 1, slug: 1, active: 1, bestSeller: 1, stock: 1 },
  orders: { "customer.email": 1, status: 1, paymentStatus: 1, paymentMethod: 1, razorpayOrderId: 1, createdAt: -1 },
  users: { id: 1 },
  contact: { submittedAt: -1 },
  distributor: { submittedAt: -1 },
  newsletter: { submittedAt: -1 },
};

function getCollectionName(relativePath: string): string {
  const name = COLLECTION_MAP[relativePath];
  if (!name) throw new Error(`Unknown data file: ${relativePath}`);
  return name;
}

/**
 * Load data from a JSON file in src/data as a fallback when MongoDB
 * is unavailable or the collection is empty. This ensures the site
 * always has data even if the database has not been seeded yet.
 */
function loadJsonFallback<T>(relativePath: string): T {
  const filePath = join(DATA_DIR, relativePath);
  if (!existsSync(filePath)) {
    return (SINGLETON_COLLECTIONS.has(relativePath) ? { _id: "singleton", data: {} } : []) as T;
  }
  const content = readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(content) as T;
  return parsed;
}

async function readJsonFile<T>(relativePath: string): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const db = await getDb();
      const collection = db.collection(getCollectionName(relativePath));

      if (SINGLETON_COLLECTIONS.has(relativePath)) {
        const doc = await collection.findOne<{ data: T }>({ _id: "singleton" } as Record<string, string>);
        if (doc?.data) return doc.data;
        // Fall back to JSON file
        const fallback = loadJsonFallback<T>(relativePath);
        if (fallback && (fallback as any)._id !== "singleton") {
          return fallback;
        }
        return (fallback as any).data ?? ({} as T);
      }

      const docs = await collection.find({}).toArray();
      if (docs.length > 0) {
        const items = docs.map(({ _id, ...rest }) => rest as Record<string, unknown>);
        return items as unknown as T;
      }

      // Collection empty — fall back to JSON file
      const fallback = loadJsonFallback<T>(relativePath);
      if (Array.isArray(fallback) && fallback.length > 0) {
        return fallback;
      }
      return fallback as T;
    } catch (error) {
      if (attempt < 1) {
        await resetDb();
        continue;
      }
      // Final attempt: try JSON fallback
      try {
        return loadJsonFallback<T>(relativePath);
      } catch {
        throw error;
      }
    }
  }
  // Should not reach here
  return loadJsonFallback<T>(relativePath);
}

async function writeJsonFile<T>(relativePath: string, data: T): Promise<void> {
  const client = (await import("@/lib/mongodb"))._getClientSync();

  if (client) {
    try {
      const session = client.startSession();
      await session.withTransaction(async () => {
        const db = await getDb();
        const collection = db.collection(getCollectionName(relativePath));

        if (SINGLETON_COLLECTIONS.has(relativePath)) {
          await collection.updateOne(
            { _id: "singleton" } as Record<string, string>,
            { $set: { data } },
            { upsert: true, session }
          );
          return;
        }

        const items = data as Record<string, unknown>[];
        if (items.length === 0) {
          await collection.deleteMany({}, { session });
          return;
        }

        // Atomic: delete all then insert all
        await collection.deleteMany({}, { session });
        await collection.insertMany(items, { ordered: false, session });
      });
      return;
    } catch (txError) {
      console.error("writeJsonFile transaction failed, falling back:", txError);
    }
  }

  // Non-transactional fallback
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const db = await getDb();
      const collection = db.collection(getCollectionName(relativePath));

      if (SINGLETON_COLLECTIONS.has(relativePath)) {
        await collection.updateOne(
          { _id: "singleton" } as Record<string, string>,
          { $set: { data } },
          { upsert: true }
        );
        return;
      }

      const items = data as Record<string, unknown>[];
      if (items.length === 0) {
        await collection.deleteMany({});
        return;
      }

      await collection.deleteMany({});
      await collection.insertMany(items, { ordered: false });
      return;
    } catch (error) {
      if (attempt < 1) {
        await resetDb();
        continue;
      }
      throw error;
    }
  }
}

export { resetDb, readJsonFile, writeJsonFile };

/** Create indexes for known collections. Called once at app startup. */
export async function ensureIndexes(): Promise<void> {
  try {
    const db = await getDb();
    for (const [collName, indexes] of Object.entries(INDEX_MAP)) {
      const coll = db.collection(collName);
      for (const [field, direction] of Object.entries(indexes)) {
        try {
          await coll.createIndex({ [field]: direction } as Record<string, 1>);
        } catch {
          // Index may already exist
        }
      }
    }
  } catch (err) {
    console.error("[db] Failed to ensure indexes:", err instanceof Error ? err.message : err);
  }
}
