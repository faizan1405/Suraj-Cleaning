"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const benefits = [
  "Attractive Profit Margin",
  "Regular Offers & Schemes",
  "Product Training Support",
  "Dedicated Relationship Manager",
];

export default function DistributorSection() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="distributor" className="py-[72px] md:py-[88px]">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="bg-[#2563eb] rounded-[28px] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-8 md:p-12 lg:p-14">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
                GROW WITH SWARAJ
              </span>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-3">
                Become a Distributor
              </h2>
              <p className="text-white/80 text-[15px] mb-8">
                Low Investment | High Margin | Marketing Support | Fast Delivery
              </p>

              <ul className="space-y-3 mb-8">
                {benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-3 text-white text-[14px]"
                  >
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                    {b}
                  </motion.li>
                ))}
              </ul>

              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#2563eb] font-bold text-[15px] rounded-full hover:bg-blue-50 transition-colors shadow-lg"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Right - Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex items-center justify-center"
            >
              <svg
                viewBox="0 0 400 350"
                className="w-full max-w-[400px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Business growth illustration */}
                <rect x="80" y="100" width="240" height="160" rx="16" fill="white" opacity="0.15" />
                <rect x="100" y="120" width="200" height="120" rx="12" fill="white" opacity="0.1" />

                {/* Handshake / Business */}
                <circle cx="200" cy="160" r="30" fill="white" opacity="0.2" />
                <path d="M185 165 Q200 175 215 165" stroke="white" strokeWidth="3" fill="none" opacity="0.5" />
                <circle cx="190" cy="155" r="3" fill="white" opacity="0.5" />
                <circle cx="210" cy="155" r="3" fill="white" opacity="0.5" />

                {/* Chart growth */}
                <polyline
                  points="120,240 160,220 200,190 240,200 280,150"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="280" cy="150" r="5" fill="#f59e0b" />
                <circle cx="200" cy="190" r="4" fill="#fbbf24" opacity="0.7" />

                {/* Upward arrows */}
                <path d="M260 100 L270 85 L280 100" stroke="white" strokeWidth="2" fill="none" opacity="0.4" />
                <path d="M130 110 L140 95 L150 110" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />

                {/* Stars */}
                <text x="310" y="80" fill="white" fontSize="18" opacity="0.3">★</text>
                <text x="70" y="130" fill="white" fontSize="14" opacity="0.3">★</text>

                {/* Bottom bar */}
                <rect x="120" y="260" width="160" height="8" rx="4" fill="white" opacity="0.15" />
                <rect x="140" y="270" width="120" height="6" rx="3" fill="white" opacity="0.1" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Distributor Form Modal */}
      {formOpen && (
        <DistributorFormModal onClose={() => setFormOpen(false)} />
      )}
    </section>
  );
}

function DistributorFormModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-[24px] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[22px] font-bold text-[#0f172a]">
              Distributor Application
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close form"
            >
              <svg className="w-5 h-5 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form action="#" method="POST" className="space-y-4">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-[13px] font-medium text-[#334155] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                />
              </div>
              <div>
                <label htmlFor="businessName" className="block text-[13px] font-medium text-[#334155] mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile" className="block text-[13px] font-medium text-[#334155] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  placeholder="+91 98447 34939"
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-[#334155] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-[13px] font-medium text-[#334155] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-[13px] font-medium text-[#334155] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessType" className="block text-[13px] font-medium text-[#334155] mb-1">
                  Current Business Type
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all bg-white"
                >
                  <option value="">Select</option>
                  <option value="retail">Retail Shop</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="distributor">Distributor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="investment" className="block text-[13px] font-medium text-[#334155] mb-1">
                  Investment Range
                </label>
                <select
                  id="investment"
                  name="investment"
                  className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all bg-white"
                >
                  <option value="">Select</option>
                  <option value="1-5">₹1 Lakh - ₹5 Lakhs</option>
                  <option value="5-10">₹5 Lakhs - ₹10 Lakhs</option>
                  <option value="10-25">₹10 Lakhs - ₹25 Lakhs</option>
                  <option value="25+">₹25 Lakhs+</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-[13px] font-medium text-[#334155] mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="w-full px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all resize-none"
              />
            </div>

            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 w-4 h-4 text-[#2563eb] border-slate-300 rounded focus:ring-[#2563eb]"
              />
              <span className="text-[12px] text-[#64748b] leading-relaxed">
                I agree to be contacted by Swaraj Enterprises regarding my
                distributor enquiry.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
            >
              Submit Application
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
