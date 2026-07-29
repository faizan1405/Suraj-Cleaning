import { getDb, resetDb } from "@/lib/mongodb";

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
  products: { category: 1, slug: 1, active: 1, bestSeller: 1, "stock": 1 },
  orders: { "customer.email": 1, status: 1, paymentStatus: 1, paymentMethod: 1, razorpayOrderId: 1, createdAt: -1 },
};

function getCollectionName(relativePath: string): string {
  const name = COLLECTION_MAP[relativePath];
  if (!name) throw new Error(`Unknown data file: ${relativePath}`);
  return name;
}

async function readJsonFile<T>(relativePath: string): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const db = await getDb();
      const collection = db.collection(getCollectionName(relativePath));

      if (SINGLETON_COLLECTIONS.has(relativePath)) {
        const doc = await collection.findOne<{ data: T }>({ _id: "singleton" } as Record<string, string>);
        return doc?.data ?? ([] as unknown as T);
      }

      const docs = await collection.find({}).toArray();
      const items = docs.map(({ _id, ...rest }) => rest as Record<string, unknown>);
      return items as unknown as T;
    } catch (error) {
      if (attempt < 2) {
        await resetDb();
        continue;
      }
      throw error;
    }
  }
  throw new Error("readJsonFile: all retries exhausted");
}

async function writeJsonFile<T>(relativePath: string, data: T): Promise<void> {
  const client = (await import("@/lib/mongodb"))._getClientSync();

  // Use a MongoDB session + transaction so the clear-then-insert is atomic.
  // Without this, deleteMany followed by insertMany leaves the collection
  // empty between the two calls — a concurrent read (or partial insert
  // failure) returns no data or corrupt data, which causes stale product
  // lists and re-appearing items.
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
            { session }
          );
          return;
        }

        const items = data as Record<string, unknown>[];

        if (items.length === 0) {
          await collection.deleteMany({}, { session });
          return;
        }

        await collection.deleteMany({}, { session });
        await collection.insertMany(items, { ordered: false, session });
      });
      return;
    } catch (txError) {
      // If the transaction fails (e.g., session already ended on a non-transactable
      // engine), fall through to the non-transactional path below.
      console.error("writeJsonFile transaction failed, falling back:", txError);
    }
  }

  // Non-transactional fallback (used if no active client or session support)
  for (let attempt = 0; attempt < 3; attempt++) {
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
      if (attempt < 2) {
        await resetDb();
        continue;
      }
      throw error;
    }
  }
  throw new Error("writeJsonFile: all retries exhausted");
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
  } catch {
    // Silently skip index creation if DB is unavailable
  }
}
