export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch("/api/admin/data/testimonials", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    return res.json();
  } catch {
    console.error("Error fetching testimonials, returning empty array");
    return [];
  }
}
