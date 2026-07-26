"use client";

import { motion } from "framer-motion";
import { navigation } from "@/data/navigation";
import { company } from "@/data/company";
import { categories } from "@/data/categories";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const socialIcons = [
  {
    name: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    name: "Instagram",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0z",
  },
  {
    name: "Twitter",
    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  },
  {
    name: "YouTube",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white pt-[60px] md:pt-[72px] pb-8">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <div className="mb-4">
              <span className="text-[22px] font-bold tracking-tight text-white">
                SWARAJ
              </span>
              <span className="text-[11px] font-semibold tracking-[0.3em] text-blue-400 block -mt-1">
                ENTERPRISES
              </span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-5">
              {company.description}
            </p>
            <div className="flex gap-3">
              {socialIcons.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#2563eb] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/70" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-[14px] font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[13px] text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Products */}
          <div>
            <h4 className="text-[14px] font-bold text-white mb-4">Products</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#products"
                    className="text-[13px] text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-[14px] font-bold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-[13px] text-slate-400 leading-relaxed">
                  {company.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${company.phoneRaw}`}
                  className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[13px] text-slate-400">
                  {company.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-500">
            &copy; {currentYear} Swaraj Enterprises. All Rights Reserved.
          </p>
          <p className="text-[12px] text-slate-500">
            Designed with &lt;3 for a Cleaner Tomorrow
          </p>
        </div>
      </div>
    </footer>
  );
}
