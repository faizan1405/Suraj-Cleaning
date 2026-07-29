"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface VariantRow {
  id: string;
  name: string;
  price: string;
  stock: string;
  sku: string;
  image: string;
}

export interface VariantEditorProps {
  value?: Array<{ name: string; price: number; stock: number; sku?: string; image?: string }>;
  onChange: (variants: Array<{ name: string; price: number; stock: number; sku?: string; image?: string }>) => void;
}

let nextId = 1;

function emptyRow(): VariantRow {
  return { id: String(nextId++), name: "", price: "", stock: "", sku: "", image: "" };
}

function rowToVariant(row: VariantRow): { name: string; price: number; stock: number; sku?: string; image?: string } | null {
  if (!row.name.trim()) return null;
  return {
    name: row.name.trim(),
    price: parseFloat(row.price) || 0,
    stock: parseInt(row.stock, 10) || 0,
    sku: row.sku.trim() || undefined,
    image: row.image.trim() || undefined,
  };
}

// Convert Variant[] from props to VariantRow[] for internal state
function variantsToRows(variants: Array<{ name: string; price: number; stock: number; sku?: string; image?: string }>): VariantRow[] {
  nextId = 1;
  return variants.map((v) => ({
    id: String(nextId++),
    name: v.name ?? "",
    price: v.price !== undefined ? String(v.price) : "",
    stock: v.stock !== undefined ? String(v.stock) : "",
    sku: v.sku ?? "",
    image: v.image ?? "",
  }));
}

/**
 * VariantEditor — manages its own row state internally so that adding empty
 * rows doesn't trigger a re-render cycle that resets state. Only emits
 * completed variants (those with a name) to the parent via onChange.
 */
export default function VariantEditor({ value = [], onChange }: VariantEditorProps) {
  const [rows, setRows] = useState<VariantRow[]>(() => variantsToRows(value));

  const syncToParent = useCallback((updated: VariantRow[]) => {
    const parsed = updated
      .map((r) => rowToVariant(r))
      .filter((v): v is { name: string; price: number; stock: number; sku?: string; image?: string } => v !== null);
    onChange(parsed);
  }, [onChange]);

  const addRow = useCallback(() => {
    const newRow = emptyRow();
    setRows((prev) => {
      const next = [...prev, newRow];
      // Do NOT sync to parent — adding an empty row should not push an empty
      // variant to the parent (would cause save to remove all variants).
      return next;
    });
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      syncToParent(next);
      return next;
    });
  }, [syncToParent]);

  const updateRow = useCallback((id: string, field: keyof VariantRow, val: string) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, [field]: val } : r));
      syncToParent(next);
      return next;
    });
  }, [syncToParent]);

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="grid grid-cols-[auto_1fr_100px_80px_120px_80px_36px] gap-2 items-center px-2">
        <div className="w-5" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Size / Name</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-center">Price</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-center">Stock</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SKU</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Image URL</span>
        <div className="w-9" />
      </div>

      {/* Variant rows */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto_1fr_100px_80px_120px_80px_36px] gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-2"
          >
            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab shrink-0" />
            <input
              type="text"
              value={row.name}
              onChange={(e) => updateRow(row.id, "name", e.target.value)}
              placeholder="e.g. 500 ml"
              className="admin-input"
            />
            <input
              type="number"
              value={row.price}
              onChange={(e) => updateRow(row.id, "price", e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="admin-input text-center"
            />
            <input
              type="number"
              value={row.stock}
              onChange={(e) => updateRow(row.id, "stock", e.target.value)}
              placeholder="0"
              min="0"
              step="1"
              className="admin-input text-center"
            />
            <input
              type="text"
              value={row.sku}
              onChange={(e) => updateRow(row.id, "sku", e.target.value)}
              placeholder="SKU-001"
              className="admin-input"
            />
            <input
              type="text"
              value={row.image}
              onChange={(e) => updateRow(row.id, "image", e.target.value)}
              placeholder="/images/..."
              className="admin-input"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove variant"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Variant button */}
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-[#2563eb] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Variant
      </button>

      {rows.length === 0 && (
        <p className="text-[12px] text-slate-400">No variants yet. Click "Add Variant" to create one.</p>
      )}
    </div>
  );
}
