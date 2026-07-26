"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

export default function ProductCategories() {
  return (
    <section id="categories" className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <SectionHeading title="OUR PRODUCT CATEGORIES" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={`#products`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group bg-white border border-slate-100 rounded-[20px] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
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
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#products"
            className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px] hover:gap-3 transition-all"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
        {title}
      </h2>
      <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
    </div>
  );
}
