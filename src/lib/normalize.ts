import type { Product, Variant } from "../data/products";

/**
 * Normalizes a raw product document from MongoDB/admin panel so that
 * the frontend rendering code never sees a missing or wrong-typed field.
 */
export function normalizeProduct(raw: Record<string, unknown>): Product {
  const toStrArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.map((v) => String(v));
    if (typeof val === "string" && val.trim()) return [val.trim()];
    return [];
  };

  const sizes = toStrArray(raw.sizes);

  let variants: Variant[] | undefined;
  if (Array.isArray(raw.variants)) {
    variants = raw.variants
      .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
      .map((v) => ({
        name: String(v.name ?? ""),
        price: typeof v.price === "number" ? v.price : Number(v.price) || 0,
        stock: typeof v.stock === "number" ? v.stock : Number(v.stock) || 0,
        sku: typeof v.sku === "string" && v.sku.trim() ? v.sku.trim() : undefined,
        image: typeof v.image === "string" && v.image.trim() ? v.image.trim() : undefined,
        status: ((typeof v.stock === "number" ? v.stock : Number(v.stock) || 0) > 0 ? "in_stock" : "out_of_stock") as Variant["status"],
      }))
      .filter((v) => v.name.length > 0);
    if (variants.length === 0) variants = undefined;
  }

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
    benefits: toStrArray(raw.benefits).length > 0 ? toStrArray(raw.benefits) : ["Quality product"],
    directions: toStrArray(raw.directions).length > 0 ? toStrArray(raw.directions) : ["Use as directed."],
    featured: Boolean(raw.featured),
    bestSeller: Boolean(raw.bestSeller),
    active: Boolean(raw.active),
    stock: typeof raw.stock === "number" ? raw.stock : Number(raw.stock) || 0,
    badge: typeof raw.badge === "string" ? raw.badge : undefined,
    variants,
  } as Product;
}
