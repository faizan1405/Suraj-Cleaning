"use client";

import { motion } from "framer-motion";

export default function ProductsPageHeader() {
  return (
    <section className="pt-[120px] pb-[40px] md:pt-[140px] md:pb-[50px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[32px] md:text-[44px] font-bold text-[#0f172a] mb-3"
        >
          Our Products
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[15px] md:text-[16px] text-[#64748b] max-w-lg mx-auto"
        >
          Discover our range of premium cleaning solutions for every need.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-4"
        />
      </div>
    </section>
  );
}