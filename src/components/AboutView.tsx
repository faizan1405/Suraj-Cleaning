"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CompanyInfo } from "@/data/company";

function AnimatedCounter({
  target,
  suffix = "+",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = (el: HTMLSpanElement | null) => {
    if (!el) return;
    const duration = 1800;
    const startTime = performance.now();
    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(eased * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  };

  return <span ref={ref} />;
}

const headingWords = ["Swaraj", "Enterprises"];

export default function AboutView({
  company,
  productCount,
}: {
  company: CompanyInfo;
  productCount: number;
}) {
  const stats = [
    { label: "Happy Customers", value: company.stats.customers },
    { label: "Distributors", value: company.stats.distributors },
    { label: "Products", value: productCount || company.stats.products },
    { label: "Years of Trust", value: company.stats.years },
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="pt-[120px] pb-[40px] md:pt-[140px] md:pb-[50px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[44px] font-bold text-[#0f172a] mb-3"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] md:text-[16px] text-[#64748b] max-w-lg mx-auto"
          >
            {company.description}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-4"
          />
        </div>
      </section>

      {/* About Content */}
      <section className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 1.05 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-[24px] overflow-hidden aspect-[5/4] bg-slate-100">
                <Image
                  src="/images/about-products.jpeg"
                  alt="Swaraj Enterprises product range - Hygix, Handpure, Dishsheen, Clearon"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2">
                  <span className="text-lg">🇮🇳</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#0f172a] leading-tight">
                      MADE IN INDIA
                    </p>
                    <p className="text-[10px] text-[#64748b] leading-tight">
                      Quality Assured
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-blue-100/60 rounded-full blur-xl -z-10 soft-pulse" />
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
                ABOUT US
              </span>

              <h2 className="text-[32px] md:text-[40px] font-bold text-[#0f172a] mb-4 overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                    duration: 0.6,
                  }}
                >
                  {headingWords.map((word, i) => (
                    <span key={i} className="inline-block mr-[0.25em]">
                      {word}
                    </span>
                  ))}
                </motion.span>
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-8"
              >
                We are committed to providing high-quality cleaning solutions that
                make your everyday life cleaner, healthier and happier. Our products
                are made with carefully selected ingredients and advanced technology
                to deliver superior performance and lasting freshness.
              </motion.p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm pop-in"
                  >
                    <p className="text-[28px] md:text-[32px] font-bold text-[#2563eb] leading-none mb-1">
                      <AnimatedCounter target={stat.value} />
                    </p>
                    <p className="text-[12px] text-[#64748b] font-medium mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="/about"
                whileHover={{ y: -3 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white font-semibold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 btn-shine"
              >
                Read More About Us
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              OUR STORY
            </span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-6">
              Built on Trust, Driven by Quality
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              {company.name} was founded with a simple mission — to provide households
              across India with premium quality cleaning products that are affordable,
              effective, and safe. From our humble beginnings, we have grown into a
              trusted brand serving hundreds of happy customers and distributors across
              the nation.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              Our range includes toilet cleaners, handwashes, dishwash liquids, glass
              cleaners, detergent powders, and fabric detergents — each formulated with
              the finest ingredients to ensure maximum cleaning power while being gentle
              on surfaces and skin.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed">
              We believe in building lasting relationships with our customers, partners,
              and distributors. When you choose {company.name}, you choose quality you
              can trust and service you can rely on.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              OUR VALUES
            </span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a]">
              What Drives Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Quality First",
                desc: "Every product is tested for superior performance and safety.",
              },
              {
                title: "Customer Focus",
                desc: "Your satisfaction is our top priority, always.",
              },
              {
                title: "Innovation",
                desc: "We continuously improve our formulations for better results.",
              },
              {
                title: "Integrity",
                desc: "Honest pricing, transparent dealings, genuine products.",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm card-lift text-center"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  {["🏆", "💎", "💡", "🤝"][i]}
                </div>
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">
                  {val.title}
                </h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
