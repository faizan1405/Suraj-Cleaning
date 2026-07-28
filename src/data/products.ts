import { normalizeProduct } from "@/lib/normalize";
import fallbackData from "@/data/products.json";

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

// Fallback products loaded from the local JSON file when the MongoDB-backed
// API is unavailable or returns no data.
const FALLBACK_PRODUCTS: Product[] = (fallbackData as Record<string, unknown>[]).map((p) =>
  normalizeProduct(p)
);

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/admin/data/products", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Products API returned empty, falling back to local data");
      return FALLBACK_PRODUCTS;
    }
    return (data as Record<string, unknown>[]).map(normalizeProduct);
  } catch {
    console.error("Error fetching products, falling back to local data");
    return FALLBACK_PRODUCTS;
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
