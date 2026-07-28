import type { Product } from "../data/products";

/**
 * Normalizes a raw product document from MongoDB/admin panel so that
 * the frontend rendering code never sees a missing or wrong-typed field.
 *
 * - sizes : string | string[] → string[]
 * - benefits : string | string[] → string[]
 * - directions : string | string[] → string[]
 * - image : string | undefined → string (fallback placeholder)
 */
export function normalizeProduct(raw: Record<string, unknown>): Product {
  const toStrArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.map((v) => String(v));
    if (typeof val === "string" && val.trim()) return [val.trim()];
    return [];
  };

  const sizes = toStrArray(raw.sizes);
  const benefits = toStrArray(raw.benefits);
  const directions = toStrArray(raw.directions);

  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
    name: String(raw.name ?? "Unnamed Product"),
    slug: String(raw.slug ?? ""),
    category: String(raw.category ?? ""),
    shortDescription: String(raw.shortDescription ?? ""),
    description: String(raw.description ?? ""),
    price: typeof raw.price === "number" ? raw.price : Number(raw.price) || 0,
    sizes: sizes.length > 0 ? sizes : ["Standard"],
    image: typeof raw.image === "string" && raw.image.trim()
      ? raw.image.trim()
      : "/images/product-placeholder.png",
    gallery: Array.isArray(raw.gallery) ? raw.gallery.map(String) : [],
    benefits: benefits.length > 0 ? benefits : ["Quality product"],
    directions: directions.length > 0 ? directions : ["Use as directed."],
    featured: Boolean(raw.featured),
    bestSeller: Boolean(raw.bestSeller),
    active: Boolean(raw.active),
    stock: typeof raw.stock === "number" ? raw.stock : Number(raw.stock) || 0,
    badge: typeof raw.badge === "string" ? raw.badge : undefined,
  } as Product;
}
