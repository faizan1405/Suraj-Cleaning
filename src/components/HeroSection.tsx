"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Sparkles, Leaf, ArrowRight } from "lucide-react";

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
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none floaty"
      />
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none floaty-slow"
      />
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-40 left-[30%] w-[200px] h-[200px] bg-amber-100/30 rounded-full blur-2xl pointer-events-none"
      />

      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            {/* Eyebrow badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase rounded-full mb-6 border border-blue-100 hover:bg-blue-100 transition-colors cursor-default"
            >
              Premium Cleaning Solutions
            </motion.span>

            {/* Heading with word reveal */}
            <div className="mb-5 overflow-hidden">
              <motion.h1
                className="text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[60px] font-bold leading-[1.08] text-[#0f172a]"
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.04, delayChildren: 0.2 }}
              >
                <motion.span
                  className="inline-block"
                  variants={{ hidden: { y: "110%", opacity: 0 }, show: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  Clean Homes
                </motion.span>
                <br />
                <motion.span
                  className="inline-block"
                  variants={{ hidden: { y: "110%", opacity: 0 }, show: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  <span className="text-[#2563eb] shimmer-text">Happy</span> Lives
                </motion.span>
              </motion.h1>
            </div>

            {/* Subtitle reveal */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15px] md:text-[16px] text-[#64748b] mb-7 max-w-md"
            >
              Powerful Cleaning | Safe for Family | Fresh &amp; Fragrant
            </motion.p>

            {/* Feature Badges - staggered reveal */}
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.07, delayChildren: 0.7 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, scale: 0.8, y: 12 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}
                  whileHover={{ scale: 1.08, borderColor: "rgba(37, 99, 235, 0.4)", backgroundColor: "#eff6ff" }}
                  className="group flex items-center gap-2 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-full transition-colors cursor-default"
                >
                  <f.icon className="w-4 h-4 text-[#2563eb] icon-pop" strokeWidth={2.5} />
                  <span className="text-[13px] font-medium text-[#334155] whitespace-nowrap">
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons with shine + lift */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-3.5"
            >
              <motion.a
                href="#products"
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-semibold text-[15px] rounded-full overflow-hidden btn-shine shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45"
              >
                <span className="relative">Shop Now</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                  className="relative"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.a>

              <motion.a
                href="#distributor"
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#2563eb] font-semibold text-[15px] rounded-full border-2 border-[#2563eb] hover:bg-blue-50 overflow-hidden btn-shine"
              >
                <span className="relative">Become a Distributor</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image - parallax-like floating animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100/50 rounded-[28px] overflow-hidden shadow-xl"
            >
              {/* SVG Product Illustration */}
              <svg
                viewBox="0 0 500 500"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background gradient */}
                <rect width="500" height="500" rx="28" fill="#f0f7ff" />
                <motion.circle
                  animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  cx="400" cy="100" r="120" fill="#dbeafe" opacity="0.6"
                />
                <motion.circle
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  cx="80" cy="420" r="90" fill="#dbeafe" opacity="0.4"
                />

                {/* Floor shadow */}
                <ellipse cx="250" cy="430" rx="200" ry="12" fill="#cbd5e1" opacity="0.3" />

                {/* Product Bottle 1 - Blue */}
                <g transform="translate(80, 160)">
                  <motion.rect x="10" y="30" width="50" height="110" rx="12" fill="#2563eb"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.rect x="15" y="5" width="40" height="30" rx="4" fill="#1d4ed8"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
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
                  <motion.rect x="10" y="30" width="55" height="130" rx="14" fill="#0ea5e9"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />
                  <motion.rect x="15" y="5" width="40" height="28" rx="5" fill="#0284c7"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />
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
                  <motion.rect x="8" y="30" width="48" height="120" rx="12" fill="#f97316"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                  />
                  <motion.rect x="12" y="5" width="40" height="28" rx="5" fill="#ea580c"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                  />
                  <rect x="20" y="0" width="24" height="10" rx="3" fill="#fb923c" />
                  <rect x="16" y="55" width="32" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="16" y="65" width="32" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="16" y="75" width="22" height="4" rx="2" fill="white" opacity="0.7" />
                  <text x="32" y="120" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                    SUPREME
                  </text>
                </g>

                {/* Product Bottle 4 - Green */}
                <g transform="translate(340, 180)">
                  <motion.rect x="10" y="30" width="52" height="100" rx="12" fill="#22c55e"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                  <motion.rect x="15" y="5" width="40" height="28" rx="5" fill="#16a34a"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                  <rect x="22" y="0" width="26" height="10" rx="3" fill="#4ade80" />
                  <rect x="18" y="55" width="36" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="18" y="65" width="36" height="4" rx="2" fill="white" opacity="0.7" />
                  <rect x="18" y="75" width="24" height="4" rx="2" fill="white" opacity="0.7" />
                  <text x="36" y="105" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                    FABRIX
                  </text>
                </g>

                {/* Sparkle decorations - pulsing */}
                {[
                  { cx: 120, cy: 100, r: 4, dur: 3, del: 0 },
                  { cx: 420, cy: 200, r: 5, dur: 4, del: 0.5 },
                  { cx: 350, cy: 80, r: 3, dur: 3.5, del: 1 },
                  { cx: 100, cy: 350, r: 4, dur: 4.5, del: 2 },
                ].map((s, i) => (
                  <motion.circle
                    key={i}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.del }}
                    cx={s.cx} cy={s.cy} r={s.r} fill="#f59e0b"
                  />
                ))}

                {/* Small plant decoration */}
                <g transform="translate(30, 380)">
                  <motion.rect x="8" y="30" width="24" height="30" rx="4" fill="#8B5CF6"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle cx="20" cy="25" r="15" fill="#22c55e"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle cx="10" cy="15" r="10" fill="#16a34a"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  <motion.circle cx="30" cy="15" r="10" fill="#16a34a"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />
                </g>

                {/* Spray bottle decoration */}
                <g transform="translate(400, 380)">
                  <motion.rect x="5" y="25" width="30" height="50" rx="8" fill="#06b6d4"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                  <motion.rect x="12" y="0" width="16" height="28" rx="4" fill="#0891b2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                  <rect x="17" y="-5" width="6" height="8" rx="2" fill="#22d3ee" />
                  <rect x="10" y="40" width="20" height="3" rx="1.5" fill="white" opacity="0.5" />
                  <rect x="10" y="48" width="20" height="3" rx="1.5" fill="white" opacity="0.5" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}