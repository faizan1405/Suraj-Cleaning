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

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/admin/data/products", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((p: Record<string, unknown>) => normalizeProduct(p));
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
