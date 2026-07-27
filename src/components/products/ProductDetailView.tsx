"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart, Share2 } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductImage } from "./ProductImage";

export default function ProductDetailView({
  product,
  relatedProducts,
  whatsappNumber,
}: {
  product: Product;
  relatedProducts: Product[];
  whatsappNumber: string;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];
  const hasMultiple = gallery.length > 1;

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };
  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${product.name} (₹${product.price}). Can you share more details?`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div>
      {/* Breadcrumb */}
      <section className="pt-[100px] md:pt-[108px] pb-4 bg-white border-b border-slate-50">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#64748b]">
            <Link
              href="/products"
              className="hover:text-[#2563eb] transition-colors"
            >
              Products
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#2563eb] transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#0f172a] font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-[40px] md:py-[60px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-[24px] overflow-hidden aspect-square bg-[#f8fafc]">
                <ProductImage
                  src={gallery[currentImage]}
                  alt={`${product.name} - image ${currentImage + 1}`}
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.bestSeller && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#2563eb] text-white text-[11px] font-bold rounded-full">
                    Best Seller
                  </span>
                )}
                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#334155]" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-[#334155]" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {gallery.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            i === currentImage
                              ? "bg-[#2563eb]"
                              : "bg-slate-300"
                          }`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-[0.15em] uppercase rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-[32px] md:text-[40px] font-bold text-[#0f172a] mb-3">
                {product.name}
              </h1>
              <p className="text-[15px] md:text-[16px] text-[#64748b] leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-[36px] font-bold text-[#2563eb]">
                  ₹{product.price}
                </span>
                <span className="text-[14px] text-[#94a3b8]">
                  per {product.sizes[0]}
                </span>
              </div>

              {product.sizes.length > 1 && (
                <div className="mb-6">
                  <h4 className="text-[13px] font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                    Available Sizes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-4 py-2 text-[13px] font-medium bg-slate-100 text-[#334155] rounded-full border border-slate-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-[14px] font-semibold rounded-full hover:bg-green-600 transition-colors shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Order on WhatsApp
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.shortDescription,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 text-[#334155] text-[14px] font-semibold rounded-full hover:bg-slate-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Benefits */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                <h4 className="text-[14px] font-bold text-[#0f172a] mb-3 uppercase tracking-wide">
                  Key Benefits
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-[#475569]"
                    >
                      <span className="text-green-500 mt-0.5 shrink-0">✔</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directions */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="text-[14px] font-bold text-[#0f172a] mb-3 uppercase tracking-wide">
                  How to Use
                </h4>
                <ol className="space-y-2">
                  {product.directions.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[13px] text-[#475569]"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2563eb] text-white text-[11px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      {d}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-[60px] md:py-[72px] bg-[#f8fafc]">
          <div className="mx-auto max-w-[1260px] px-5 md:px-8">
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={`/products/${rp.slug}`}
                    className="group block bg-white border border-slate-100 rounded-[20px] overflow-hidden card-lift"
                  >
                    <div className="relative aspect-square bg-[#f8fafc] overflow-hidden">
                      <ProductImage
                        src={rp.image}
                        alt={rp.name}
                        className="object-contain p-4 img-zoom"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] font-medium text-[#2563eb]">
                        {rp.category}
                      </span>
                      <h3 className="text-[15px] font-bold text-[#0f172a] mt-0.5 mb-1 group-hover:text-[#2563eb] transition-colors">
                        {rp.name}
                      </h3>
                      <p className="text-[12px] text-[#64748b] line-clamp-1 mb-2">
                        {rp.shortDescription}
                      </p>
                      <span className="text-[18px] font-bold text-[#2563eb]">
                        ₹{rp.price}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}