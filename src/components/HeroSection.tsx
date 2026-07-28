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
                href="/products"
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

          {/* Right side - hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ borderRadius: 24, padding: 0, background: 'none', overflow: 'hidden' }}
            >
              <img
                src="/images/1 her.jpeg"
                alt="Swaraj Cleaning Products - Lavender Air Freshener, Hygix, Florenta, Handpure, Dishsheen, Clearon, Fabrix, Laundryx, Blackguard"
                className="w-full h-auto max-h-[480px] object-contain rounded-[20px]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
