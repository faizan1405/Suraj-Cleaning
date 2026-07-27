"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminFormModal, { FieldConfig } from "@/components/admin/AdminFormModal";
import type { Product } from "@/data/products";
import { Plus } from "lucide-react";

export default function AdminProducts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const [p, c] = await Promise.all([
        fetch("/api/admin/data/products").then((r) => r.json()),
        fetch("/api/admin/data/categories").then((r) => r.json()),
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/admin/data/products` : "/api/admin/data/products";
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingItem?.id,
        data,
      }),
    });

    // Refresh
    const res = await fetch("/api/admin/data/products");
    const p = await res.json();
    setProducts(Array.isArray(p) ? p : []);
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
    await fetch("/api/admin/data/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const columns: Column<Product>[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", render: (item) => `₹${item.price}` },
    { key: "featured", label: "Featured", render: (item) => item.featured ? "Yes" : "No" },
    { key: "bestSeller", label: "Best Seller", render: (item) => item.bestSeller ? "Yes" : "No" },
    { key: "active", label: "Active", render: (item) => item.active ? "Yes" : "No" },
  ];

  const fields: FieldConfig[] = [
    { name: "name", label: "Product Name", type: "text", required: true, placeholder: "e.g. HYGI-X" },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. hygi-x" },
    { name: "category", label: "Category", type: "select", required: true, options: categories.map((c) => ({ value: c.name, label: c.name })) },
    { name: "shortDescription", label: "Short Description", type: "text", required: true, placeholder: "Brief tagline" },
    { name: "description", label: "Full Description", type: "textarea", rows: 3, placeholder: "Full product description" },
    { name: "price", label: "Price (₹)", type: "number", required: true, placeholder: "99" },
    { name: "sizes", label: "Sizes (comma separated)", type: "text", placeholder: "500ml, 1L" },
    { name: "image", label: "Image Path", type: "text", placeholder: "/images/product-name.webp" },
    { name: "benefits", label: "Benefits (one per line)", type: "textarea", rows: 3, placeholder: "Kills 99.9% germs" },
    { name: "directions", label: "Directions (one per line)", type: "textarea", rows: 3, placeholder: "Apply under the rim" },
    { name: "featured", label: "Featured", type: "checkbox" },
    { name: "bestSeller", label: "Best Seller", type: "checkbox" },
    { name: "active", label: "Active", type: "checkbox" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[24px] font-bold text-[#0f172a] mb-1">Products</h2>
                <p className="text-[14px] text-[#64748b]">Manage your product catalog.</p>
              </div>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-[14px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-sm"
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
          </div>
        </main>
      </div>

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
