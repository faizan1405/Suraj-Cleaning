"use client";

import { useState, useEffect } from "react";

import { Save, Loader2, MapPin, Phone, Mail, Clock, Building2, TrendingUp } from "lucide-react";
import type { CompanyInfo } from "@/data/company";
import { Section, PageHeader } from "@/components/admin/AdminUI";

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
        <PageHeader title="Settings" subtitle="Manage company information and configuration." />
        <div className="ad-card p-8 animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage company information and configuration."
      />

      {message && (
        <div className={`mb-6 text-[14px] px-4 py-3 rounded-xl border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <Section title="General Info" icon={Building2}>
          <div className="space-y-5">
            <div>
              <label className="admin-label">Company Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" required value={company.name} onChange={(e) => updateField("name", e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Tagline</label>
              <input type="text" name="tagline" value={company.tagline} onChange={(e) => updateField("tagline", e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea name="description" rows={3} value={company.description} onChange={(e) => updateField("description", e.target.value)} className="admin-textarea" />
            </div>
          </div>
        </Section>

        {/* Contact Details */}
        <Section title="Contact Details" icon={Mail}>
          <div className="space-y-5">
            <div>
              <label className="admin-label">Address</label>
              <textarea name="address" rows={2} value={company.address} onChange={(e) => updateField("address", e.target.value)} className="admin-textarea" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="admin-label">Phone</label>
                <input type="text" name="phone" value={company.phone} onChange={(e) => updateField("phone", e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input type="email" name="email" value={company.email} onChange={(e) => updateField("email", e.target.value)} className="admin-input" />
              </div>
            </div>
            <div>
              <label className="admin-label">Working Hours</label>
              <input type="text" name="hours" value={company.hours} onChange={(e) => updateField("hours", e.target.value)} className="admin-input" />
            </div>
          </div>
        </Section>

        {/* Statistics */}
        <Section title="Statistics" icon={TrendingUp}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { key: "customers", label: "Customers" },
              { key: "distributors", label: "Distributors" },
              { key: "products", label: "Products" },
              { key: "years", label: "Years" },
            ].map((stat) => (
              <div key={stat.key}>
                <label className="admin-label">{stat.label}</label>
                <input
                  type="number"
                  name={`stats.${stat.key}`}
                  value={(company.stats as any)[stat.key]}
                  onChange={(e) => {
                    setCompany({ ...company, stats: { ...company.stats, [stat.key]: parseInt(e.target.value) || 0 } });
                  }}
                  className="admin-input"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Save */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
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
