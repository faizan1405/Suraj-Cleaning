// Script to set all product stock to 20
// Run with: node scripts/set-stock.mjs
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const DB_NAME = "suraj-cleaning";

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection("products");

  // Get all products
  const products = await collection.find({}).toArray();
  console.log(`Found ${products.length} products`);

  // Update each product's stock to 20
  const results = await Promise.all(
    products.map((p) =>
      collection.updateOne(
        { id: p.id },
        { $set: { stock: 20 } }
      )
    )
  );

  const matched = results.filter((r) => r.matchedCount > 0).length;
  console.log(`Updated stock to 20 for ${matched} products`);

  await client.close();
}

main().catch(console.error);
