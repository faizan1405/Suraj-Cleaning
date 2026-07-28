"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/product-types";
import { ProductImage } from "@/components/products/ProductImage";
import { useCart } from "@/contexts/CartContext";

function ProductCard({
  product,
  index,
  onViewDetails,
}: {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="bg-white border border-slate-100 rounded-[20px] overflow-hidden card-lift flex flex-col"
    >
      <div className="relative aspect-square bg-[#f8fafc] overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="object-contain p-4 img-zoom"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-0.5">
          {product.name}
        </h3>
        <p className="text-[12px] text-[#64748b] mb-1">{product.category}</p>
        <p className="text-[12px] text-[#94a3b8] mb-3">{product.sizes?.[0] ?? "Standard"}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[18px] font-bold text-[#2563eb]">
            ₹{typeof product.price === "number" ? product.price : Number(product.price) || 0}
          </span>
          <button
            onClick={() => onViewDetails(product)}
            className="text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5 arrow-nudge" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const directions = Array.isArray(product.directions) ? product.directions : [];
  const productImage = product.image && product.image.trim() ? product.image : "/images/product-placeholder.png";
  const numericPrice = typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const [modalAdded, setModalAdded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white rounded-[24px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-[#f8fafc] p-6">
            <ProductImage
              src={productImage}
              alt={product.name}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="p-6 md:p-8">
            {product.badge && (
              <span className="inline-block bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#2563eb] uppercase">
              {product.category}
            </span>
            <h3 className="text-[24px] font-bold text-[#0f172a] mt-1 mb-2">
              {product.name}
            </h3>
            <p className="text-[14px] text-[#64748b] mb-4">
              {product.shortDescription}
            </p>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-[28px] font-bold text-[#2563eb]">
                ₹{numericPrice}
              </span>
              <span className="text-[13px] text-[#94a3b8]">
                / {product.sizes?.[0] ?? "Standard"}
              </span>
            </div>

            <div className="mb-5">
              <h4 className="text-[13px] font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                Key Benefits
              </h4>
              <ul className="space-y-1.5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <span className="text-green-500 mt-0.5 shrink-0">✔</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-[13px] font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                How to Use
              </h4>
              <ol className="space-y-1">
                {directions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <span className="text-[#2563eb] font-bold shrink-0">{i + 1}.</span>
                    {d}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => {
                if (modalAdded) return;
                setModalAdded(true);
                setTimeout(() => setModalAdded(false), 2000);
              }}
              className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-full hover:bg-[#1d4ed8] transition-colors"
            >
              {modalAdded ? "Added!" : `Add to Cart · ₹${numericPrice}`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ComboProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-combo-card]");
    const cardWidth = card ? (card as HTMLElement).offsetWidth + 20 : 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    fetch("/api/admin/data/products", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : [])
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const comboProducts = products.filter(
    (p) => p.active && p.badge && p.badge.toLowerCase().includes("combo")
  );

  const headingWords = "COMBO OFFERS".split(" ");

  if (loading) {
    return (
      <section id="combo" className="py-[72px] md:py-[88px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight">
              COMBO OFFERS
            </h2>
            <div className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[20px] overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-6 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (comboProducts.length === 0) {
    return null;
  }

  return (
    <section id="combo" className="py-[72px] md:py-[88px] bg-[#f8fafc]">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <motion.h2
            className="text-[28px] md:text-[34px] font-bold text-[#0f172a] tracking-tight flex flex-wrap justify-center gap-x-[0.25em] overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ staggerChildren: 0.04, delayChildren: 0.1 }}
          >
            {headingWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    show: { y: "0%", opacity: 1 },
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-3"
          />
          <p className="text-[14px] text-[#64748b] mt-3 max-w-lg mx-auto">
            Grab these exclusive combo deals and save more on your favorite products.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {comboProducts.map((product, i) => (
              <div
                key={product.id}
                data-combo-card
                className="snap-start shrink-0 w-[280px] sm:w-[300px] lg:w-[340px]"
              >
                <ProductCard product={product} index={i} onViewDetails={setSelectedProduct} />
              </div>
            ))}
          </div>

          {comboProducts.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-[40%] -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-[#334155]" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-[40%] -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-[#334155]" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="/products"
            className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px] hover:gap-3 transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
