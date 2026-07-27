"use client";

import { useState, useEffect } from "react";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import type { QualityStep } from "@/data/qualityProcess";
import { Plus } from "lucide-react";

export default function AdminQualityProcess() {
  const [data, setData] = useState<QualityStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QualityStep | null>(null);


  useEffect(() => {
    fetch("/api/admin/data/qualityProcess")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Quality Process</h2>
        <p className="text-[14px] text-slate-500 mt-1">Manage quality process steps.</p>
      </div>

      <div className="mb-6">
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-[14px] font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/10">
          <Plus className="w-4 h-4" /> Add Step
        </button>
      </div>

      <AdminDataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />

      {modalOpen && (
        <AdminFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} title={editingItem ? "Edit Step" : "Add Step"} fields={fields} onSubmit={handleSave} initialData={editingItem || {}} />
      )}
    </div>
  );
}
