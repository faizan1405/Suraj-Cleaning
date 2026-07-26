export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Excellent quality products with amazing fragrance. My home has never been this clean!",
    name: "Priya Sharma",
    role: "Home Maker",
    initials: "PS",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "We are using Swaraj products in our hotel. Very satisfied with the quality and results.",
    name: "Ramesh Shetty",
    role: "Hotel Owner",
    initials: "RS",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Best products in this price range. Highly recommended!",
    name: "Anitha K.",
    role: "Shop Owner",
    initials: "AK",
    rating: 5,
  },
];
