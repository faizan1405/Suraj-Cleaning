"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const sizeLabel = product.sizes?.[0] ?? "Standard";
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const directions = Array.isArray(product.directions) ? product.directions : [];
  const productImage = product.image && product.image.trim() ? product.image : "/images/product-placeholder.png";
  const inStock = Number(product.stock ?? 0) > 0;

  const handleAdd = useCallback(() => {
    if (!inStock) return;
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, product.id, product.name, product.price, product.image, inStock]);

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
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#2563eb] text-white text-[10px] font-bold rounded-full">Best Seller</span>
        )}
        {product.badge && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full">{product.badge}</span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white text-[12px] font-bold rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-medium text-[#2563eb]">
            {product.category}
          </span>
          {product.badge && (
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap">{product.badge}</span>
          )}
        </div>
        <h3 className="text-[15px] font-bold text-[#0f172a] mt-1 mb-1">
          {product.name}
        </h3>
        <p className="text-[12px] text-[#64748b] mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mt-auto gap-2">
          <span className="text-[18px] font-bold text-[#2563eb]">
            ₹{product.price}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : inStock
                    ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              aria-label="Add to cart"
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              {added ? "Added" : inStock ? "Add" : "Sold Out"}
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="text-[12px] font-semibold text-[#2563eb] px-3 py-1.5 rounded-full border border-[#2563eb]/20 hover:bg-blue-50 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
