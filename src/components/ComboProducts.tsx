"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/product-types";
import { ProductCard } from "@/components/products/ProductCard";

export default function ComboProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-combo-card]");
    const cardWidth = card ? (card as HTMLElement).offsetWidth + 20 : 340;
    const px = dir === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: px, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetch("/api/products/combo", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : [])
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const comboProducts = products;

  const headingWords = "COMBO OFFERS".split(" ");

  if (loading) {
    return (
      <section id="combo" className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
              COMBO OFFERS
            </h2>
            <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[20px] overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-6 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (comboProducts.length === 0) {
    return null;
  }

  return (
    <section id="combo" className="py-[72px] md:py-[88px] bg-[#f8fafc]">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <motion.h2
            className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight flex flex-wrap justify-center gap-x-[0.25em] overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ staggerChildren: 0.04, delayChildren: 0.1 }}
          >
            {headingWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    show: { y: "0%", opacity: 1 },
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3"
          />
          <p className="text-[14px] text-[#64748b] mt-3 max-w-lg mx-auto">
            Grab these exclusive combo deals and save more on your favorite products.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {comboProducts.map((product, i) => (
              <div
                key={product.id}
                data-combo-card
                className="snap-start shrink-0 w-[280px] sm:w-[300px] lg:w-[340px]"
              >
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>

          {comboProducts.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-[40%] -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-[#334155]" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-[40%] -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-[#334155]" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="/products"
            className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px] hover:gap-3 transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
