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

export default function DistributorView() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      {/* Page Header */}
      <section className="pt-[120px] pb-[40px] md:pt-[140px] md:pb-[50px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[44px] font-bold text-[#0f172a] mb-3"
          >
            Become a Distributor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] md:text-[16px] text-[#64748b] max-w-lg mx-auto"
          >
            Join our growing network of distributors and grow your business with
            Swaraj Enterprises.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-4"
          />
        </div>
      </section>

      {/* Distributor Content */}
      <section className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="bg-[#2563eb] rounded-[28px] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-8 md:p-12 lg:p-14">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block px-4 py-1.5 bg-white/15 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4"
                >
                  GROW WITH SWARAJ
                </motion.span>
                <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-3">
                  Low Investment | High Margin | Marketing Support | Fast Delivery
                </h2>
                <p className="text-white/80 text-[15px] mb-8">
                  Become a distributor of Swaraj Enterprises premium cleaning products
                  and enjoy attractive margins with full marketing and operational
                  support.
                </p>

                <ul className="space-y-3 mb-8">
                  {benefits.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 text-white text-[14px]"
                    >
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      {b}
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ y: -3 }}
                  onClick={() => setFormOpen(true)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#2563eb] font-bold text-[15px] rounded-full hover:bg-blue-50 transition-colors shadow-lg btn-shine"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Right side - Image / Info cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-center gap-5"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-6">
                  <h3 className="text-white font-bold text-[18px] mb-4">Why Choose Us?</h3>
                  <div className="space-y-3">
                    {[
                      { num: "01", text: "Proven Product Range" },
                      { num: "02", text: "Competitive Pricing" },
                      { num: "03", text: "Marketing Materials" },
                      { num: "04", text: "Regular Training" },
                    ].map((item) => (
                      <div key={item.num} className="flex items-center gap-3">
                        <span className="text-[#fbbf24] font-bold text-[14px]">
                          {item.num}
                        </span>
                        <span className="text-white/90 text-[14px]">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-6">
                  <p className="text-white/70 text-[13px] leading-relaxed">
                    Ready to start your journey? Fill out our distributor application
                    form and our team will get back to you within 48 hours with all
                    the details you need.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Modal */}
      {formOpen && <DistributorFormModal onClose={() => setFormOpen(false)} />}
    </div>
  );
}

function DistributorFormModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      businessName: formData.get("businessName"),
      mobile: formData.get("mobile"),
      email: formData.get("email"),
      city: formData.get("city"),
      state: formData.get("state"),
      businessType: formData.get("businessType"),
      investment: formData.get("investment"),
      message: formData.get("message"),
      consent: formData.get("consent"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch("/api/distributor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 2000);
      } else {
        const result = await res.json().catch(() => ({ message: "Something went wrong" }));
        setStatus("error");
        setErrorMessage(result.message || "Please check your details and try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

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
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close form"
            >
              <svg className="w-5 h-5 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <option value="1-5">₹1 - ₹5 Lakhs</option>
                  <option value="5-10">₹5 - ₹10 Lakhs</option>
                  <option value="10-25">₹10 - ₹25 Lakhs</option>
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

            {status === "error" && (
              <p className="text-red-500 text-[13px] text-center -mt-1">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full py-3 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 disabled:opacity-60"
            >
              {status === "loading"
                ? "Submitting..."
                : status === "success"
                ? "Application Submitted!"
                : "Submit Application"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
