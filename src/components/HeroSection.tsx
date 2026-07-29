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
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
    >
      {/* Background image — full-width, edge-to-edge */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-products.jpg"
          alt="Swaraj Cleaning Products"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full mx-auto max-w-[1260px] px-5 md:px-8 py-20 lg:py-0">
        <div className="max-w-2xl">
          {/* Eyebrow badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase rounded-full mb-6 border border-white/25"
          >
            Premium Cleaning Solutions
          </motion.span>

          {/* Heading with word reveal */}
          <div className="mb-5 overflow-hidden">
            <motion.h1
              className="text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[60px] font-bold leading-[1.08] text-white drop-shadow-lg"
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
                <span className="text-blue-300">Happy</span> Lives
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle reveal */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-[15px] md:text-[16px] text-white/85 mb-7 max-w-md drop-shadow"
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
                whileHover={{ scale: 1.08, backgroundColor: "rgba(37, 99, 235, 0.5)" }}
                className="group flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-3.5 py-2 rounded-full"
              >
                <f.icon className="w-4 h-4 text-white icon-pop" strokeWidth={2.5} />
                <span className="text-[13px] font-medium text-white whitespace-nowrap">
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
        </div>
      </div>
    </section>
  );
}
