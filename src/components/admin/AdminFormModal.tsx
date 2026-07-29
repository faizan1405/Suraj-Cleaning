"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";

export type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "image-upload" | "multi-image-upload";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
  render?: (value: unknown, onChange: (val: unknown) => void, field: FieldConfig) => React.ReactNode;
}

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  initialData?: any;
}

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setPreview(null);
      onChange(data.url);
    } catch {
      alert("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const displayImage = preview || value;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
          {displayImage ? (
            <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Upload className="w-6 h-6 text-slate-300" />
          )}
        </div>
        <div className="flex-1">
          <label className="admin-btn admin-btn-primary cursor-pointer inline-flex">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {value ? "Replace Image" : "Choose Image"}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          {value && !preview && (
            <p className="mt-2 text-[11px] text-slate-400 truncate max-w-[200px] font-mono">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MultiImageUploadFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

function MultiImageUploadField({ value = [], onChange, maxImages = 8 }: MultiImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxImages - value.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    if (filesToUpload.length === 0) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }

    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) {
        alert("Please select image files only.");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(err.error || "Upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      onChange([...value, ...uploadedUrls]);
    } catch {
      alert("Failed to upload one or more images. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-md">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length < maxImages && (
        <label className="admin-btn admin-btn-primary cursor-pointer inline-flex">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {value.length > 0 ? "Add More Images" : "Choose Images"}
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      <p className="text-[11px] text-slate-400 font-medium">
        {value.length} / {maxImages} images uploaded
      </p>
    </div>
  );
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
    const value = formData[field.name] ?? (field.type === "checkbox" ? false : "");

    if (field.render) {
      return field.render(value, (val) => setField(field.name, val), field);
    }

    switch (field.type) {
      case "image-upload":
        return <ImageUploadField value={String(value)} onChange={(url) => setField(field.name, url)} />;
      case "multi-image-upload":
        return <MultiImageUploadField value={Array.isArray(value) ? value : []} onChange={(urls) => setField(field.name, urls)} />;
      case "textarea":
        return (
          <textarea
            id={field.name}
            value={String(value)}
            onChange={(e) => setField(field.name, e.target.value)}
            required={field.required}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            className="admin-textarea"
          />
        );
      case "select":
        return (
          <select
            id={field.name}
            value={String(value)}
            onChange={(e) => setField(field.name, e.target.value)}
            className="admin-select"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => setField(field.name, e.target.checked)}
                className="w-4 h-4 appearance-none border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
              />
              {Boolean(value) && (
                <svg className="absolute top-0.5 left-0.5 w-3.5 h-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </div>
            <span className="text-[13px] text-slate-600 group-hover:text-slate-800 transition-colors">Enabled</span>
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
            className="admin-input"
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="admin-modal-backdrop" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200/80 admin-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-[17px] font-bold text-slate-900">{title}</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form — actions are inside for proper submit */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="admin-label">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="admin-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
