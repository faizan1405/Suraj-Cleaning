"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { navigation } from "@/data/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const socialIcons = [
  {
    name: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    href: "https://www.instagram.com/swaraj_enterprises.co?igsh=MTBkaTFzM24xbjMwMw==",
  },
];

const defaultCategories = [
  { id: "1", slug: "floor-care", name: "Floor Care" },
  { id: "2", slug: "bathroom-care", name: "Bathroom Care" },
  { id: "3", slug: "kitchen-care", name: "Kitchen Care" },
  { id: "4", slug: "laundry-care", name: "Laundry Care" },
  { id: "5", slug: "personal-care", name: "Personal Care" },
];

const defaultCompany = {
  description: "Your trusted partner for premium cleaning solutions. Clean Homes, Happy Lives.",
  address: "Bantwala, Dakshina Kannada, Karnataka, India",
  phone: "+91 98447 34939",
  phoneRaw: "919844734939",
  phone2: "+91 82468 16784",
  phone2Raw: "9188246816784",
  email: "swarajenterprises.co@gmail.com",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
};

export default function Footer() {
  const [categories, setCategories] = useState<{ id: string; slug: string; name: string }[]>(defaultCategories);
  const [company] = useState(defaultCompany);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch("/api/admin/data/categories", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((c: { id: string; slug: string; name: string }) => ({ id: c.id, slug: c.slug, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0f172a] text-white pt-[60px] md:pt-[72px] pb-8">
      <motion.div
        className="mx-auto max-w-[1260px] px-5 md:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Column 1 - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-4">
              <span className="text-[22px] font-bold tracking-tight text-white">
                SWARAJ
              </span>
              <span className="text-[11px] font-semibold tracking-[0.3em] text-blue-400 block -mt-1">
                ENTERPRISES
              </span>
              <p className="mt-2">
                <a href="https://www.instagram.com/swaraj_enterprises.co?igsh=MTBkaTFzM24xbjMwMw==" target="_blank" rel="noopener noreferrer" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Follow us on Instagram →
                </a>
              </p>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[13px] text-slate-400 leading-relaxed mb-5"
            >
              {company.description}
            </motion.p>
            <div className="flex gap-3">
              {socialIcons.map((s, i) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#2563eb] transition-colors"
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  whileHover={{ scale: 1.15, rotate: -8 }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/70" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-[14px] font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                >
                  <a
                    href={item.href}
                    className="text-[13px] text-slate-400 hover:text-white transition-colors relative nav-underline inline-block"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-[14px] font-bold text-white mb-4">Products</h4>
            <ul className="space-y-2.5">
              {categories.map((cat, i) => (
                <motion.li
                  key={cat.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.05 }}
                >
                  <a
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="text-[13px] text-slate-400 hover:text-white transition-colors relative nav-underline inline-block"
                  >
                    {cat.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-[14px] font-bold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3.5">
              {[
                { icon: MapPin, text: company.address, href: "https://share.google/jDEWCaJnqWXhbuuQS" },
                { icon: Phone, text: company.phone, href: `tel:${company.phoneRaw}` },
                ...(company.phone2 ? [{ icon: Phone, text: company.phone2, href: `tel:${company.phone2Raw}` }] : []),
                { icon: Mail, text: company.email, href: `mailto:${company.email}` },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.05 }}
                >
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-2.5 group"
                  >
                    <div className="w-4 h-4 text-blue-400 mt-0.5 shrink-0 icon-pop">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] text-slate-400 leading-relaxed group-hover:text-white transition-colors">
                      {item.text}
                    </span>
                  </a>
                </motion.li>
              ))}
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 icon-pop" />
                <span className="text-[13px] text-slate-400">{company.hours}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-[12px] text-slate-500">
            &copy; {currentYear} Swaraj Enterprises. All Rights Reserved.
          </p>
          <motion.p
            className="text-[12px] text-slate-500"
            whileHover={{ scale: 1.04 }}
          >
            Designed with &lt;3 for a Cleaner Tomorrow
          </motion.p>
        </motion.div>
      </motion.div>
    </footer>
  );
}