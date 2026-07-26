"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Sparkles, Leaf, ArrowRight } from "lucide-react";
import Image from "next/image";

const features = [
  { icon: ShieldCheck, label: "99.9% Germ Protection" },
  { icon: Heart, label: "Safe for Family" },
  { icon: Sparkles, label: "Pleasant Fragrance" },
  { icon: Leaf, label: "Eco Friendly Formula" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-[100px] md:pt-[120px] pb-[60px] md:pb-[80px]"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-[30%] w-[200px] h-[200px] bg-amber-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Eyebrow */}
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase rounded-full mb-6">
              Premium Cleaning Solutions
            </span>

            {/* Heading */}
            <h1 className="text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[60px] font-bold leading-[1.08] text-[#0f172a] mb-5">
              Clean Homes
              <br />
              <span className="text-[#2563eb]">Happy</span> Lives
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] md:text-[16px] text-[#64748b] mb-7 max-w-md">
              Powerful Cleaning | Safe for Family | Fresh & Fragrant
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-full"
                >
                  <f.icon className="w-4 h-4 text-[#2563eb]" strokeWidth={2.5} />
                  <span className="text-[13px] font-medium text-[#334155] whitespace-nowrap">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-semibold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#distributor"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#2563eb] font-semibold text-[15px] rounded-full border-2 border-[#2563eb] hover:bg-blue-50 transition-all hover:-translate-y-0.5"
              >
                Become a Distributor
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100/50 rounded-[28px] overflow-hidden shadow-xl">
              {/* SVG Product Illustration */}
              <svg
                viewBox="0 0 500 500"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background gradient */}
                <rect width="500" height="500" rx="28" fill="#f0f7ff" />
                <circle cx="400" cy="100" r="120" fill="#dbeafe" opacity="0.6" />
                <circle cx="80" cy="420" r="90" fill="#dbeafe" opacity="0.4" />

                {/* Floor shadow */}
                <ellipse cx="250" cy="430" rx="200" ry="12" fill="#cbd5e1" opacity="0.3" />

                {/* Product Bottle 1 - Blue */}
                <g transform="translate(80, 160)">
                  <rect x="10" y="30" width="50" height="110" rx="12" fill="#2563eb" />
                  <rect x="15" y="5" width="40" height="30" rx="4" fill="#1d4ed8" />
                  <rect x="25" y="0" width="20" height="10" rx="3" fill="#3b82f6" />
                  <rect x="20" y="55" width="30" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="20" y="65" width="30" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="20" y="75" width="20" height="4" rx="2" fill="white" opacity="0.7" />
                  <text x="35" y="110" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                    HYGI-X
                  </text>
                </g>

                {/* Product Bottle 2 - Yellow/Cleaner */}
                <g transform="translate(170, 120)">
                  <rect x="10" y="30" width="55" height="130" rx="14" fill="#0ea5e9" />
                  <rect x="15" y="5" width="40" height="28" rx="5" fill="#0284c7" />
                  <rect x="22" y="0" width="26" height="10" rx="3" fill="#38bdf8" />
                  <rect x="18" y="58" width="38" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="18" y="68" width="38" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="18" y="78" width="25" height="4" rx="2" fill="white" opacity="0.7" />
                  <text x="37" y="130" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                    CLEARON
                  </text>
                </g>

                {/* Product Bottle 3 - Orange/Pink (Liquid) */}
                <g transform="translate(260, 140)">
                  <rect x="8" y="30" width="48" height="120" rx="12" fill="#f97316" />
                  <rect x="12" y="5" width="40" height="28" rx="5" fill="#ea580c" />
                  <rect x="20" y="0" width="24" height="10" rx="3" fill="#fb923c" />
                  <rect x="16" y="55" width="32" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="16" y="65" width="32" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="16" y="75" width="22" height="4" rx="2" fill="white" opacity="0.7" />
                  <text x="32" y="120" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                    SUPREME
                  </text>
                </g>

                {/* Product Bottle 4 - Green -->
                <g transform="translate(340, 180)">
                  <rect x="10" y="30" width="52" height="100" rx="12" fill="#22c55e" />
                  <rect x="15" y="5" width="40" height="28" rx="5" fill="#16a34a" />
                  <rect x="22" y="0" width="26" height="10" rx="3" fill="#4ade80" />
                  <rect x="18" y="55" width="36" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="18" y="65" width="36" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="18" y="75" width="24" height="4" rx="2" fill="white" opacity="0.7" />
                  <text x="36" y="105" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                    FABRIX
                  </text>
                </g>

                {/* Sparkle decorations */}
                <circle cx="120" cy="100" r="4" fill="#f59e0b" opacity="0.6" />
                <circle cx="420" cy="200" r="5" fill="#f59e0b" opacity="0.5" />
                <circle cx="350" cy="80" r="3" fill="#2563eb" opacity="0.4" />
                <circle cx="100" cy="350" r="4" fill="#22c55e" opacity="0.4" />

                {/* Small plant decoration */}
                <g transform="translate(30, 380)">
                  <rect x="8" y="30" width="24" height="30" rx="4" fill="#8B5CF6" />
                  <circle cx="20" cy="25" r="15" fill="#22c55e" />
                  <circle cx="10" cy="15" r="10" fill="#16a34a" />
                  <circle cx="30" cy="15" r="10" fill="#16a34a" />
                </g>

                {/* Spray bottle decoration */}
                <g transform="translate(400, 380)">
                  <rect x="5" y="25" width="30" height="50" rx="8" fill="#06b6d4" />
                  <rect x="12" y="0" width="16" height="28" rx="4" fill="#0891b2" />
                  <rect x="17" y="-5" width="6" height="8" rx="2" fill="#22d3ee" />
                  <rect x="10" y="40" width="20" height="3" rx="1.5" fill="white" opacity="0.5" />
                  <rect x="10" y="48" width="20" height="3" rx="1.5" fill="white" opacity="0.5" />
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
