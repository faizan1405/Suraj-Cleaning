"use client";

import { useState, useEffect } from "react";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import type { Category } from "@/data/categories";
import { Plus } from "lucide-react";

export default function AdminCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);


  useEffect(() => {
    fetch("/api/admin/data/categories")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleSave = async (formData: Record<string, unknown>) => {
    const isEdit = !!editingItem;
    await fetch("/api/admin/data/categories", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingItem?.id, data: formData }),
    });
    const res = await fetch("/api/admin/data/categories");
    const d = await res.json();
    setData(Array.isArray(d) ? d : []);
  };

  const handleEdit = (item: Category) => { setEditingItem(item); setModalOpen(true); };
  const handleAdd = () => { setEditingItem(null); setModalOpen(true); };
  const handleDelete = async (id: string) => {
    await fetch("/api/admin/data/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setData((prev) => prev.filter((c) => c.id !== id));
  };

  const columns: Column<Category>[] = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description", render: (item) => item.description.length > 60 ? item.description.slice(0, 60) + "..." : item.description },
  ];

  const fields: FieldConfig[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. floor-care" },
    { name: "description", label: "Description", type: "text", required: true },
    { name: "image", label: "Category Image", type: "image-upload", placeholder: "/images/category-name.webp" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Categories</h2>
        <p className="text-[14px] text-slate-500 mt-1">Manage your product categories.</p>
      </div>

      <div className="mb-6">
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-[14px] font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/10">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <AdminDataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />

      {modalOpen && (
        <AdminFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} title={editingItem ? "Edit Category" : "Add Category"} fields={fields} onSubmit={handleSave} initialData={editingItem || {}} />
      )}
    </div>
  );
}
