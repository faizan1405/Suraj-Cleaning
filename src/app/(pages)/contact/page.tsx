import { getCompany } from "@/data/company";
import ContactView from "@/components/ContactView";

export const metadata = {
  title: "Contact Us | Swaraj Enterprises",
  description:
    "Get in touch with Swaraj Enterprises. We're here to answer your questions about our premium cleaning products. Phone, email, and address details.",
};

export default async function ContactPage() {
  const company = await getCompany();

  return <ContactView company={company} />;
}
