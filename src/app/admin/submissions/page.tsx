"use client";

import { useState, useEffect } from "react";

import { Inbox, Mail, User, FileText } from "lucide-react";

type SubmissionType = "contact" | "distributor" | "newsletter";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SubmissionType>("contact");
  

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/admin/submissions")
      .then((r) => r.ok ? r.json() : [])
      .then((d) => { setSubmissions(Array.isArray(d) ? d : []); setLoading(false); });
  }, [isAuthenticated]);

  const filtered = submissions.filter((s) => s.type === activeTab);

  const tabs: { key: SubmissionType; label: string; icon: typeof Mail }[] = [
    { key: "contact", label: "Contact", icon: Mail },
    { key: "distributor", label: "Distributor", icon: User },
    { key: "newsletter", label: "Newsletter", icon: FileText },
  ];

  const renderField = (key: string, value: any) => {
    if (value === null || value === undefined) return <span className="text-slate-400">-</span>;
    if (key === "submittedAt") return new Date(value).toLocaleString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const getFields = (type: SubmissionType, item: any) => {
    if (type === "contact") return ["name", "email", "phone", "message", "submittedAt"];
    if (type === "distributor") return ["fullName", "mobile", "email", "businessName", "city", "state", "businessType", "investment", "message", "submittedAt"];
    return ["email", "submittedAt"];
  };

  const fieldLabels: Record<string, string> = {
    name: "Name", email: "Email", phone: "Phone", message: "Message",
    fullName: "Full Name", mobile: "Mobile", businessName: "Business Name",
    city: "City", state: "State", businessType: "Business Type", investment: "Investment",
    submittedAt: "Submitted At",
  };

  const handleDelete = async (id: string) => {
    const typeMap: Record<string, string> = {
      contact: "submissions/contact.json",
      distributor: "submissions/distributor.json",
      newsletter: "submissions/newsletter.json",
    };

    const res = await fetch(`/api/admin/data/${Object.keys(typeMap).find(k => id.startsWith(k === "distributor" ? "dist" : k === "newsletter" ? "news" : "contact")) || "contact"}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-8 h-8 border border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="p-6">
      <div className="max-w-6xl">
        <h2 className="text-[24px] font-bold text-[#0f172a] mb-1">Submissions</h2>
        <p className="text-[14px] text-[#64748b] mb-6">View form submissions from visitors.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#e2e8f0]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = submissions.filter((s) => s.type === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-[#2563eb] text-[#2563eb]"
                    : "border-transparent text-[#64748b] hover:text-[#334155]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-blue-100 text-[#2563eb]" : "bg-slate-100 text-[#64748b]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submissions */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-[#64748b] text-[14px]">No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {activeTab === "contact" && <Mail className="w-4 h-4 text-[#2563eb]" />}
                    {activeTab === "distributor" && <User className="w-4 h-4 text-[#2563eb]" />}
                    {activeTab === "newsletter" && <FileText className="w-4 h-4 text-[#2563eb]" />}
                    <span className="text-[13px] font-medium text-[#64748b]">
                      {new Date(item.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-[12px] text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {getFields(activeTab, item).filter((f) => f !== "submittedAt").map((field) => (
                    <div key={field} className="text-[13px]">
                      <span className="font-medium text-[#334155]">{fieldLabels[field] || field}: </span>
                      <span className="text-[#64748b] break-all">{renderField(field, item[field])}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
