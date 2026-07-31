"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { shipping, payments } from "@/config/site";
import { formatPrice } from "@/lib/currency";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const router = useRouter();
  const [stockMap, setStockMap] = useState<Record<string, { productStock: number; variants: Array<{ name: string; stock: number }> }>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error();
        const products = await res.json();
        if (!cancelled) {
          const map: Record<string, { productStock: number; variants: Array<{ name: string; stock: number }> }> = {};
          for (const p of products) {
            map[p.id] = {
              productStock: Number(p.stock ?? 0),
              variants: Array.isArray(p.variants) ? p.variants.map((v: any) => ({ name: v.name, stock: Number(v.stock ?? 0) })) : [],
            };
          }
          setStockMap(map);
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= shipping.freeDeliveryThreshold ? 0 : shipping.deliveryFee;
  const taxRate = payments.taxPercent;
  const taxAmount = Math.round(subtotal * taxRate / 100);
  const grandTotal = subtotal + deliveryFee + taxAmount;

  if (items.length === 0) {
    return (
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <h1 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-3 text-center">Your Cart</h1>
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-[16px] text-[#64748b] mb-6">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <h1 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-6">
          Your Cart <span className="text-[#64748b] font-normal text-[18px]">({totalItems} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const stockInfo = stockMap[item.productId] ?? { productStock: -1, variants: [] };
                const variantStock = item.size
                  ? stockInfo.variants.find((v) => v.name === item.size)?.stock
                  : undefined;
                const available = variantStock ?? stockInfo.productStock;
                const isOutOfStock = available === 0;
                const isOverStocked = available > 0 && item.quantity > available;

                return (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={`flex gap-4 p-4 rounded-2xl border ${isOutOfStock ? "border-red-200 bg-red-50/30" : "border-slate-200/80 bg-white"}`}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f8fafc] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold text-[#0f172a] truncate">{item.name}</h3>
                      {item.size && <p className="text-[12px] text-[#64748b]">Size: {item.size}</p>}
                      <p className="text-[15px] font-bold text-[#2563eb] mt-1">{formatPrice(item.price)}</p>
                      {isOutOfStock && <p className="text-[12px] text-red-600 font-medium mt-1">Out of stock</p>}
                      {isOverStocked && <p className="text-[12px] text-red-600 font-medium mt-1">Only {available} left</p>}
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                          disabled={isOutOfStock || (available > 0 && item.quantity >= available)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[14px] font-bold text-[#0f172a]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/80 sticky top-[100px]">
              <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">Order Summary</h2>
              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#64748b]">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#64748b]">Delivery</span>
                  <span className="font-medium">{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#64748b]">Tax</span>
                  <span className="font-medium">{formatPrice(taxAmount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between">
                  <span className="text-[15px] font-bold text-[#0f172a]">Total</span>
                  <span className="text-[15px] font-bold text-[#2563eb]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-3 bg-[#2563eb] text-white font-bold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 mt-3 text-[13px] text-[#64748b] hover:text-[#2563eb] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
