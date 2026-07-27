"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { QualityStep } from "@/data/qualityProcess";
import Image from "next/image";

export default function QualityProcess() {
  const [steps, setSteps] = useState<QualityStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/data/qualityProcess", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setSteps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
              OUR QUALITY PROCESS
            </h2>
            <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
          </div>
          <div className="hidden md:flex justify-between gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center text-center animate-pulse">
                <div className="w-16 h-16 bg-slate-100 rounded-full mb-4" />
                <div className="h-4 bg-slate-100 rounded w-24 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
            OUR QUALITY PROCESS
          </h2>
          <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
        </div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <div className="absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-[3px] bg-blue-100 rounded-full" />
          {/* Progress line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 left-[10%] -translate-y-1/2 h-[3px] bg-[#2563eb] rounded-full origin-left"
            style={{ width: "80%" }}
          />

          <div className="relative grid grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div className="relative mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ ease: [0.22, 1, 0.36, 1] }}
                    className="w-16 h-16 bg-white border-2 border-[#2563eb] rounded-full flex items-center justify-center shadow-md z-10 relative"
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  </motion.div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#2563eb] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                </div>
                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[13px] md:text-[14px] font-bold text-[#0f172a] mb-1 leading-tight"
                >
                  {step.title}
                </motion.h3>
                <p className="text-[11px] text-[#64748b] leading-relaxed max-w-[140px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ ease: [0.22, 1, 0.36, 1] }}
                  className="w-12 h-12 bg-blue-50 border-2 border-[#2563eb] rounded-full flex items-center justify-center shrink-0"
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={36}
                    height={36}
                    className="object-cover rounded-full"
                  />
                </motion.div>
                <div className="w-[2px] flex-1 bg-blue-100 mt-2" />
              </div>
              <div className="pb-6">
                <span className="inline-block px-2 py-0.5 bg-[#2563eb] text-white text-[10px] font-bold rounded-full mb-1.5">
                  Step {step.stepNumber}
                </span>
                <motion.h3
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[14px] font-bold text-[#0f172a] mb-1"
                >
                  {step.title}
                </motion.h3>
                <p className="text-[12px] text-[#64748b] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
