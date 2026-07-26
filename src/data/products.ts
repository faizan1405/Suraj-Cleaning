export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  image: string;
  gallery?: string[];
  benefits: string[];
  directions: string[];
  featured: boolean;
  bestSeller: boolean;
  active: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "hygi-x",
    name: "HYGI-X",
    category: "Toilet Cleaner",
    shortDescription: "Powerful toilet cleaner with 99.9% germ protection",
    description:
      "HYGI-X is an advanced toilet cleaner designed to eliminate tough stains, kill germs, and leave your toilet sparkling clean and fragrant.",
    price: 99,
    sizes: ["500ml"],
    image: "/images/product-hygix.webp",
    benefits: [
      "Kills 99.9% of germs",
      "Removes tough stains",
      "Long-lasting fragrance",
      "Safe for ceramic surfaces",
    ],
    directions: [
      "Apply under the rim",
      "Let it sit for 10 minutes",
      "Scrub with a toilet brush",
      "Flush clean",
    ],
    featured: true,
    bestSeller: true,
    active: true,
  },
  {
    id: "2",
    slug: "handpure",
    name: "HANDPURE",
    category: "Handwash",
    shortDescription: "Gentle handwash that kills germs effectively",
    description:
      "HANDPURE combines powerful germ protection with skin-friendly ingredients, keeping your hands clean and soft.",
    price: 79,
    sizes: ["250ml", "500ml"],
    image: "/images/product-handpure.webp",
    benefits: [
      "Kills 99.9% germs",
      "Gentle on skin",
      "Pleasant fragrance",
      "Dermatologically tested",
    ],
    directions: [
      "Wet hands with water",
      "Apply a small amount",
      "Lather thoroughly",
      "Rinse with clean water",
    ],
    featured: true,
    bestSeller: true,
    active: true,
  },
  {
    id: "3",
    slug: "dish-sheen",
    name: "DISH SHEEN",
    category: "Dishwash Liquid",
    shortDescription: "Tough on grease, gentle on hands",
    description:
      "DISH SHEEN effortlessly removes grease and food residue from dishes, leaving them spotless and smelling fresh.",
    price: 89,
    sizes: ["500ml", "1L"],
    image: "/images/product-dish-sheen.webp",
    benefits: [
      "Removes tough grease",
      "Long-lasting foam",
      "Gentle on hands",
      "Citrus fragrance",
    ],
    directions: [
      "Dilute in water",
      "Soak dishes briefly",
      "Scrub with sponge",
      "Rinse thoroughly",
    ],
    featured: true,
    bestSeller: true,
    active: true,
  },
  {
    id: "4",
    slug: "clearon",
    name: "CLEARON",
    category: "Glass Cleaner",
    shortDescription: "Streak-free shine for all glass surfaces",
    description:
      "CLEARON delivers a crystal-clear, streak-free finish on windows, mirrors, and all glass surfaces.",
    price: 89,
    sizes: ["500ml"],
    image: "/images/product-clearon.webp",
    benefits: [
      "Streak-free finish",
      "Quick drying formula",
      "Safe on all glass",
      "No residue left behind",
    ],
    directions: [
      "Spray on surface",
      "Wipe with clean cloth",
      "Buff for extra shine",
    ],
    featured: true,
    bestSeller: false,
    active: true,
  },
  {
    id: "5",
    slug: "supreme",
    name: "SUPREME",
    category: "Detergent Powder",
    shortDescription: "Powerful detergent for bright, fresh laundry",
    description:
      "SUPREME detergent powder delivers deep cleaning action, removing tough stains while keeping fabrics bright and fresh.",
    price: 109,
    sizes: ["1kg", "2kg"],
    image: "/images/product-supreme.webp",
    benefits: [
      "Deep stain removal",
      "Fabric brightening",
      "Long-lasting fragrance",
      "Works in all machines",
    ],
    directions: [
      "Add powder to drum",
      "Add clothes",
      "Start wash cycle",
      "Rinse thoroughly",
    ],
    featured: false,
    bestSeller: true,
    active: true,
  },
  {
    id: "6",
    slug: "fabrix",
    name: "FABRIX",
    category: "Fabric Detergent",
    shortDescription: "Premium liquid detergent for all fabrics",
    description:
      "FABRIX liquid detergent is specially formulated for all fabric types, providing a thorough clean while preserving fabric softness and color.",
    price: 149,
    sizes: ["1L", "2L"],
    image: "/images/product-fabrix.webp",
    benefits: [
      "Safe for all fabrics",
      "Color protection",
      "Fabric softness",
      "Fresh fragrance",
    ],
    directions: [
      "Pour into dispenser",
      "Add clothes to machine",
      "Select wash cycle",
      "Enjoy clean laundry",
    ],
    featured: false,
    bestSeller: true,
    active: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}
