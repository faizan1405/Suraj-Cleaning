import "dotenv/config";
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI!;
  const dbName = "suraj-cleaning";

  console.log("Connecting...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const products = await db.collection("products").find({}).toArray();
  console.log("Total products:", products.length);
  for (const p of products) {
    console.log(
      p.id,
      "|",
      p.name,
      "| cat:",
      p.category || "(none)",
      "| badge:",
      p.badge || "(none)"
    );
  }

  const cats = await db.collection("categories").find({}).toArray();
  console.log("Categories:", cats.length);
  for (const c of cats) {
    console.log(c.id, "|", c.name, "|", c.slug);
  }

  const toDelete = products.filter(
    (p) =>
      (p.badge && /combo/i.test(p.badge)) ||
      /combo/i.test(p.category || "")
  );
  console.log("Combo/demo products to delete:", toDelete.length);
  for (const p of toDelete) {
    console.log("  Deleting:", p.id, "|", p.name);
  }

  if (toDelete.length > 0) {
    const ids = toDelete.map((p) => p.id);
    const result = await db
      .collection("products")
      .deleteMany({ id: { $in: ids } });
    console.log("Deleted count:", result.deletedCount);
  }

  const hasComboCat = cats.some((c) => /combo/i.test(c.name));
  if (!hasComboCat) {
    await db.collection("categories").insertOne({
      id: "cat_" + Date.now(),
      name: "Combo Pack",
      slug: "combo-pack",
      description: "Special combo deals and bundle offers for maximum savings.",
      image: "",
      createdAt: new Date().toISOString(),
    });
    console.log("Created 'Combo Pack' category");
  } else {
    console.log("'Combo Pack' category already exists");
  }

  await client.close();
  console.log("Done");
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
