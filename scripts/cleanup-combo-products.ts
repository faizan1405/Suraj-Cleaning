/**
 * Cleanup script — permanently remove demo/combo products and the Combo Pack category from MongoDB.
 * Idempotent: safe to run multiple times.
 * Usage: npx tsx scripts/cleanup-combo-products.ts
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI!;
  const dbName = "suraj-cleaning";

  console.log("Connecting...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // Remove demo combo products by badge or category
  const products = await db.collection("products").find({}).toArray();
  const toDelete = products.filter(
    (p) =>
      (p.badge && /combo/i.test(p.badge)) ||
      /combo/i.test(p.category || "")
  );

  if (toDelete.length > 0) {
    const ids = toDelete.map((p) => p.id);
    const result = await db.collection("products").deleteMany({ id: { $in: ids } });
    console.log(`Deleted ${result.deletedCount} demo/combo product(s).`);
    for (const p of toDelete) {
      console.log(`  Removed: ${p.id} | ${p.name}`);
    }
  } else {
    console.log("No demo/combo products found — already clean.");
  }

  // Remove the "Combo Pack" category if it exists
  const cats = await db.collection("categories").find({}).toArray();
  const comboCat = cats.find((c) => /combo/i.test(c.name));
  if (comboCat) {
    await db.collection("categories").deleteOne({ id: comboCat.id });
    console.log(`Deleted "Combo Pack" category (${comboCat.id}).`);
  } else {
    console.log("No Combo Pack category found — already clean.");
  }

  await client.close();
  console.log("Cleanup complete.");
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
