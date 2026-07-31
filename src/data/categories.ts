import { readJsonFile } from "@/lib/db";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

/**
 * Read categories directly from the data layer (MongoDB with JSON fallback).
 * Replaces the broken internal fetch() call that failed during static generation.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await readJsonFile<Category[]>("categories.json");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching categories:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}
