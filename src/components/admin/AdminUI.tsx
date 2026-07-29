"use client";

import { cn } from "@/lib/utils";

/* ==========================================================================
   Admin UI Primitives — single source of truth for admin styling
   ========================================================================== */

/* ---------- Page Header ---------- */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="ad-page-header">
      <div className="min-w-0">
        <h2 className="ad-page-title">{title}</h2>
        {subtitle && <p className="ad-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Stat Card (Dashboard) ---------- */
interface StatCardProps {
  label: string;
  value: string | number;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "violet" | "emerald" | "amber" | "rose" | "indigo" | "teal";
}

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  blue:    { bg: "bg-blue-50",  text: "text-blue-600",  dot: "bg-blue-500" },
  violet:  { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-500" },
  rose:    { bg: "bg-rose-50",   text: "text-rose-600",   dot: "bg-rose-500" },
  indigo:  { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
  teal:    { bg: "bg-teal-50",   text: "text-teal-600",   dot: "bg-teal-500" },
};

export function StatCard({ label, value, href, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color];
  const content = (
    <div className="ad-card stat-lift p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", c.bg)}>
          <Icon className={cn("w-5 h-5", c.text)} />
        </div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-[30px] font-bold text-slate-900 tracking-tight leading-none">
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline text-inherit">
        {content}
      </a>
    );
  }
  return content;
}

/* ---------- Empty State ---------- */
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-[14px] font-semibold text-slate-700">{title}</p>
      {description && <p className="text-[13px] text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Badge ---------- */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
}

const badgeVariants: Record<string, { bg: string; text: string }> = {
  success: { bg: "bg-emerald-100", text: "text-emerald-700" },
  warning: { bg: "bg-amber-100",   text: "text-amber-700" },
  danger:  { bg: "bg-red-100",     text: "text-red-700" },
  info:    { bg: "bg-blue-100",    text: "text-blue-700" },
  neutral: { bg: "bg-slate-100",   text: "text-slate-600" },
  default: { bg: "bg-slate-100",   text: "text-slate-600" },
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  const v = badgeVariants[variant];
  return (
    <span className={cn("ad-badge", v.bg, v.text)}>
      {children}
    </span>
  );
}

/* ---------- Table Wrapper ---------- */
export function TableWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("ad-card overflow-hidden", className)}>
      <div className="admin-table-wrap">
        <table className="w-full text-left admin-table">
          {children}
        </table>
      </div>
    </div>
  );
}

/* ---------- Loading Skeleton ---------- */
export function SkeletonLines({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-14 skeleton" />
      ))}
    </div>
  );
}

/* ---------- Loading Spinner ---------- */
export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-[14px] text-slate-500 font-medium">{text}</span>
    </div>
  );
}

/* ---------- Section (card wrapper for settings) ---------- */
interface SectionProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <div className="ad-card overflow-hidden">
      <div className="ad-card-header">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <h3 className="text-[14px] font-bold text-slate-800">{title}</h3>
        </div>
      </div>
      <div className="ad-card-body">{children}</div>
    </div>
  );
}
