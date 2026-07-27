"use client";

import { useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: menu + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Swaraj Enterprises
            </h1>
            <p className="text-[11px] font-medium text-slate-400 tracking-wide">
              ADMIN DASHBOARD
            </p>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search (visual only) */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[13px] text-slate-400 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-colors min-w-[200px]">
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-[14px] font-bold text-slate-800">Notifications</h3>
                </div>
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-[13px] text-slate-400">No new notifications</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 mx-1" />

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-500/20">
            <span className="text-[13px] font-bold text-white">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-slate-700 leading-tight">Admin</p>
            <p className="text-[11px] text-slate-400 leading-tight">Super Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
