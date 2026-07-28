import HeroSection from "@/components/HeroSection";
import ProductCategories from "@/components/ProductCategories";
import AboutSection from "@/components/AboutSection";
import BestSellingProducts from "@/components/BestSellingProducts";
import DistributorSection from "@/components/DistributorSection";
import TrustBenefits from "@/components/TrustBenefits";
import Testimonials from "@/components/Testimonials";
import QualityProcessSection from "@/components/QualityProcessSection";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProductCategories />
      <AboutSection />
      <BestSellingProducts />
      <DistributorSection />
      <TrustBenefits />
      <Testimonials />
      <QualityProcessSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
