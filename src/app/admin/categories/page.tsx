"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import type { Category } from "@/data/categories";
import { Plus } from "lucide-react";

export default function AdminCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const { isChecking, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/admin/data/categories")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, [isAuthenticated]);

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
    { name: "image", label: "Image Path", type: "text", placeholder: "/images/category-name.webp" },
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
            <h2 className="text-[24px] font-bold text-[#0f172a] mb-1">Categories</h2>
            <p className="text-[14px] text-[#64748b]">Manage product categories.</p>
          </div>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-[14px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        <AdminDataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>

      {modalOpen && (
        <AdminFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} title={editingItem ? "Edit Category" : "Add Category"} fields={fields} onSubmit={handleSave} initialData={editingItem || {}} />
      )}
    </div>
  );
}
