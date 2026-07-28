import { readJsonFile } from "@/lib/db";
import { normalizeProduct } from "@/lib/normalize";

export interface Product extends Record<string, unknown> {
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

/**
 * Read products directly from the data layer. Going through `fetch('/api/...')`
 * doesn't work on the server in Next.js 16 — relative URLs throw ERR_INVALID_URL
 * under Turbopack, leaving the products page empty even though the admin panel
 * has them. Reading the JSON store directly is also faster (no HTTP hop).
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const raw = await readJsonFile<Record<string, unknown>[]>("products.json");
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeProduct);
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.bestSeller);
}
