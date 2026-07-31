"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { checkoutSchema, INDIAN_STATES } from "@/lib/order-schema";
import type { CheckoutFormData } from "@/lib/order-schema";
import { getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { shipping, payments, business, contact } from "@/config/site";
import { formatPrice } from "@/lib/currency";

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill: Record<string, string>;
      handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
      on_close?: () => void;
      theme?: { color: string };
    }) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [form, setForm] = useState<CheckoutFormData>({
    fullName: "", mobile: "", email: "", address: "", city: "", state: "", pincode: "", landmark: "", orderNotes: "",
  });

  const subtotal = totalPrice;
  const deliveryFee = subtotal >= shipping.freeDeliveryThreshold ? 0 : shipping.deliveryFee;
  const taxRate = payments.taxPercent;
  const taxAmount = Math.round(subtotal * taxRate / 100);
  const grandTotal = subtotal + deliveryFee + taxAmount;

  const razorpayReady = isRazorpayConfigured();

  const setField = useCallback((field: keyof CheckoutFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const loadRazorpayScript = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Normalise mobile before validation — strip +91, spaces, dashes
    const normalised = {
      ...form,
      mobile: form.mobile.replace(/^\+?91[-\s]?/, "").replace(/[-\s]/g, ""),
    };

    const parsed = checkoutSchema.safeParse(normalised);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of parsed.error.errors) {
        const path = err.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = err.message;
      }
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    try {
      if (paymentMethod === "cod") {
        await handleCODSubmit(parsed.data);
      } else {
        await handleRazorpaySubmit(parsed.data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setErrors({ _form: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCODSubmit = async (customerData: CheckoutFormData) => {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: customerData,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
        paymentMethod: "cod",
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to create order");
    }
    clearCart();
    router.push(`/order-success?orderId=${result.orderId}`);
  };

  const handleRazorpaySubmit = async (customerData: CheckoutFormData) => {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: customerData,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
        paymentMethod: "razorpay",
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to create order");
    }

    await loadRazorpayScript();

    const keyId = getRazorpayKeyId();
    if (!keyId) {
      throw new Error("Payment configuration error");
    }

    const options = {
      key: keyId,
      amount: result.amount * 100,
      currency: result.currency,
      name: business.name,
      description: `Order ${result.orderId}`,
      order_id: result.razorpayOrderId,
      prefill: {
        name: customerData.fullName,
        email: customerData.email,
        contact: customerData.mobile,
      },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        try {
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && (verifyData.status === "paid" || verifyData.status === "already_paid")) {
            const orderId = verifyData.order?.id || result.orderId;
            clearCart();
            router.push(`/order-success?orderId=${orderId}`);
          } else {
            router.push(`/order-failed?reason=${encodeURIComponent(verifyData.error || "Payment verification failed")}`);
          }
        } catch {
          router.push(`/order-failed?reason=${encodeURIComponent("Network error during verification")}`);
        }
      },
      on_close: () => {
        // User closed the modal without paying
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (items.length === 0 && !submitting) {
    return (
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8 text-center">
          <h1 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-3">Checkout</h1>
          <p className="text-[15px] text-[#64748b] mb-6">Your cart is empty. Add some products first.</p>
          <Link href="/products" className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px]">
            <ArrowLeft className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[1260px] px-5 md:px-8">
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#2563eb] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>
        <h1 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              {paymentMethod === "razorpay" && !razorpayReady && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800">
                  Online payment (Razorpay) is currently not configured. Please select Cash on Delivery to complete your order.
                </div>
              )}
              {errors._form && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">{errors._form}</div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-[13px] font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" id="fullName" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all ${errors.fullName ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white"}`} placeholder="Your full name" />
                  {errors.fullName && <p className="text-red-500 text-[12px] mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-[13px] font-semibold text-slate-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" id="mobile" value={form.mobile} onChange={(e) => setField("mobile", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all ${errors.mobile ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white"}`} placeholder="10-digit mobile number" />
                  {errors.mobile && <p className="text-red-500 text-[12px] mt-1">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" id="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all ${errors.email ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white"}`} placeholder="you@example.com" />
                {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-[13px] font-semibold text-slate-700 mb-1.5">Complete Address <span className="text-red-500">*</span></label>
                <textarea id="address" rows={3} value={form.address} onChange={(e) => setField("address", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all resize-none ${errors.address ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white"}`} placeholder="House/Flat, Street, Area" />
                {errors.address && <p className="text-red-500 text-[12px] mt-1">{errors.address}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-[13px] font-semibold text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                  <input type="text" id="city" value={form.city} onChange={(e) => setField("city", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all ${errors.city ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white"}`} />
                  {errors.city && <p className="text-red-500 text-[12px] mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-[13px] font-semibold text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                  <select id="state" value={form.state} onChange={(e) => setField("state", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all bg-white ${errors.state ? "border-red-400" : "border-slate-200"}`}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-[12px] mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-[13px] font-semibold text-slate-700 mb-1.5">PIN Code <span className="text-red-500">*</span></label>
                  <input type="text" id="pincode" value={form.pincode} onChange={(e) => setField("pincode", e.target.value)} required className={`w-full px-4 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all ${errors.pincode ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white"}`} placeholder="6-digit PIN" />
                  {errors.pincode && <p className="text-red-500 text-[12px] mt-1">{errors.pincode}</p>}
                </div>
                <div>
                  <label htmlFor="landmark" className="block text-[13px] font-semibold text-slate-700 mb-1.5">Landmark <span className="text-slate-400">(optional)</span></label>
                  <input type="text" id="landmark" value={form.landmark} onChange={(e) => setField("landmark", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all" placeholder="Near..." />
                </div>
              </div>

              <div>
                <label htmlFor="orderNotes" className="block text-[13px] font-semibold text-slate-700 mb-1.5">Order Notes <span className="text-slate-400">(optional)</span></label>
                <textarea id="orderNotes" rows={2} value={form.orderNotes} onChange={(e) => setField("orderNotes", e.target.value)} className="w-full px-4 py-2.5 text-[14px] border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all resize-none" placeholder="Any special instructions..." />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#2563eb] bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#2563eb] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    <Truck className="w-6 h-6 text-[#2563eb] mb-2" />
                    <p className="text-[14px] font-bold text-slate-800">Cash on Delivery</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pay when you receive</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "razorpay"
                        ? "border-[#2563eb] bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {paymentMethod === "razorpay" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#2563eb] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    <CreditCard className="w-6 h-6 text-[#2563eb] mb-2" />
                    <p className="text-[14px] font-bold text-slate-800">Online Payment</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pay via Razorpay</p>
                  </button>
                </div>

                {paymentMethod === "cod" && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[12px] text-amber-800">
                    <strong>COD Terms:</strong> Please keep exact change ready. Our delivery partner will collect cash at the time of delivery. Orders can be cancelled before dispatch only.
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/80 sticky top-[100px]">
                <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#0f172a] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#64748b]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[12px] font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-4 border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-[13px]"><span className="text-[#64748b]">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-[#64748b]">Delivery</span><span className="font-medium">{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-[#64748b]">Tax</span><span className="font-medium">{formatPrice(taxAmount)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-200"><span className="text-[15px] font-bold">Total</span><span className="text-[15px] font-bold text-[#2563eb]">{formatPrice(grandTotal)}</span></div>
                </div>
                <button
                  type="submit"
                  disabled={submitting || (paymentMethod === "razorpay" && !razorpayReady)}
                  className="w-full py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : paymentMethod === "cod" ? (
                    <>Place Order (COD)</>
                  ) : !razorpayReady ? (
                    "Payment Not Configured"
                  ) : (
                    <>Pay {formatPrice(grandTotal)} <ShieldCheck className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-3">
                  {paymentMethod === "cod"
                    ? "Pay cash to the delivery agent when you receive your order."
                    : "Secured by Razorpay. Your payment info is encrypted."}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
