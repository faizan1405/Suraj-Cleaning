"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import type { NavigationItem } from "@/data/navigation";
import { cn } from "@/lib/utils";
import CartIcon from "@/components/CartIcon";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [user, setUser] = useState<{ name: string; picture?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/admin/data/navigation", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) setNavigation(data.items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const closeMenu = useCallback(() => setIsMobileOpen(false), []);

  const displayNav = navigation.length > 0 ? navigation : [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Distributor", href: "/distributor" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-[1260px] px-5 md:px-8">
            <div className="flex items-center justify-between h-[72px] md:h-[80px]">
              <motion.a
                href="#home"
                className="flex flex-col leading-none shrink-0 group"
                aria-label="Swaraj Enterprises Home"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <img
                  src="/images/Logo.png"
                  alt="Swaraj Enterprises"
                  className="h-[72px] md:h-[80px] w-auto object-contain"
                />
              </motion.a>

              <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                {displayNav.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}
                    className="relative px-3.5 py-2 text-[14px] font-medium text-[#334155] hover:text-[#2563eb] transition-colors rounded-lg hover:bg-blue-50 nav-underline"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <motion.a
                href="#contact"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="hidden lg:inline-flex items-center px-5 py-2.5 bg-[#2563eb] text-white text-[14px] font-semibold rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 btn-shine"
              >
                <span className="relative">Get in Touch</span>
              </motion.a>

              <CartIcon />

              <div className="flex items-center gap-1">
                {user && (
                  <a
                    href="/profile"
                    className="hidden lg:inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    {user.picture ? (
                      <img src={user.picture} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#2563eb]" />
                      </div>
                    )}
                    <span className="text-[13px] font-medium text-[#334155]">{user.name.split(" ")[0]}</span>
                  </a>
                )}
                {!user && (
                  <a
                    href="/signin"
                    className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-[#2563eb] hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </a>
                )}
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="lg:hidden p-2 -mr-2 text-[#0f172a]"
                  onClick={() => setIsMobileOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={isMobileOpen}
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 z-[55] lg:hidden backdrop-blur-sm"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[60] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-[72px] border-b border-slate-100">
                <span className="text-lg font-bold text-[#0f172a]">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  onClick={closeMenu}
                  className="p-2 -mr-2 text-[#0f172a] rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {user && (
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {user.picture ? (
                      <img src={user.picture} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#2563eb]" />
                      </div>
                    )}
                    <div>
                      <p className="text-[14px] font-semibold text-[#0f172a]">{user.name}</p>
                      <a href="/profile" onClick={closeMenu} className="text-[12px] text-[#2563eb]">View Profile</a>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
                {displayNav.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 6 }}
                    className="block py-3.5 px-4 text-[16px] font-medium text-[#334155] hover:text-[#2563eb] hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}

                <div className="mt-4 pt-4 border-t border-slate-100">
                  {user ? (
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        onClick={closeMenu}
                        className="flex items-center gap-3 w-full py-3.5 px-4 text-[16px] font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        Sign Out
                      </button>
                    </form>
                  ) : (
                    <a
                      href="/signin"
                      onClick={closeMenu}
                      className="flex items-center gap-3 py-3.5 px-4 text-[16px] font-medium text-[#2563eb] hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" /> Sign In
                    </a>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}