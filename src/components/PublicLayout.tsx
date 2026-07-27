"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import FloatingContactActions from "@/components/FloatingContactActions";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <FloatingContactActions />}
    </>
  );
}
