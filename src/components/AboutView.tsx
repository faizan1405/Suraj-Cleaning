"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Award, Sparkles, ShieldCheck, Lightbulb, Handshake, TrendingUp } from "lucide-react";
import type { CompanyInfo } from "@/data/company";

function AnimatedCounter({
  target,
  suffix = "+",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = (el: HTMLSpanElement | null) => {
    if (!el) return;
    const duration = 1800;
    const startTime = performance.now();
    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(eased * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  };

  return <span ref={ref} />;
}

const welcomeHeadingWords = ["Swaraj", "Enterprises"];

const coreValues = [
  {
    icon: Award,
    title: "Quality in Every Product",
    desc: "Every product is carefully developed to deliver consistent performance.",
  },
  {
    icon: ShieldCheck,
    title: "Customer First Approach",
    desc: "Customer satisfaction is at the heart of everything we do.",
  },
  {
    icon: Sparkles,
    title: "Integrity & Transparency",
    desc: "Honest pricing, transparent dealings, and genuine products always.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Continuous Improvement",
    desc: "We constantly refine our formulations for better results.",
  },
  {
    icon: Handshake,
    title: "Reliability & Trust",
    desc: "Building lasting relationships with customers and partners.",
  },
  {
    icon: TrendingUp,
    title: "Sustainable Growth",
    desc: "Growing responsibly to create long-term value for everyone.",
  },
];

export default function AboutView({
  company,
  productCount,
}: {
  company: CompanyInfo;
  productCount: number;
}) {
  const stats = [
    { label: "Happy Customers", value: company.stats.customers },
    { label: "Distributors", value: company.stats.distributors },
    { label: "Products", value: productCount || company.stats.products },
    { label: "Years of Trust", value: company.stats.years },
  ];

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
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] md:text-[16px] text-[#64748b] max-w-lg mx-auto"
          >
            {company.description}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-4"
          />
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              ABOUT US
            </span>
            <h2 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] mb-6 overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ staggerChildren: 0.05, delayChildren: 0.1, duration: 0.6 }}
              >
                {welcomeHeadingWords.map((word, i) => (
                  <span key={i} className="inline-block mr-[0.25em]">{word}</span>
                ))}
              </motion.span>
            </h2>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#0f172a] mb-6">
              Welcome to Swaraj Enterprises
            </h3>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              At Swaraj Enterprises, we are committed to delivering high-quality, reliable,
              and affordable home care and cleaning solutions that make everyday life
              cleaner, safer, and more hygienic.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              The name &ldquo;Swaraj&rdquo; is inspired by the combination of Swathi and Sooraj,
              reflecting the vision, dedication, and values behind our journey. Swathi Sooraj, the
              founder of Swaraj Enterprises, established the company with a mission to
              provide trusted products that meet the highest standards of quality and
              customer satisfaction.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              Our product range includes floor cleaners, toilet cleaners, dish wash liquid,
              hand wash, glass cleaner, fabric care products, detergents, car care
              solutions, pooja deepam oil, and other household essentials. Every product
              is carefully developed using quality ingredients to deliver effective
              performance while offering excellent value for money.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed">
              We believe that quality, honesty, and customer satisfaction are the
              foundation of long-term success. By continuously improving our products and
              embracing innovation, we strive to become a trusted household brand across
              India. Whether you are a homeowner, retailer, wholesaler, distributor, or
              institutional buyer, Swaraj Enterprises is dedicated to providing dependable
              products, timely service, and lasting business relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              OUR PURPOSE
            </span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a]">
              Mission &amp; Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#0f172a] mb-3">Our Mission</h3>
              <p className="text-[15px] text-[#64748b] leading-relaxed">
                To manufacture and supply premium-quality cleaning and household products
                that enhance everyday living through innovation, affordability, and
                uncompromising quality.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#0f172a] mb-3">Our Vision</h3>
              <p className="text-[15px] text-[#64748b] leading-relaxed">
                To become one of India&apos;s most trusted and preferred brands in the home
                care and cleaning products industry by delivering excellence, building
                strong customer relationships, and creating sustainable value for society.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              OUR STORY
            </span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-6">
              Our Story
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              Every successful brand begins with a dream, and Swaraj Enterprises is no
              exception.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              The name &ldquo;Swaraj&rdquo; is a meaningful combination of Swathi and Sooraj,
              symbolizing the shared vision, dedication, and values that inspired this
              journey. Founded by Swathi Sooraj, Swaraj Enterprises was established with a simple
              yet powerful mission&mdash;to manufacture high-quality, affordable, and
              reliable household and cleaning products that people can trust every day.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              What started as a vision has grown into a brand committed to improving
              everyday life through effective cleaning and home care solutions. Every
              product is carefully developed with a focus on quality, safety,
              performance, and value, ensuring customers receive products they can
              depend on.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              At Swaraj Enterprises, we believe that trust is earned through consistency.
              From sourcing quality ingredients to maintaining high manufacturing
              standards and delivering excellent customer service, we strive for
              excellence in everything we do.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              Today, our growing range of products includes floor cleaners, toilet
              cleaners, dish wash liquids, hand wash, glass cleaners, fabric care
              products, detergents, car care solutions, pooja deepam oil, and other
              household essentials. We are proud to serve homes, retailers, wholesalers,
              distributors, and businesses with products that deliver outstanding
              results.
            </p>
            <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
              As we continue to grow, our commitment remains unchanged&mdash;to build a
              trusted Indian brand known for quality, innovation, integrity, and
              customer satisfaction. Every bottle we manufacture carries our promise of
              excellence and our passion for creating a cleaner, healthier, and happier
              tomorrow.
            </p>
            <p className="text-[16px] md:text-[18px] font-semibold text-[#0f172a] leading-relaxed">
              Swaraj Enterprises &ndash; Cleaning with Quality. Growing with Trust.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Founder */}
      <section className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              MEET OUR FOUNDER
            </span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a]">
              The Vision Behind the Brand
            </h2>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto"
            >
              <div className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                <Image
                  src="/images/founder-swathi.jpg"
                  alt="Swathi Sooraj - Founder & Managing Director of Swaraj Enterprises"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 260px, 300px"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-blue-100/60 rounded-full blur-xl -z-10 soft-pulse" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h3 className="text-[26px] md:text-[32px] font-bold text-[#0f172a] mb-1">
                Swathi Sooraj
              </h3>
              <p className="text-[15px] font-semibold text-[#2563eb] mb-1">
                Founder &amp; Managing Director
              </p>
              <p className="text-[13px] text-[#64748b] mb-5">
                MBA (Finance)
              </p>
              <p className="text-[15px] text-[#64748b] leading-relaxed mb-4">
                Swathi Sooraj is the visionary founder of Swaraj Enterprises and holds a Master
                of Business Administration (MBA) in Finance. With a strong foundation in
                finance and business management, she established Swaraj Enterprises with
                a vision to manufacture high-quality, reliable, and affordable household
                and cleaning products for every home.
              </p>
              <p className="text-[15px] text-[#64748b] leading-relaxed mb-4">
                Her leadership is driven by innovation, quality, integrity, and customer
                satisfaction. She believes that every product should deliver exceptional
                performance while building long-term trust with customers and business
                partners.
              </p>
              <p className="text-[15px] text-[#64748b] leading-relaxed mb-5">
                Under her guidance, Swaraj Enterprises continues to expand its product
                portfolio and distributor network with the goal of becoming one of
                India&apos;s most trusted home care and cleaning brands.
              </p>
              <blockquote className="relative pl-5 border-l-4 border-[#2563eb] italic text-[15px] text-[#0f172a] font-medium">
                &ldquo;Our commitment is simple &ndash; Quality you can trust, every single
                day.&rdquo;
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              OUR CORE VALUES
            </span>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a]">
              What Drives Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-[#f8fafc] rounded-[20px] p-6 border border-slate-100 shadow-sm card-lift"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">
                    {val.title}
                  </h3>
                  <p className="text-[13px] text-[#64748b] leading-relaxed">
                    {val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 shadow-sm pop-in"
              >
                <p className="text-[28px] md:text-[32px] font-bold text-[#2563eb] leading-none mb-1">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="text-[12px] text-[#64748b] font-medium mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.a
              href="/products"
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white font-semibold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 btn-shine"
            >
              Explore Our Products
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}