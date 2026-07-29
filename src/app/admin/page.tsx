"use client";

import { useState, useEffect } from "react";
import { Package, FolderTree, MessageSquare, Settings, Inbox, Users } from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin/AdminUI";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0, categories: 0, testimonials: 0, steps: 0, contact: 0, distributor: 0, newsletter: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, categoriesRes, testimonialsRes, stepsRes, subsRes] = await Promise.all([
          fetch("/api/admin/data/products"),
          fetch("/api/admin/data/categories"),
          fetch("/api/admin/data/testimonials"),
          fetch("/api/admin/data/qualityProcess"),
          fetch("/api/admin/submissions"),
        ]);

        const products = productsRes.ok ? await productsRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];
        const steps = stepsRes.ok ? await stepsRes.json() : [];
        const submissions = subsRes.ok ? await subsRes.json() : [];

        const contact = submissions.filter((s: any) => s.type === "contact").length;
        const distributor = submissions.filter((s: any) => s.type === "distributor").length;
        const newsletter = submissions.filter((s: any) => s.type === "newsletter").length;

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          steps: Array.isArray(steps) ? steps.length : 0,
          contact,
          distributor,
          newsletter,
        });
      } catch {
        // keep zeros
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: "Products", value: stats.products, href: "/admin/products", icon: Package, color: "blue" as const },
    { label: "Categories", value: stats.categories, href: "/admin/categories", icon: FolderTree, color: "violet" as const },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials", icon: MessageSquare, color: "emerald" as const },
    { label: "Quality Steps", value: stats.steps, href: "/admin/quality-process", icon: Settings, color: "amber" as const },
    { label: "Contact Inquiries", value: stats.contact, href: "/admin/submissions", icon: Inbox, color: "rose" as const },
    { label: "Distributor Apps", value: stats.distributor, href: "/admin/submissions", icon: Users, color: "indigo" as const },
    { label: "Newsletter Subs", value: stats.newsletter, href: "/admin/submissions", icon: Users, color: "teal" as const },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your website content and activity."
      />

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="ad-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              href={card.href}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
