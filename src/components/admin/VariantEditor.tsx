"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface VariantRow {
  id: string;
  name: string;
  price: string;
  stock: string;
  sku: string;
}

export interface VariantEditorProps {
  value?: Array<{ name: string; price: number; stock: number; sku?: string }>;
  onChange: (variants: Array<{ name: string; price: number; stock: number; sku?: string }>) => void;
}

let nextId = 1;

function emptyRow(): VariantRow {
  return { id: String(nextId++), name: "", price: "", stock: "", sku: "" };
}

export default function VariantEditor({ value = [], onChange }: VariantEditorProps) {
  const [rows, setRows] = useState<VariantRow[]>([]);

  useEffect(() => {
    if (value.length === 0 && rows.length === 0) return;
    const mapped = value.map((v) => ({
      id: String(nextId++),
      name: v.name ?? "",
      price: v.price !== undefined ? String(v.price) : "",
      stock: v.stock !== undefined ? String(v.stock) : "",
      sku: v.sku ?? "",
    }));
    setRows(mapped);
  }, [value]);

  const syncToParent = (updated: VariantRow[]) => {
    const parsed = updated
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        price: parseFloat(r.price) || 0,
        stock: parseInt(r.stock, 10) || 0,
        sku: r.sku.trim() || undefined,
      }));
    onChange(parsed);
  };

  const addRow = () => {
    const newRow = emptyRow();
    setRows((prev) => {
      const next = [...prev, newRow];
      syncToParent(next);
      return next;
    });
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      syncToParent(next);
      return next;
    });
  };

  const updateRow = (id: string, field: keyof VariantRow, val: string) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, [field]: val } : r));
      syncToParent(next);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="grid grid-cols-[auto_1fr_100px_80px_120px_36px] gap-2 items-center px-2">
        <div className="w-5" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Size / Name</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-center">Price (₹)</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-center">Stock</span>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SKU</span>
        <div className="w-9" />
      </div>

      {/* Variant rows */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto_1fr_100px_80px_120px_36px] gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-2"
          >
            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab shrink-0" />
            <input
              type="text"
              value={row.name}
              onChange={(e) => updateRow(row.id, "name", e.target.value)}
              placeholder="e.g. 500 ml"
              className="px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder:text-slate-400"
            />
            <input
              type="number"
              value={row.price}
              onChange={(e) => updateRow(row.id, "price", e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder:text-slate-400 text-center"
            />
            <input
              type="number"
              value={row.stock}
              onChange={(e) => updateRow(row.id, "stock", e.target.value)}
              placeholder="0"
              min="0"
              step="1"
              className="px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder:text-slate-400 text-center"
            />
            <input
              type="text"
              value={row.sku}
              onChange={(e) => updateRow(row.id, "sku", e.target.value)}
              placeholder="SKU-001"
              className="px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder:text-slate-400"
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
