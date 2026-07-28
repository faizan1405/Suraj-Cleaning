import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "suraj-cleaning";

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const coll = db.collection("products");

  // Check existing
  const existing = await coll.find({}).toArray();
  console.log(`Existing products: ${existing.length}`);
  existing.forEach((p) => console.log(`  - ${p.name} (${p.category}) bestSeller=${p.bestSeller} badge=${p.badge}`));

  const comboProducts = [
    {
      id: "combo-001",
      slug: "home-cleaning-combo",
      name: "Home Cleaning Combo",
      category: "Floor Care",
      shortDescription: "Complete home cleaning solution with floor, bathroom & kitchen essentials in one pack.",
      description: "Our best-selling Home Cleaning Combo brings together the essential products you need to keep your entire home sparkling clean. Includes a floor cleaner, bathroom cleaner, and a kitchen degreaser — everything at an unbeatable combo price.",
      price: 699,
      sizes: ["Combo Pack"],
      image: "/images/hero-products.jpg",
      gallery: ["/images/product-supreme.svg"],
      benefits: [
        "Complete cleaning solution for entire home",
        "Save 20% compared to buying individually",
        "Premium quality products trusted by 500+ families",
        "Suitable for all floor and surface types",
      ],
      directions: [
        "Use Floor Cleaner: dilute 1 cap in 1L water, mop the floor",
        "Use Bathroom Cleaner: spray on surfaces, leave for 5 min, wipe",
        "Use Kitchen Degreaser: spray on greasy areas, scrub and rinse",
      ],
      featured: false,
      bestSeller: false,
      active: true,
      stock: 50,
      badge: "Combo Offer",
      variants: [],
    },
    {
      id: "combo-002",
      slug: "bathroom-essentials-combo",
      name: "Bathroom Essentials Combo",
      category: "Bathroom Care",
      shortDescription: "Everything you need for a spotless, hygienic bathroom — toilet cleaner, shower gel & more.",
      description: "Keep your bathroom fresh and germ-free with our Bathroom Essentials Combo. This curated pack includes a powerful toilet cleaner, a refreshing shower gel, and a surface disinfectant. Perfect for maintaining bathroom hygiene without the hassle of buying products separately.",
      price: 499,
      sizes: ["Combo Pack"],
      image: "/images/product-handpure.svg",
      gallery: ["/images/category-bathroom-care.svg"],
      benefits: [
        "Kills 99.9% germs and bacteria",
        "Leaves a pleasant, long-lasting fragrance",
        "Gentle on surfaces, tough on stains",
        "Complete bathroom hygiene in one pack",
      ],
      directions: [
        "Apply Toilet Cleaner under the rim, leave 10 min, scrub & flush",
        "Use Shower Gel for daily bathing — lather & rinse",
        "Spray Surface Disinfectant on tiles, leave 3 min, wipe dry",
      ],
      featured: false,
      bestSeller: false,
      active: true,
      stock: 40,
      badge: "Combo Offer",
      variants: [],
    },
    {
      id: "combo-003",
      slug: "kitchen-combo-pack",
      name: "Kitchen Combo Pack",
      category: "Kitchen Care",
      shortDescription: "Tough on grease, gentle on your hands — dishwash liquid + degreaser combo.",
      description: "The Kitchen Combo Pack is designed for the heart of your home. Pair our ultra-grease-cutting Dishwash Liquid with the powerful Kitchen Degreaser for spotless dishes and sparkling surfaces. Save more while keeping your kitchen the cleanest place in your house.",
      price: 399,
      sizes: ["Combo Pack"],
      image: "/images/product-dish-sheen.svg",
      gallery: ["/images/category-kitchen-care.svg"],
      benefits: [
        "Cuts through tough grease instantly",
        "Gentle on hands — no harsh chemicals",
        "Pleasant lemon fragrance",
        "20% savings vs individual purchase",
      ],
      directions: [
        "Dishwash Liquid: add 2 drops on sponge, scrub dishes, rinse",
        "Degreaser: spray on stovetop & surfaces, leave 5 min, wipe clean",
      ],
      featured: false,
      bestSeller: false,
      active: true,
      stock: 60,
      badge: "Combo Pack",
      variants: [],
    },
    {
      id: "combo-004",
      slug: "laundry-care-combo",
      name: "Laundry Care Combo",
      category: "Laundry Care",
      shortDescription: "Brighten & freshen every wash — detergent + fabric softener combo for all fabric types.",
      description: "Make every laundry day a breeze with our Laundry Care Combo. Combining our powerful Fabric Detergent with a premium Fabric Softener, this pack gives you brilliantly clean and beautifully soft clothes every time. Perfect for all washing machines and hand wash.",
      price: 549,
      sizes: ["Combo Pack"],
      image: "/images/product-fabrix.svg",
      gallery: ["/images/category-laundry-care.svg"],
      benefits: [
        "Deep cleaning for all fabric types",
        "Leaves clothes soft and fresh",
        "Color-safe formula protects fabric vibrancy",
        "Works in both machines and hand wash",
      ],
      directions: [
        "Detergent: add 1 cap (front load) or 2 caps (top load) to drum",
        "Fabric Softener: add ½ cap in the softener tray during rinse cycle",
      ],
      featured: false,
      bestSeller: false,
      active: true,
      stock: 45,
      badge: "Combo Pack",
      variants: [],
    },
  ];

  for (const product of comboProducts) {
    // Check if already exists
    const existing = await coll.findOne({ id: product.id });
    if (existing) {
      console.log(`SKIP: ${product.name} already exists`);
      continue;
    }
    const result = await coll.insertOne(product);
    console.log(`INSERTED: ${product.name} (id: ${result.insertedId})`);
  }

  await client.close();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
