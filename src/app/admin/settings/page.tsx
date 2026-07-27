"use client";

import { useState, useEffect } from "react";

import { Save, Loader2, MapPin, Phone, Mail, Clock, Building2, TrendingUp } from "lucide-react";
import type { CompanyInfo } from "@/data/company";

const sectionConfig = [
  { key: "general", label: "General Info", icon: Building2, fields: ["name", "tagline", "description"] },
  { key: "contact", label: "Contact Details", icon: MapPin, fields: ["address", "phone", "phoneRaw", "email", "hours"] },
  { key: "stats", label: "Statistics", icon: TrendingUp, fields: [] },
] as const;

export default function AdminSettings() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);


  useEffect(() => {
    fetch("/api/admin/data/company")
      .then((r) => r.json())
      .then((d) => { setCompany(d); setLoading(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    setMessage(null);

    const form = e.currentTarget;
    const data: Record<string, any> = { ...company };

    const customersInput = form.querySelector<HTMLInputElement>('[name="stats.customers"]');
    const distributorsInput = form.querySelector<HTMLInputElement>('[name="stats.distributors"]');
    const productsInput = form.querySelector<HTMLInputElement>('[name="stats.products"]');
    const yearsInput = form.querySelector<HTMLInputElement>('[name="stats.years"]');

    if (customersInput) data.stats = { ...data.stats, customers: parseInt(customersInput.value) || 0 };
    if (distributorsInput) data.stats = { ...data.stats, distributors: parseInt(distributorsInput.value) || 0 };
    if (productsInput) data.stats = { ...data.stats, products: parseInt(productsInput.value) || 0 };
    if (yearsInput) data.stats = { ...data.stats, years: parseInt(yearsInput.value) || 0 };

    const stringFields = ["name", "tagline", "description", "address", "phone", "phoneRaw", "email", "hours"];
    stringFields.forEach((field) => {
      const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${field}"]`);
      if (input) (data as any)[field] = input.value;
    });

    try {
      await fetch("/api/admin/data/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateField = (name: string, value: string) => {
    if (!company) return;
    setCompany({ ...company, [name]: value });
  };

  if (loading || !company) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-7 bg-slate-200 rounded-lg w-40 animate-pulse mb-2" />
          <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Settings</h2>
        <p className="text-[14px] text-slate-500 mt-1">Manage company information and configuration.</p>
      </div>

      {message && (
        <div className={`mb-6 text-[14px] px-4 py-3 rounded-xl border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <h3 className="text-[14px] font-bold text-slate-800">General Info</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Company Name *</label>
              <input type="text" name="name" required value={company.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white hover:border-slate-300" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Tagline</label>
              <input type="text" name="tagline" value={company.tagline} onChange={(e) => updateField("tagline", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white hover:border-slate-300" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Description</label>
              <textarea name="description" rows={3} value={company.description} onChange={(e) => updateField("description", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none bg-white hover:border-slate-300" />
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-slate-400" />
            <h3 className="text-[14px] font-bold text-slate-800">Contact Details</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Address</label>
              <textarea name="address" rows={2} value={company.address} onChange={(e) => updateField("address", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none bg-white hover:border-slate-300" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">Phone</label>
                <input type="text" name="phone" value={company.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white hover:border-slate-300" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">Email</label>
                <input type="email" name="email" value={company.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white hover:border-slate-300" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Working Hours</label>
              <input type="text" name="hours" value={company.hours} onChange={(e) => updateField("hours", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white hover:border-slate-300" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <h3 className="text-[14px] font-bold text-slate-800">Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { key: "customers", label: "Customers" },
                { key: "distributors", label: "Distributors" },
                { key: "products", label: "Products" },
                { key: "years", label: "Years" },
              ].map((stat) => (
                <div key={stat.key}>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">{stat.label}</label>
                  <input type="number" name={`stats.${stat.key}`} value={(company.stats as any)[stat.key]} onChange={(e) => {
                    setCompany({ ...company, stats: { ...company.stats, [stat.key]: parseInt(e.target.value) || 0 } });
                  }} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white hover:border-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-semibold text-[14px] rounded-xl hover:bg-slate-800 transition-all disabled:opacity-60 shadow-sm shadow-slate-900/10"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
