/**
 * Seed script — migrate existing JSON data into MongoDB.
 * Usage: npx tsx scripts/seed-mongodb.ts
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { getDb, closeDb } from "../src/lib/mongodb";
import { writeJsonFile } from "../src/lib/db";

const DATA_DIR = join(process.cwd(), "src", "data");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set");
    process.exit(1);
  }
  console.log("Connecting to MongoDB...");
  await getDb();
  console.log("Connected!\n");

  const files = [
    { file: "products.json", dbPath: "products.json" },
    { file: "categories.json", dbPath: "categories.json" },
    { file: "company.json", dbPath: "company.json" },
    { file: "testimonials.json", dbPath: "testimonials.json" },
    { file: "qualityProcess.json", dbPath: "qualityProcess.json" },
    { file: "submissions/contact.json", dbPath: "submissions/contact.json" },
    { file: "submissions/distributor.json", dbPath: "submissions/distributor.json" },
    { file: "submissions/newsletter.json", dbPath: "submissions/newsletter.json" },
  ];

  for (const { file, dbPath } of files) {
    try {
      const content = readFileSync(join(DATA_DIR, file), "utf-8");
      const data = JSON.parse(content);
      await writeJsonFile(dbPath, data);
      const count = Array.isArray(data) ? data.length : 1;
      console.log(`  Seeded ${file} -> ${count} document(s)`);
    } catch (err) {
      console.error(`  Skipped ${file}: ${err}`);
    }
  }

  console.log("\nSeeding complete!");
  await closeDb();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});