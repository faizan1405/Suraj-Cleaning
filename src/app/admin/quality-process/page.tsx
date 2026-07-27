"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import type { QualityStep } from "@/data/qualityProcess";
import { Plus } from "lucide-react";

export default function AdminQualityProcess() {
  const [data, setData] = useState<QualityStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QualityStep | null>(null);
  const { isChecking, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/admin/data/qualityProcess")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, [isAuthenticated]);

  const handleSave = async (formData: Record<string, unknown>) => {
    const isEdit = !!editingItem;
    await fetch("/api/admin/data/qualityProcess", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingItem?.id, data: formData }),
    });
    const res = await fetch("/api/admin/data/qualityProcess");
    const d = await res.json();
    setData(Array.isArray(d) ? d : []);
  };

  const handleEdit = (item: QualityStep) => { setEditingItem(item); setModalOpen(true); };
  const handleAdd = () => { setEditingItem(null); setModalOpen(true); };
  const handleDelete = async (id: string) => {
    await fetch("/api/admin/data/qualityProcess", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setData((prev) => prev.filter((q) => q.id !== id));
  };

  const columns: Column<QualityStep>[] = [
    { key: "stepNumber", label: "Step" },
    { key: "title", label: "Title" },
    { key: "image", label: "Image", render: (item) => item.image || "-" },
  ];

  const fields: FieldConfig[] = [
    { name: "stepNumber", label: "Step Number", type: "number", required: true },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
    { name: "image", label: "Process Image", type: "image-upload", placeholder: "/images/process-step.webp" },
  ];

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[24px] font-bold text-[#0f172a] mb-1">Quality Process</h2>
            <p className="text-[14px] text-[#64748b]">Manage quality process steps.</p>
          </div>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-[14px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
        <AdminDataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>

      {modalOpen && (
        <AdminFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} title={editingItem ? "Edit Step" : "Add Step"} fields={fields} onSubmit={handleSave} initialData={editingItem || {}} />
      )}
    </div>
  );
}
