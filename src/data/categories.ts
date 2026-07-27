export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/admin/data/categories", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch {
    console.error("Error fetching categories, returning empty array");
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}
