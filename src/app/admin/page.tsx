"use client";

import { useState, useEffect } from "react";
import { Package, FolderTree, MessageSquare, Settings, Inbox, Users } from "lucide-react";

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
    { label: "Products", value: stats.products, href: "/admin/products", icon: Package, color: "blue" },
    { label: "Categories", value: stats.categories, href: "/admin/categories", icon: FolderTree, color: "purple" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials", icon: MessageSquare, color: "green" },
    { label: "Quality Steps", value: stats.steps, href: "/admin/quality-process", icon: Settings, color: "orange" },
    { label: "Contact Inquiries", value: stats.contact, href: "/admin/submissions", icon: Inbox, color: "red" },
    { label: "Distributor Apps", value: stats.distributor, href: "/admin/submissions", icon: Users, color: "indigo" },
    { label: "Newsletter Subs", value: stats.newsletter, href: "/admin/submissions", icon: Users, color: "teal" },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-50", text: "text-[#2563eb]", border: "border-blue-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" },
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl">
        <h2 className="text-[24px] font-bold text-[#0f172a] mb-1">Dashboard</h2>
        <p className="text-[14px] text-[#64748b] mb-6">Overview of your website content.</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
                <div className="h-8 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              const colors = colorClasses[card.color];
              return (
                <a
                  key={card.label}
                  href={card.href}
                  className={`bg-white rounded-2xl border ${colors.border} p-5 hover:shadow-md transition-all group`}
                >
                  <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <p className="text-[12px] font-medium text-[#64748b] mb-1">{card.label}</p>
                  <p className={`text-[28px] font-bold ${colors.text}`}>{card.value}</p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
