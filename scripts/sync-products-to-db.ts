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

  // Use a transaction to atomically replace all products
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await db.collection("products").deleteMany({}, { session });
      await db.collection("products").insertMany(products, { ordered: false, session });
    });
    console.log("Done! Products synced to MongoDB.");
  } catch (err) {
    console.error("Transaction failed, falling back to non-transactional:", err.message);
    await db.collection("products").deleteMany({});
    await db.collection("products").insertMany(products, { ordered: false });
    console.log("Done! Products synced to MongoDB (fallback mode).");
  }

  // Verify
  const count = await db.collection("products").countDocuments({});
  console.log(`MongoDB now has ${count} products.`);

  await client.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
