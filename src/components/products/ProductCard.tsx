"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const sizeLabel = product.sizes?.[0] ?? "Standard";
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const directions = Array.isArray(product.directions) ? product.directions : [];
  const productImage = product.image && product.image.trim() ? product.image : "/images/product-placeholder.png";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="bg-white border border-slate-100 rounded-[20px] overflow-hidden card-lift flex flex-col"
    >
      <div className="relative aspect-square bg-[#f8fafc] overflow-hidden">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-contain p-4 img-zoom"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.bestSeller && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#2563eb] text-white text-[10px] font-bold rounded-full">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-medium text-[#2563eb] mb-0.5">
          {product.category}
        </span>
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">
          {product.name}
        </h3>
        <p className="text-[12px] text-[#64748b] mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[18px] font-bold text-[#2563eb]">
            ₹{product.price}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="text-[13px] font-semibold text-white bg-[#2563eb] px-3.5 py-1.5 rounded-full hover:bg-[#1d4ed8] transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
