import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found in environment");
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db("suraj-cleaning");

  // Read the restored products.json
  const products = JSON.parse(readFileSync("src/data/products.json", "utf-8"));
  console.log(`Syncing ${products.length} products to MongoDB...`);

  // Upsert each product by id — preserves anything in the DB we don't know about
  let upserted = 0;
  let inserted = 0;
  let updated = 0;
  for (const product of products) {
    const { _id, ...rest } = product;
    const result = await db.collection("products").updateOne(
      { id: product.id },
      { $set: rest },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted++;
    else if (result.modifiedCount > 0) updated++;
    upserted++;
  }
  console.log(`Synced ${upserted} products (${inserted} inserted, ${updated} updated).`);

  // Verify
  const count = await db.collection("products").countDocuments({});
  console.log(`MongoDB now has ${count} products.`);

  await client.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
