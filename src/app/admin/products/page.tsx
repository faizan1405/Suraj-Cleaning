"use client";

import { useState, useEffect } from "react";

import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import VariantEditor, { type VariantRow } from "@/components/admin/VariantEditor";
import type { Product } from "@/data/products";
import { Plus } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/admin/data/products"),
          fetch("/api/admin/data/categories"),
        ]);
        const p = pRes.ok ? await pRes.json() : [];
        const c = cRes.ok ? await cRes.json() : [];
        setProducts(Array.isArray(p) ? p : []);
        setCategories(Array.isArray(c) ? c : []);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    const isEdit = !!editingItem;
    const method = isEdit ? "PUT" : "POST";

    const saveRes = await fetch("/api/admin/data/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingItem?.id, data }),
    });

    if (!saveRes.ok) {
      const err = await saveRes.json().catch(() => ({}));
      alert(err.error || `Failed to ${isEdit ? "update" : "add"} product. Please try again.`);
      return;
    }

    const res = await fetch("/api/admin/data/products");
    if (res.ok) {
      const p = await res.json();
      setProducts(Array.isArray(p) ? p : []);
    } else {
      alert("Product saved but failed to refresh list. Please reload the page.");
    }
  };

  const handleEdit = (item: Product) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const delRes = await fetch("/api/admin/data/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!delRes.ok) {
      const err = await delRes.json().catch(() => ({}));
      alert(err.error || "Failed to delete product. Please try again.");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const columns: Column<Product>[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", render: (item) => `₹${item.price}` },
    { key: "featured", label: "Featured", render: (item) => item.featured ? "Yes" : "No" },
    { key: "bestSeller", label: "Best Seller", render: (item) => item.bestSeller ? "Yes" : "No" },
    { key: "active", label: "Active", render: (item) => item.active ? "Yes" : "No" },
    { key: "badge", label: "Badge", render: (item) => item.badge || "—" },
  ];

  const fields: FieldConfig[] = [
    { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. HYGI-X" },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. hygi-x" },
    { name: "category", label: "Category", type: "select", required: true, options: categories.map((c) => ({ value: c.name, label: c.name })) },
    { name: "shortDescription", label: "Short Description", type: "text", required: true, placeholder: "Brief tagline" },
    { name: "description", label: "Full Description", type: "textarea", rows: 3, placeholder: "Full product description" },
    { name: "price", label: "Base Price (₹)", type: "number", required: true, placeholder: "99" },
    { name: "stock", label: "Base Stock Quantity", type: "number", placeholder: "0 = out of stock" },
    { name: "badge", label: "Badge / Label (e.g. Combo, Best Value)", type: "text", placeholder: "Combo Offer" },
    {
      name: "variants",
      label: "Product Variants",
      type: "text",
      render: (value, onChange) => {
        const variants = Array.isArray(value) ? value : [];
        return (
          <VariantEditor
            value={variants}
            onChange={(v) => onChange(v)}
          />
        );
      },
    },
    { name: "sizes", label: "Sizes (comma separated)", type: "text", placeholder: "500ml, 1L" },
    { name: "image", label: "Product Image", type: "image-upload", placeholder: "/images/product-name.webp" },
    { name: "gallery", label: "Product Gallery", type: "multi-image-upload" },
    { name: "benefits", label: "Benefits (one per line)", type: "textarea", rows: 3, placeholder: "Kills 99.9% germs" },
    { name: "directions", label: "Directions (one per line)", type: "textarea", rows: 3, placeholder: "Apply under the rim" },
    { name: "featured", label: "Featured", type: "checkbox" },
    { name: "bestSeller", label: "Best Seller", type: "checkbox" },
    { name: "active", label: "Active", type: "checkbox" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Products</h2>
        <p className="text-[14px] text-slate-500 mt-1">Manage your product catalog.</p>
      </div>

      <div className="mb-6">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-[14px] font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/10"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <AdminDataTable
        columns={columns}
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {modalOpen && (
        <AdminFormModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingItem(null); }}
          title={editingItem ? "Edit Product" : "Add Product"}
          fields={fields}
          onSubmit={handleSave}
          initialData={editingItem || {}}
        />
      )}
    </div>
  );
}
