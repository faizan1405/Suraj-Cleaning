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
};

const SINGLETON_COLLECTIONS = new Set(["company.json"]);

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

      // Upsert each item by its `id` field so existing rows are replaced in place
      // and concurrent submissions never delete data mid-write. MongoDB will
      // generate `_id` automatically since items don't carry one.
      const operations = items.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: item,
          upsert: true,
        },
      }));
      await collection.bulkWrite(operations, { ordered: false });
      return;
    } catch (error) {
      if (attempt < 2) {
        await resetDb();
        continue;
      }
      throw error;
    }
  }
}

export { resetDb, readJsonFile, writeJsonFile };
