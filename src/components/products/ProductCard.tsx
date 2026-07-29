"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, ChevronDown } from "lucide-react";
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
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const initializedProductId = useRef<string | null>(null);

  // Display price: show min price ("From ₹XXX") when variants exist,
  // otherwise show the product's base price
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const variantPrices = hasVariants ? product.variants!.map((v) => v.price) : [];
  const minVariantPrice = hasVariants ? Math.min(...variantPrices) : null;
  const maxVariantPrice = hasVariants ? Math.max(...variantPrices) : null;
  const displayPrice = hasVariants ? minVariantPrice! : product.price;
  const priceLabel = hasVariants && variantPrices.length > 1
    ? `₹${displayPrice} – ₹${maxVariantPrice}`
    : `₹${displayPrice}`;
  const inStock = Number(product.stock ?? 0) > 0;
  const productImage = product.image && product.image.trim() ? product.image : "/images/product-placeholder.png";

  // Auto-select first variant when product changes
  useEffect(() => {
    if (hasVariants && product.variants!.length > 0) {
      if (initializedProductId.current !== product.id || !selectedVariant) {
        setSelectedVariant(product.variants![0].name);
        initializedProductId.current = product.id;
      }
    }
  }, [product.id, hasVariants, product.variants, selectedVariant]);

  const currentVariant = hasVariants
    ? product.variants!.find(v => v.name === selectedVariant) ?? product.variants![0]
    : null;
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentStock = currentVariant ? currentVariant.stock : Number(product.stock ?? 0);
  const isInStock = currentStock > 0;

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;
    addItem({ productId: product.id, name: product.name, price: currentPrice, image: product.image, size: selectedVariant || undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, product.id, product.name, currentPrice, product.image, selectedVariant, isInStock]);

  const cardLink = `/products/${product.slug}`;

  return (
    <Link href={cardLink} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ delay: index * 0.06, duration: 0.5 }}
        className="bg-white border border-slate-100 rounded-[20px] overflow-hidden card-lift flex flex-col h-full"
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

          {/* Variant selector — stop propagation so it doesn't navigate */}
          {hasVariants && (
            <div className="mb-3" onClick={(e) => e.stopPropagation()}>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block uppercase tracking-wide">Select Variant</label>
              <div className="relative">
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full appearance-none px-3 py-2 pr-8 text-[13px] font-medium bg-slate-50 border border-slate-200 rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {product.variants!.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} — ₹{v.price} {v.stock === 0 ? "(Sold Out)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto gap-2">
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#2563eb]">
                {priceLabel}
              </span>
            </div>
            <button
              onClick={handleAdd}
              disabled={!isInStock}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : isInStock
                    ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              aria-label="Add to cart"
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              {added ? "Added" : isInStock ? `Add — ₹${currentPrice}` : "Sold Out"}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
