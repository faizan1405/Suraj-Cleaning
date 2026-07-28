"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center p-2 text-slate-600 hover:text-[#2563eb] transition-colors"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          key={totalItems}
          className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#2563eb] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </motion.span>
      )}
    </Link>
  );
}
