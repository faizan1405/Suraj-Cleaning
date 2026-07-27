import { getCompany } from "@/data/company";
import { getProducts } from "@/data/products";
import AboutView from "@/components/AboutSection";

export const metadata = {
  title: "About Us | Swaraj Enterprises",
  description:
    "Learn about Swaraj Enterprises - your trusted partner for premium cleaning solutions. Committed to quality, innovation, and customer satisfaction since our inception.",
};

export default async function AboutPage() {
  const company = await getCompany();
  const products = await getProducts();

  return (
    <AboutView
      company={company}
      productCount={products.filter((p) => p.active).length}
    />
  );
}
