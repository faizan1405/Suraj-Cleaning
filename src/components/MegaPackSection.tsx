"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const headingWords = ["Mega", "Pack"];

export default function MegaPackSection() {
  return (
    <section id="mega-pack" className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Content (mirrored layout: content on left, image on right) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4"
            >
              SPECIAL OFFER
            </motion.span>

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
              Save more with our exclusive Mega Pack bundles. Hand-picked
              combinations of our best-selling cleaning and pooja essentials
              delivered at one great price — perfect for homes, offices, and
              festive gifting.
            </motion.p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
              {[
                { label: "Products in Pack", value: "6" },
                { label: "Categories", value: "6" },
                { label: "Savings Upto", value: "50" },
                { label: "Trusted By", value: "10K" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="text-center p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 shadow-sm pop-in"
                >
                  <p className="text-[28px] md:text-[32px] font-bold text-[#2563eb] leading-none mb-1">
                    {stat.value}
                    {stat.label === "Savings Upto" ? "%" : "+"}
                  </p>
                  <p className="text-[12px] text-[#64748b] font-medium mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/products?category=Combo%20Pack"
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white font-semibold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 btn-shine"
            >
              Explore Mega Packs
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 1.05 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-[24px] overflow-hidden aspect-[5/4] bg-slate-100">
              <Image
                src="/images/mega-pack-combo.jpg"
                alt="Swaraj Mega Home Care Combo Pack – 6 Essential Cleaning Products at ₹200"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Mega Pack badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2">
                <span className="text-lg">🎁</span>
                <div>
                  <p className="text-[11px] font-bold text-[#0f172a] leading-tight">
                    MEGA PACK
                  </p>
                  <p className="text-[10px] text-[#64748b] leading-tight">
                    Bundle & Save
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-blue-100/60 rounded-full blur-xl -z-10 soft-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}