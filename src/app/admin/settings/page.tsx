"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, Loader2 } from "lucide-react";
import type { CompanyInfo } from "@/data/company";

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/data/company")
      .then((r) => r.json())
      .then((d) => { setCompany(d); setLoading(false); });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    setMessage(null);

    const form = e.currentTarget;
    const data: Record<string, any> = { ...company };

    // Read flat form fields and nest stats
    const customersInput = form.querySelector<HTMLInputElement>('[name="stats.customers"]');
    const distributorsInput = form.querySelector<HTMLInputElement>('[name="stats.distributors"]');
    const productsInput = form.querySelector<HTMLInputElement>('[name="stats.products"]');
    const yearsInput = form.querySelector<HTMLInputElement>('[name="stats.years"]');

    if (customersInput) data.stats = { ...data.stats, customers: parseInt(customersInput.value) || 0 };
    if (distributorsInput) data.stats = { ...data.stats, distributors: parseInt(distributorsInput.value) || 0 };
    if (productsInput) data.stats = { ...data.stats, products: parseInt(productsInput.value) || 0 };
    if (yearsInput) data.stats = { ...data.stats, years: parseInt(yearsInput.value) || 0 };

    // Read top-level string fields
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 animate-pulse space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#0f172a] mb-1">Settings</h2>
              <p className="text-[14px] text-[#64748b]">Manage company information.</p>
            </div>

            {message && (
              <div className={`mb-6 text-[14px] px-4 py-3 rounded-xl ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 space-y-5">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-4">General Info</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Company Name *</label>
                    <input type="text" name="name" required value={company.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Tagline</label>
                    <input type="text" name="tagline" value={company.tagline} onChange={(e) => updateField("tagline", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Description</label>
                    <textarea name="description" rows={3} value={company.description} onChange={(e) => updateField("description", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] resize-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e2e8f0] pt-5">
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-4">Contact Details</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Address</label>
                    <textarea name="address" rows={2} value={company.address} onChange={(e) => updateField("address", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] resize-none" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Phone</label>
                      <input type="text" name="phone" value={company.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Email</label>
                      <input type="email" name="email" value={company.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">Working Hours</label>
                    <input type="text" name="hours" value={company.hours} onChange={(e) => updateField("hours", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e2e8f0] pt-5">
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-4">Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: "stats.customers", label: "Customers" },
                    { key: "stats.distributors", label: "Distributors" },
                    { key: "stats.products", label: "Products" },
                    { key: "stats.years", label: "Years" },
                  ].map((stat) => (
                    <div key={stat.key}>
                      <label className="block text-[13px] font-medium text-[#334155] mb-1.5">{stat.label}</label>
                      <input type="number" name={stat.key} value={(company.stats as any)[stat.key.replace("stats.", "")]} onChange={(e) => {
                        const field = stat.key.replace("stats.", "");
                        setCompany({ ...company, stats: { ...company.stats, [field]: parseInt(e.target.value) || 0 } });
                      }} className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white font-semibold text-[14px] rounded-xl hover:bg-[#1d4ed8] transition-colors disabled:opacity-60"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Settings</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
