"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-[72px] md:py-[88px] bg-[#f8fafc]">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-[20px] p-6 md:p-7 shadow-sm border border-slate-100 flex flex-col"
            >
              {/* Quote */}
              <div className="mb-5">
                <svg
                  className="w-8 h-8 text-blue-200 mb-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 14.928 3 13.5c0-3.5 2.5-6 6-6 .5 0 1 .1 1.5.3C11.5 6 13.5 5 15 5c3.5 0 6 2.5 6 6 0 2-.5 3.8-1.5 5.2-.5.5-1 1-1.5 1.5.5-1.5.5-2.5.5-3.5 0-1.5-1-2-2-2-.5 0-1 .2-1.5.5-1 1-1 3 0 4.5 1 1.5 3 2 5 2v1.5c0 .5-.5 1-1 1-2 0-4-1.5-6.5-4-.5 0-1-.2-1.5-.5z" />
                </svg>
                <p className="text-[14px] text-[#475569] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-[13px] font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0f172a]">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-[#64748b]">{t.role}</p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mt-3">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <svg
                      key={si}
                      className="w-4 h-4 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
