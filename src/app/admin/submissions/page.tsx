"use client";

import { useState, useEffect } from "react";

import { Inbox, Mail, User, FileText, Trash2 } from "lucide-react";
import { PageHeader, Badge, EmptyState } from "@/components/admin/AdminUI";

type SubmissionType = "contact" | "distributor" | "newsletter";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SubmissionType>("contact");

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then((r) => r.ok ? r.json() : [])
      .catch(() => [])
      .then((d) => { setSubmissions(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

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
    const prefix = id.startsWith("dist_") ? "distributor" : id.startsWith("news_") ? "newsletter" : "contact";

    const res = await fetch(`/api/admin/data/${prefix}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div>
      <PageHeader
        title="Submissions"
        subtitle="View form submissions from visitors."
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = submissions.filter((s) => s.type === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === tab.key ? "bg-slate-100 text-slate-600" : "bg-slate-200/50 text-slate-500"
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
            <div key={i} className="ad-card p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ad-card">
          <EmptyState
            icon={Inbox}
            title="No submissions yet."
            description="Submissions will appear here when visitors fill out forms."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const TabIcon = activeTab === "contact" ? Mail : activeTab === "distributor" ? User : FileText;
            return (
              <div key={item.id} className="ad-card p-5 stat-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <TabIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium">
                      {new Date(item.submittedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      <span className="text-slate-300 mx-1.5">|</span>
                      {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5">
                  {getFields(activeTab, item).filter((f) => f !== "submittedAt").map((field) => (
                    <div key={field} className="text-[13px]">
                      <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider block mb-0.5">{fieldLabels[field] || field}</span>
                      <span className="text-slate-800 break-all">{renderField(field, item[field])}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
