"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: AdminConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200/80">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-[17px] font-bold text-slate-900 mb-1.5">{title}</h3>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[14px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-[14px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm shadow-red-600/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
