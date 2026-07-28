"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { User, Package, LogOut, ChevronRight } from "lucide-react";
import type { SessionUser } from "@/lib/auth";

export default function ProfileClient({ initialUser }: { initialUser: SessionUser }) {
  const [user, setUser] = useState<SessionUser>(initialUser);

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[600px] px-5 md:px-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 mx-auto mb-4"
          >
            {user.picture ? (
              <Image src={user.picture} alt={user.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center">
                <User className="w-8 h-8 text-slate-300" />
              </div>
            )}
          </motion.div>
          <h1 className="text-[24px] font-bold text-[#0f172a] mb-1">{user.name}</h1>
          <p className="text-[14px] text-[#64748b]">{user.email}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/80 hover:border-[#2563eb]/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0f172a]">My Orders</p>
                <p className="text-[12px] text-[#64748b]">Track and view your purchases</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563eb] transition-colors" />
          </Link>

          <Link
            href="/cart"
            className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/80 hover:border-[#2563eb]/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0f172a]">Shopping Cart</p>
                <p className="text-[12px] text-[#64748b]">Review items before checkout</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563eb] transition-colors" />
          </Link>

          <form action="/api/auth/signout" method="POST" className="block">
            <button
              type="submit"
              className="w-full flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 hover:border-red-200 hover:bg-red-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-red-700">Sign Out</p>
                  <p className="text-[12px] text-red-500">Sign out of your account</p>
                </div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}