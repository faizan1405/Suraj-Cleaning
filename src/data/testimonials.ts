import { readJsonFile } from "@/lib/db";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
}

/**
 * Read testimonials directly from the data layer (MongoDB with JSON fallback).
 * Replaces the broken internal fetch() call.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await readJsonFile<Testimonial[]>("testimonials.json");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching testimonials:", err instanceof Error ? err.message : err);
    return [];
  }
}
