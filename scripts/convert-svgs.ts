import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dir = "public/images";
const svgFiles = [
  "about-building.svg",
  "category-floor-care.svg",
  "category-bathroom-care.svg",
  "category-kitchen-care.svg",
  "category-laundry-care.svg",
  "category-personal-care.svg",
  "product-hygix.svg",
];

for (const file of svgFiles) {
  const svgPath = join(dir, file);
  const svgContent = readFileSync(svgPath, "utf-8");
  const webpName = file.replace(".svg", ".webp");

  sharp(Buffer.from(svgContent))
    .resize(800)
    .webp({ quality: 90 })
    .toFile(join(dir, webpName))
    .then(() => console.log(`Converted ${file} → ${webpName}`))
    .catch((err) => console.error(`Error converting ${file}:`, err));
}
