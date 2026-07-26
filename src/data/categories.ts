export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "1",
    slug: "floor-care",
    name: "Floor Care",
    description: "Clean, Shine & Protect your floors",
    image: "/images/category-floor-care.webp",
  },
  {
    id: "2",
    slug: "bathroom-care",
    name: "Bathroom Care",
    description: "Powerful cleaning for hygienic bathrooms",
    image: "/images/category-bathroom-care.webp",
  },
  {
    id: "3",
    slug: "kitchen-care",
    name: "Kitchen Care",
    description: "Tough on grease, gentle on hands",
    image: "/images/category-kitchen-care.webp",
  },
  {
    id: "4",
    slug: "laundry-care",
    name: "Laundry Care",
    description: "Deep clean & freshness always",
    image: "/images/category-laundry-care.webp",
  },
  {
    id: "5",
    slug: "personal-care",
    name: "Personal Care",
    description: "Gentle & safe care for your family",
    image: "/images/category-personal-care.webp",
  },
];
