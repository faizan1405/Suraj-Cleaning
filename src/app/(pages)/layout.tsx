import Footer from "@/components/Footer";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <Footer />
    </div>
  );
}
