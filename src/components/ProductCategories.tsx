"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/data/categories";

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetch("/api/admin/data/categories", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : [])
      .then((data: Category[]) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="categories" className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
              OUR PRODUCT CATEGORIES
            </h2>
            <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[20px] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <SectionHeading title="OUR PRODUCT CATEGORIES" />

        <div className="relative group/arrows">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat, i) => (
              <motion.a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                initial={isInView ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: i * 0.08,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 0.8,
                }}
                className="group bg-white border border-slate-100 rounded-[20px] overflow-hidden card-lift flex flex-col min-w-[200px] md:min-w-[220px] lg:min-w-[240px] snap-start"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 img-zoom"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[12px] text-[#64748b] leading-relaxed mb-3">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563eb] group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3.5 h-3.5 arrow-nudge" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 items-center justify-center text-slate-600 hover:text-[#2563eb] hover:shadow-xl transition-all opacity-0 group-hover/arrows:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 items-center justify-center text-slate-600 hover:text-[#2563eb] hover:shadow-xl transition-all opacity-0 group-hover/arrows:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-10">
          <a
            href="/products"
            className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px] hover:gap-3 transition-all group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 arrow-nudge" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  const words = title.split(" ");
  return (
    <div className="text-center mb-10 md:mb-12">
      <motion.h2
        className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight flex flex-wrap justify-center gap-x-[0.25em]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: { y: "0%", opacity: 1 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
    </div>
  );
}
