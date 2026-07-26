"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Award,
  DollarSign,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const items = [
  { icon: Truck, label: "Fast & Safe Delivery" },
  { icon: Award, label: "Premium Quality" },
  { icon: DollarSign, label: "Affordable Prices" },
  { icon: ShieldCheck, label: "Secure Packaging" },
  { icon: Headphones, label: "24/7 Customer Support" },
];

export default function TrustBenefits() {
  return (
    <section id="benefits" className="py-[52px] md:py-[64px] bg-white border-y border-slate-50">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                <item.icon className="w-6 h-6 text-[#2563eb]" strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-semibold text-[#334155] leading-tight">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
