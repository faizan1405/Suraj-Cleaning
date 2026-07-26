"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { company } from "@/data/company";

function AnimatedCounter({
  target,
  suffix = "+",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const startTime = performance.now();
    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  const stats = [
    { label: "Happy Customers", value: company.stats.customers },
    { label: "Distributors", value: company.stats.distributors },
    { label: "Products", value: company.stats.products },
    { label: "Years of Trust", value: company.stats.years },
  ];

  return (
    <section id="about" className="py-[72px] md:py-[88px] bg-[#f8fafc]">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] bg-slate-100 shadow-lg">
              <Image
                src="/images/about-building.webp"
                alt="Swaraj Enterprises facility"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Made in India badge */}
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
            {/* Decorative element */}
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-blue-100/60 rounded-full blur-xl -z-10" />
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
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#0f172a] mb-4">
              Swaraj Enterprises
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-8">
              We are committed to providing high-quality cleaning solutions that
              make your everyday life cleaner, healthier and happier. Our products
              are made with carefully selected ingredients and advanced technology
              to deliver superior performance and lasting freshness.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
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

            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white font-semibold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
            >
              Read More About Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
