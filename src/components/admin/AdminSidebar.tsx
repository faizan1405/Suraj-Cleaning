"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Settings,
  FileText,
  Inbox,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/quality-process", label: "Quality Process", icon: Settings },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: FileText },
];

const sectionLabels: Record<string, string> = {
  Dashboard: "Overview",
  Orders: "Sales",
  Products: "Catalog",
  Categories: "Catalog",
  Testimonials: "Social Proof",
  "Quality Process": "Quality",
  Submissions: "Inbox",
  Settings: "Config",
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({ isOpen, onClose, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[260px] transition-transform duration-300 ease-in-out",
          "bg-gradient-to-b from-slate-900 to-slate-800 admin-drawer",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06]">
          <div>
            <span className="text-[17px] font-bold tracking-tight text-white leading-none block">
              SWARAJ
            </span>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-blue-400/80 block mt-0.5">
              ENTERPRISES
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 -mr-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-64px-64px)]">
          {/* Overview section label */}
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
            Menu
          </p>

          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-0.5 w-[3px] h-5 bg-blue-400 rounded-r-full" />
                )}

                <div className={cn(
                  "w-[34px] h-[34px] flex items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-white/15"
                    : "bg-transparent group-hover:bg-white/[0.08]"
                )}>
                  <item.icon className={cn("w-[17px] h-[17px]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300")} />
                </div>

                <span className="flex-1">{item.label}</span>

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.06]">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-[12px] font-bold text-blue-400">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-300 truncate">Admin</p>
              <p className="text-[11px] text-slate-500 truncate">admin@suraj.com</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <div className="w-[34px] h-[34px] flex items-center justify-center rounded-lg hover:bg-red-500/10">
              <LogOut className="w-[17px] h-[17px]" />
            </div>
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
