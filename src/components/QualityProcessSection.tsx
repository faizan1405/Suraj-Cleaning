"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Carefully Selected Raw Materials",
    description:
      "We source only the finest ingredients, ensuring every product starts with the highest quality raw materials.",
    Icon: () => (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M52 48L28 48" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M34 48L40 62L46 48" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26 24C28 16 36 12 44 12C52 12 58 16 58 24V28H50V24C50 20.4 47.6 18 44 18C40.4 18 38 20.4 38 24V28H26V24Z" fill="#dbeafe" stroke="#6366f1" strokeWidth="2"/>
        <path d="M44 12V8M42 10L44 8L46 10" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 14C30 14 28 18 26 22" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M50 22C52 18 54 16 56 16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    number: "2",
    title: "Advanced Manufacturing",
    description:
      "State-of-the-art manufacturing facilities with precision blending and modern production technology.",
    Icon: () => (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 50C33.4 50 28 44.6 28 38C28 31.4 33.4 26 40 26C46.6 26 52 31.4 52 38C52 44.6 46.6 50 40 50Z" fill="#dbeafe" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="40" cy="38" r="8" stroke="#6366f1" strokeWidth="2"/>
        <path d="M38 22L42 22L42 25L38 25L38 22Z" fill="#6366f1"/>
        <path d="M38 51L42 51L42 54L38 54L38 51Z" fill="#6366f1"/>
        <path d="M38 25V22M40 22L40 25M40 54V51M40 54L42 51" stroke="#6366f1" strokeWidth="1.5"/>
        <path d="M52 38L55 38L55 42L52 42L52 38Z" fill="#6366f1"/>
        <path d="M25 38L28 38L28 42L25 42L25 38Z" fill="#6366f1"/>
        <circle cx="40" cy="38" r="5" fill="#6366f1" opacity="0.3"/>
        <path d="M54.4 26.6L56.6 24.4L59 26.8L56.8 29L54.4 26.6Z" fill="#6366f1"/>
        <path d="M24 51L26.2 53.2L24.4 55.4L22 53L24 51Z" fill="#6366f1"/>
        <path d="M20.4 26.6L22.6 24.4L25 26.8L22.8 29L20.4 26.6Z" fill="#6366f1"/>
        <path d="M59 51L61.2 53.2L59.4 55.4L57 53L59 51Z" fill="#6366f1"/>
        <path d="M52 30L55 27" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M57 49L54 52" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M28 49L25 52" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M23 30L20 27" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "3",
    title: "Strict Quality Testing",
    description:
      "Every batch undergoes rigorous quality testing to ensure it meets our exacting standards.",
    Icon: () => (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="16" fill="#dbeafe" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="32" cy="32" r="12" stroke="#6366f1" strokeWidth="1.5" opacity="0.4"/>
        <path d="M42 42L52 52" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
        <path d="M28 32L31 35L37 29" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 28C30 28 31 25 34 25C37 25 38 28 38 28" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    number: "4",
    title: "Safe & Hygienic Packaging",
    description:
      "Products are packaged in hygienic conditions using premium materials that preserve freshness.",
    Icon: () => (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 34L40 24L60 34V54H20V34Z" fill="#dbeafe" stroke="#6366f1" strokeWidth="2"/>
        <path d="M40 24V54" stroke="#6366f1" strokeWidth="2"/>
        <path d="M20 34H60" stroke="#6366f1" strokeWidth="2"/>
        <path d="M26 34L26 54" stroke="#6366f1" strokeWidth="1.5" opacity="0.3"/>
        <path d="M34 34L34 54" stroke="#6366f1" strokeWidth="1.5" opacity="0.3"/>
        <path d="M46 34L46 54" stroke="#6366f1" strokeWidth="1.5" opacity="0.3"/>
        <path d="M54 34L54 54" stroke="#6366f1" strokeWidth="1.5" opacity="0.3"/>
        <path d="M40 24L28 30" stroke="#6366f1" strokeWidth="1.5" opacity="0.4"/>
        <path d="M40 24L52 30" stroke="#6366f1" strokeWidth="1.5" opacity="0.4"/>
        <path d="M34 28C34 28 34 25 36 25C38 25 38 28 38 28" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M22 56V58C22 59.1 22.9 60 24 60H56C57.1 60 58 59.1 58 58V56" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "5",
    title: "On Time Delivery",
    description:
      "Efficient logistics ensure your orders reach you promptly, every single time.",
    Icon: () => (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 34H28V50H12V34Z" fill="#dbeafe" stroke="#6366f1" strokeWidth="2"/>
        <path d="M32 24H58L64 34V50H32V24Z" fill="#dbeafe" stroke="#6366f1" strokeWidth="2"/>
        <path d="M58 24V34H64L58 24Z" fill="#eef2ff" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="20" cy="52" r="5" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="20" cy="52" r="2" fill="#6366f1"/>
        <circle cx="56" cy="52" r="5" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="56" cy="52" r="2" fill="#6366f1"/>
        <path d="M36 38H42V44H36V38Z" fill="#6366f1" opacity="0.3"/>
        <path d="M46 38H52V44H46V38Z" fill="#6366f1" opacity="0.3"/>
        <path d="M52 20C52 20 54 22 54 24H58" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
];

function QualityProcessSection() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[28px] md:text-[36px] font-extrabold text-slate-900 tracking-tight mb-4"
          >
            OUR QUALITY PROCESS
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-12 h-[4px] rounded-full bg-blue-600"
          />
        </div>

        {/* Desktop: flex layout with connector lines */}
        <div className="hidden md:flex items-start justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Connector line to next step */}
              {index < steps.length - 1 && (
                <div
                  className="absolute h-[3px] bg-blue-600 rounded-full z-0"
                  style={{
                    top: 40,
                    left: "calc(50% + 40px)",
                    right: "calc(-50% + 40px)",
                  }}
                />
              )}

              {/* Icon circle with number badge */}
              <div className="relative z-10">
                <div className="w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-full border-[3px] border-blue-600 flex items-center justify-center bg-white shadow-md">
                  <step.Icon />
                </div>
                {/* Number badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shadow-md border-[2.5px] border-white">
                  {step.number}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[13px] md:text-sm font-extrabold text-slate-900 mt-5 mb-2 leading-snug text-center max-w-[160px]">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed text-center max-w-[190px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: 2-column grid without connectors */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:hidden">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon circle with number badge */}
              <div className="relative mb-3.5">
                <div className="w-[64px] h-[64px] rounded-full border-[3px] border-blue-600 flex items-center justify-center bg-white shadow-md">
                  <step.Icon />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shadow-md border-2 border-white">
                  {step.number}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs font-extrabold text-slate-900 mb-1.5 leading-snug">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[10px] leading-relaxed text-slate-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QualityProcessSection;
