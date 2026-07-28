"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";

// Hardcoded fallback values — static support links
const phoneRaw = "919844734939";
const email = "swarajenterprises.co@gmail.com";
const supportWhatsAppMessage = "Hi, I need support with my order.";

export default function FloatingContactActions() {
  return (
    <>
      {/* Desktop - Floating stack */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col gap-2.5">
        {/* WhatsApp */}
        <motion.a
          href={`https://wa.me/${phoneRaw}?text=${encodeURIComponent("Hi, I need support with my order.")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="group flex items-center gap-2.5 bg-green-500 text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg btn-shine"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ x: -6, scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold whitespace-nowrap arrow-nudge">
            WhatsApp
          </span>
        </motion.a>

        {/* Call */}
        <motion.a
          href={`tel:${phoneRaw}`}
          aria-label="Call Now"
          className="group flex items-center gap-2.5 bg-[#2563eb] text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg btn-shine"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ x: -6, scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <Phone className="w-4 h-4 text-[#2563eb]" />
          </div>
          <span className="text-[13px] font-semibold whitespace-nowrap arrow-nudge">
            +91 98447 34939
          </span>
        </motion.a>

        {/* Email */}
        <motion.a
          href={`mailto:${email}`}
          aria-label="Email Us"
          className="group flex items-center gap-2.5 bg-white text-[#2563eb] border border-slate-200 pl-3 pr-4 py-2.5 rounded-full shadow-lg btn-shine"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ x: -6, scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
            <Mail className="w-4 h-4 text-[#2563eb]" />
          </div>
          <span className="text-[13px] font-semibold whitespace-nowrap arrow-nudge">
            Email Us
          </span>
        </motion.a>
      </div>

      {/* Mobile - Sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around py-2.5 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {[
            {
              href: `https://wa.me/${phoneRaw}?text=${encodeURIComponent("Hi, I need support with my order.")}`,
              icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
              label: "WhatsApp",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              href: `tel:${phoneRaw}`,
              icon: <Phone className="w-5 h-5 text-[#2563eb]" />,
              label: "Call",
              color: "text-[#2563eb]",
              bg: "bg-blue-50",
            },
            {
              href: `mailto:${email}`,
              icon: <Mail className="w-5 h-5 text-[#2563eb]" />,
              label: "Email",
              color: "text-[#2563eb]",
              bg: "bg-blue-50",
            },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${item.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              whileTap={{ scale: 0.85 }}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center transition-colors`}
              >
                {item.icon}
              </motion.div>
              <span className="text-[11px] font-medium">{item.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </>
  );
}