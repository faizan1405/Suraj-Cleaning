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
  stock: number;
  badge?: string;
  variants?: Variant[];
}

export interface Variant {
  name: string;
  price: number;
  stock: number;
  sku?: string;
  image?: string;
  status?: "in_stock" | "out_of_stock";
}
