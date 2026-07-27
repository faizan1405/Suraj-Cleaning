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
    { label: "Categories", value: stats.categories, href: "/admin/categories", icon: FolderTree, color: "violet" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials", icon: MessageSquare, color: "emerald" },
    { label: "Quality Steps", value: stats.steps, href: "/admin/quality-process", icon: Settings, color: "amber" },
    { label: "Contact Inquiries", value: stats.contact, href: "/admin/submissions", icon: Inbox, color: "rose" },
    { label: "Distributor Apps", value: stats.distributor, href: "/admin/submissions", icon: Users, color: "indigo" },
    { label: "Newsletter Subs", value: stats.newsletter, href: "/admin/submissions", icon: Users, color: "teal" },
  ];

  const colorConfig: Record<string, { iconBg: string; iconText: string; dot: string }> = {
    blue:    { iconBg: "bg-blue-50", iconText: "text-blue-600", dot: "bg-blue-500" },
    violet:  { iconBg: "bg-violet-50", iconText: "text-violet-600", dot: "bg-violet-500" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", dot: "bg-emerald-500" },
    amber:   { iconBg: "bg-amber-50", iconText: "text-amber-600", dot: "bg-amber-500" },
    rose:    { iconBg: "bg-rose-50", iconText: "text-rose-600", dot: "bg-rose-500" },
    indigo:  { iconBg: "bg-indigo-50", iconText: "text-indigo-600", dot: "bg-indigo-500" },
    teal:    { iconBg: "bg-teal-50", iconText: "text-teal-600", dot: "bg-teal-500" },
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-[14px] text-slate-500 mt-1">Overview of your website content and activity.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse">
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
          {statCards.map((card) => {
            const Icon = card.icon;
            const colors = colorConfig[card.color];
            return (
              <a
                key={card.label}
                href={card.href}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${colors.iconText}`} />
                  </div>
                  <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
                </div>
                <p className="text-[30px] font-bold text-slate-900 tracking-tight leading-none">{card.value}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
