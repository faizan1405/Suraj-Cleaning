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
    } catch (err) {
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
        {/* Preview */}
        <div className="w-24 h-24 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center overflow-hidden shrink-0">
          {displayImage ? (
            <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[11px] text-slate-400 px-2 text-center">No image</span>
          )}
        </div>
        {/* Upload button */}
        <div className="flex-1">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors cursor-pointer disabled:opacity-60">
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
            <p className="mt-1.5 text-[11px] text-[#64748b] truncate max-w-[200px]">{value}</p>
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
    } catch (err) {
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
      {/* Image grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden">
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {/* Primary badge */}
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-[#2563eb] text-white text-[10px] font-semibold rounded-md">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {value.length < maxImages && (
        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors cursor-pointer disabled:opacity-60">
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

      {/* Count */}
      <p className="text-[11px] text-[#64748b]">
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
      case "image-upload":
        return (
          <ImageUploadField
            value={String(value)}
            onChange={(url) => setField(field.name, url)}
          />
        );
      case "multi-image-upload":
        return (
          <MultiImageUploadField
            value={Array.isArray(value) ? value : []}
            onChange={(urls) => setField(field.name, urls)}
          />
        );
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
