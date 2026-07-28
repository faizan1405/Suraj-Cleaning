import { readJsonFile } from "@/lib/db";
import { normalizeProduct } from "@/lib/normalize";
import type { Product } from "./product-types";
export type { Product } from "./product-types";

/**
 * Read products directly from the data layer. Server-side only.
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

export async function getProductBySlug(slug: string, preloadedProducts?: Product[]): Promise<Product | undefined> {
  const products = preloadedProducts ?? await getProducts();
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