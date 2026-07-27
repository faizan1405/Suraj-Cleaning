"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/check", {
          cache: "no-store",
        });

        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            router.replace("/admin/login");
          }
        } else {
          router.replace("/admin/login");
        }
      } catch {
        if (!cancelled) {
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return { isChecking, isAuthenticated };
}
