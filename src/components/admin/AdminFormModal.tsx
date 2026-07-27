"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
}

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  initialData?: any;
}

export default function AdminFormModal({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  initialData = {},
}: AdminFormModalProps) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const setField = (name: string, value: unknown) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name] ?? "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            value={String(value)}
            onChange={(e) => setField(field.name, e.target.value)}
            required={field.required}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all resize-none bg-white"
          />
        );
      case "select":
        return (
          <select
            id={field.name}
            value={String(value)}
            onChange={(e) => setField(field.name, e.target.value)}
            className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all bg-white"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => setField(field.name, e.target.checked)}
              className="w-4 h-4 text-[#2563eb] border-[#e2e8f0] rounded focus:ring-[#2563eb]"
            />
            <span className="text-[13px] text-[#64748b]">Enabled</span>
          </label>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.name}
            value={String(value)}
            onChange={(e) => setField(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full px-4 py-2.5 text-[14px] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all bg-white"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h3 className="text-[20px] font-bold text-[#0f172a]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#64748b]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-[13px] font-medium text-[#334155] mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-[14px] font-semibold text-[#334155] bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-[14px] font-semibold text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
