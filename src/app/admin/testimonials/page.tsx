"use client";

import { useState, useEffect } from "react";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import type { Testimonial } from "@/data/testimonials";
import { Plus } from "lucide-react";

export default function AdminTestimonials() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);


  useEffect(() => {
    fetch("/api/admin/data/testimonials")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleSave = async (formData: Record<string, unknown>) => {
    const isEdit = !!editingItem;
    await fetch("/api/admin/data/testimonials", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingItem?.id, data: formData }),
    });
    const res = await fetch("/api/admin/data/testimonials");
    const d = await res.json();
    setData(Array.isArray(d) ? d : []);
  };

  const handleEdit = (item: Testimonial) => { setEditingItem(item); setModalOpen(true); };
  const handleAdd = () => { setEditingItem(null); setModalOpen(true); };
  const handleDelete = async (id: string) => {
    await fetch("/api/admin/data/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setData((prev) => prev.filter((t) => t.id !== id));
  };

  const columns: Column<Testimonial>[] = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "rating", label: "Rating", render: (item) => `${item.rating}/5` },
    { key: "quote", label: "Quote", render: (item) => item.quote.length > 60 ? item.quote.slice(0, 60) + "..." : item.quote },
  ];

  const fields: FieldConfig[] = [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true, placeholder: "e.g. Home Maker" },
    { name: "initials", label: "Initials", type: "text", required: true, placeholder: "e.g. PS" },
    { name: "quote", label: "Quote", type: "textarea", rows: 3, required: true },
    { name: "rating", label: "Rating (1-5)", type: "number", required: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Testimonials</h2>
        <p className="text-[14px] text-slate-500 mt-1">Manage customer testimonials.</p>
      </div>

      <div className="mb-6">
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-[14px] font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/10">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <AdminDataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />

      {modalOpen && (
        <AdminFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} title={editingItem ? "Edit Testimonial" : "Add Testimonial"} fields={fields} onSubmit={handleSave} initialData={editingItem || {}} />
      )}
    </div>
  );
}
