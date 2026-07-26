"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavClick = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="flex items-center justify-between h-[72px] md:h-[80px]">
          {/* Logo */}
          <a
            href="#home"
            className="flex flex-col leading-none shrink-0"
            aria-label="Swaraj Enterprises Home"
          >
            <span className="text-[22px] md:text-[26px] font-bold tracking-tight text-[#0f172a]">
              SWARAJ
            </span>
            <span className="text-[13px] md:text-[14px] font-semibold tracking-[0.25em] text-[#2563eb] -mt-0.5">
              ENTERPRISES
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-2 text-[14px] font-medium text-[#334155] hover:text-[#2563eb] transition-colors rounded-lg hover:bg-blue-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden lg:inline-flex items-center px-5 py-2.5 bg-[#2563eb] text-white text-[14px] font-semibold rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
          >
            Get in Touch
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2 text-[#0f172a]"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={handleNavClick}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-[72px] border-b border-slate-100">
                <span className="text-lg font-bold text-[#0f172a]">Menu</span>
                <button
                  onClick={handleNavClick}
                  className="p-2 -mr-2 text-[#0f172a]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav
                className="flex-1 overflow-y-auto px-4 py-4"
                aria-label="Mobile navigation"
              >
                {navigation.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="block py-3.5 px-4 text-[16px] font-medium text-[#334155] hover:text-[#2563eb] hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
