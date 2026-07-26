"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import { company } from "@/data/company";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id="contact" className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              CONTACT US
            </span>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#0f172a] mb-4">
              Get in Touch
            </h2>
            <p className="text-[15px] text-[#64748b] leading-relaxed mb-8">
              Have questions about our products or want to become a distributor?
              We&apos;d love to hear from you. Reach out and we&apos;ll get
              back to you within 24 hours.
            </p>

            <div className="space-y-4">
              <a
                href="https://maps.google.com/?q=Bantwala,Dakshina+Kannada,Karnataka,India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <MapPin className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Our Address
                  </p>
                  <p className="text-[13px] text-[#64748b]">
                    {company.address}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${company.phoneRaw}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Phone className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Phone
                  </p>
                  <p className="text-[13px] text-[#64748b]">{company.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${company.email}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Email
                  </p>
                  <p className="text-[13px] text-[#64748b]">{company.email}</p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Working Hours
                  </p>
                  <p className="text-[13px] text-[#64748b]">{company.hours}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-slate-50 rounded-[24px] p-6 md:p-8"
            >
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-5">
                Send us a Message
              </h3>

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  type="text"
                  id="contact-website"
                  name="contact-website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="c-name" className="block text-[13px] font-medium text-[#334155] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="c-name"
                    name="name"
                    required
                    className="w-full px-4 py-2.5 text-[14px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-email" className="block text-[13px] font-medium text-[#334155] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="c-email"
                      name="email"
                      required
                      className="w-full px-4 py-2.5 text-[14px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className="block text-[13px] font-medium text-[#334155] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="c-phone"
                      name="phone"
                      required
                      placeholder="+91 98447 34939"
                      className="w-full px-4 py-2.5 text-[14px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-message" className="block text-[13px] font-medium text-[#334155] mb-1">
                    Message *
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-2.5 text-[14px] bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : status === "success" ? (
                    "Message Sent!"
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                {status === "success" && (
                  <p className="text-green-600 text-[13px] text-center">
                    Thank you! We&apos;ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-[13px] text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
