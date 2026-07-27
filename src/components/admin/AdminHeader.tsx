"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center px-6 sticky top-0 z-30">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 -ml-2 mr-3 text-[#334155] hover:text-[#0f172a]"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-[18px] font-bold text-[#0f172a]">
          Swaraj Enterprises
        </h1>
        <p className="text-[12px] text-[#64748b]">Admin Panel</p>
      </div>
    </header>
  );
}
