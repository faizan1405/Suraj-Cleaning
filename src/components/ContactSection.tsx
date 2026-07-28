"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { CompanyInfo } from "@/data/company";

function MapEmbed({ address }: { address: string }) {
  const [loaded, setLoaded] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  // Safety timeout: force-show the map after 5 seconds even if onLoad hasn't fired
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) {
        setTimeoutReached(true);
        setLoaded(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-[350px] md:h-[450px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100"
    >
      {/* Loading indicator — shown until map is loaded */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-[24px] flex items-center justify-center z-10">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-[13px] text-slate-400">Loading map...</p>
          </div>
        </div>
      )}
      {/* iframe is always in the DOM but hidden via pointer-events + visibility until loaded */}
      {!loaded ? (
        <iframe
          title="Our Location"
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0, position: "absolute", inset: 0, visibility: "hidden", pointerEvents: "none" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className="rounded-[24px]"
        />
      ) : (
        <iframe
          title="Our Location"
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-[24px]"
        />
      )}
    </motion.div>
  );
}

export default function ContactSection() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/data/company", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setCompany(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const form = e.currentTarget;

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      "contact-website": formData.get("contact-website"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const result = await res.json().catch(() => ({ message: "Something went wrong" }));
        setStatus("error");
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }

    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 4000);
  };

  if (!company) {
    return (
      <section id="contact" className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-100 rounded w-48 mx-auto" />
            <div className="h-4 bg-slate-100 rounded w-96 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  const headingText = "Get in Touch";

  return (
    <section id="contact" className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4"
            >
              CONTACT US
            </motion.span>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#0f172a] mb-4">
              {headingText.split(" ").map((word, i, arr) => (
                <span key={i} className="inline-block whitespace-nowrap">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                  {i < arr.length - 1 ? (
                    <span className="inline-block w-[0.3em]"></span>
                  ) : (
                    ""
                  )}
                </span>
              ))}
            </h2>
            <p className="text-[15px] text-[#64748b] leading-relaxed mb-8">
              Have questions about our products or want to become a distributor?
              We&apos;d love to hear from you. Reach out and we&apos;ll get
              back to you within 24 hours.
            </p>

            <div className="space-y-4">
              <motion.a
                whileHover={{ x: 4 }}
                href="https://maps.google.com/?q=Swaraj+Enterprises+Narikombu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <MapPin className="w-5 h-5 text-[#2563eb] icon-pop" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Our Address
                  </p>
                  <p className="text-[13px] text-[#64748b]">
                    {company.address}
                  </p>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ x: 4 }}
                href={`tel:${company.phoneRaw}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Phone className="w-5 h-5 text-[#2563eb] icon-pop" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Phone
                  </p>
                  <p className="text-[13px] text-[#64748b]">{company.phone}</p>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ x: 4 }}
                href={`mailto:${company.email}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5 text-[#2563eb] icon-pop" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Email
                  </p>
                  <p className="text-[13px] text-[#64748b]">{company.email}</p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#2563eb] icon-pop" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0f172a]">
                    Working Hours
                  </p>
                  <p className="text-[13px] text-[#64748b]">{company.hours}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-slate-50 rounded-[24px] p-6 md:p-8"
            >
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-[18px] font-bold text-[#0f172a] mb-5"
              >
                Send us a Message
              </motion.h3>

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

                <motion.button
                  whileHover={{ y: -3 }}
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2 btn-shine"
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
                </motion.button>

                {status === "success" && (
                  <p className="text-green-600 text-[13px] text-center">
                    Thank you! We&apos;ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-[13px] text-center">
                    {errorMessage}
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        {company && (
          <div className="mt-12 md:mt-16">
            <MapEmbed address={company.address} />
          </div>
        )}
      </div>
    </section>
  );
}
