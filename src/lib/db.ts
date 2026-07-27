import { getDb, closeDb } from "@/lib/mongodb";

const COLLECTION_MAP: Record<string, string> = {
  "products.json": "products",
  "categories.json": "categories",
  "company.json": "company",
  "testimonials.json": "testimonials",
  "qualityProcess.json": "qualityProcess",
  "submissions/contact.json": "contact",
  "submissions/distributor.json": "distributor",
  "submissions/newsletter.json": "newsletter",
};

const SINGLETON_COLLECTIONS = new Set(["company.json"]);

function getCollectionName(relativePath: string): string {
  const name = COLLECTION_MAP[relativePath];
  if (!name) throw new Error(`Unknown data file: ${relativePath}`);
  return name;
}

/**
 * Read data from MongoDB. Returns the stored value — an object for singletons
 * (e.g. company), an array for everything else.
 */
export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const db = await getDb();
  const collection = db.collection(getCollectionName(relativePath));

  if (SINGLETON_COLLECTIONS.has(relativePath)) {
    const doc = await collection.findOne<{ data: T }>({ _id: "singleton" } as Record<string, string>);
    return doc?.data ?? ([] as unknown as T);
  }

  const docs = await collection.find({}).toArray();
  // Strip MongoDB's _id before returning
  const items = docs.map(({ _id, ...rest }) => rest as Record<string, unknown>);
  return items as unknown as T;
}

/**
 * Write data to MongoDB. Accepts an object for singletons, an array for
 * everything else — mirrors the old JSON-file behaviour.
 */
export async function writeJsonFile<T>(relativePath: string, data: T): Promise<void> {
  const db = await getDb();
  const collection = db.collection(getCollectionName(relativePath));

  if (SINGLETON_COLLECTIONS.has(relativePath)) {
    await collection.updateOne(
      { _id: "singleton" },
      { $set: { data } },
      { upsert: true }
    );
    return;
  }

  // For arrays: wipe and re-insert
  await collection.deleteMany({});
  const items = data as Record<string, unknown>[];
  if (items.length > 0) {
    await collection.insertMany(items);
  }
}

export { closeDb };
