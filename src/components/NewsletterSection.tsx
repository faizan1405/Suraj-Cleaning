"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 4000);
  };

  const headingText = "Stay Updated with Offers & New Launches";

  return (
    <section className="py-[72px] md:py-[88px] bg-[#2563eb]">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-[24px] md:text-[30px] font-bold text-white mb-3">
            {headingText.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {word}{i < headingText.split(" ").length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h2>
          <p className="text-white/75 text-[15px] mb-8">
            Subscribe to our newsletter and never miss an update.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === "loading" || status === "success"}
                className="w-full pl-11 pr-4 py-3.5 text-[14px] bg-white rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white/30 text-[#0f172a] placeholder:text-slate-400 disabled:opacity-60"
              />
            </div>
            <motion.button
              whileHover={{ y: -3 }}
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0f172a] text-white font-bold text-[14px] rounded-full hover:bg-[#1e293b] transition-colors disabled:opacity-60 shrink-0 btn-shine"
            >
              {status === "loading" ? (
                "Subscribing..."
              ) : status === "success" ? (
                "Subscribed!"
              ) : (
                <>
                  Subscribe <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/90 text-[13px] mt-3"
              >
                Thanks for subscribing! Check your inbox soon.
              </motion.div>
            )}
          </AnimatePresence>

          {status === "error" && (
            <p className="text-red-200 text-[13px] mt-3">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="text-white/50 text-[11px] mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
