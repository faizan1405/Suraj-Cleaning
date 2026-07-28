export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getOrderByRazorpayOrderId, updateOrder, getOrderByRazorpayPaymentId } from "@/data/orders";
import { readJsonFile, writeJsonFile } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body as { razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string };

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Idempotency: if a different order already has this payment ID, reject
    const existingByPayment = await getOrderByRazorpayPaymentId(razorpayPaymentId);
    if (existingByPayment && existingByPayment.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Duplicate payment" }, { status: 400 });
    }

    const order = await getOrderByRazorpayOrderId(razorpayOrderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotent: if order is already paid, return it
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ order, status: "already_paid" });
    }

    // Reduce stock and update products
    await reduceStock(order.items);

    const updated = await updateOrder(order.id, {
      razorpayPaymentId,
      paymentStatus: "paid",
      status: "processing",
      paidAt: new Date().toISOString(),
    });

    return NextResponse.json({ order: updated, status: "paid" });
  } catch (error) {
    console.error("Order verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

async function reduceStock(items: import("@/data/orders").OrderItem[]) {
  try {
    const raw = await readJsonFile<Record<string, unknown>[]>("products.json");
    if (!Array.isArray(raw)) return;

    const itemsById = new Map(items.map((i) => [i.productId, i.quantity]));
    const updated = raw.map((p) => {
      const id = String(p.id ?? "");
      if (itemsById.has(id)) {
        const currentStock = Number(p.stock ?? 0);
        return { ...p, stock: Math.max(0, currentStock - (itemsById.get(id) ?? 0)) };
      }
      return p;
    });
    await writeJsonFile("products.json", updated);
  } catch (err) {
    console.error("Failed to reduce stock:", err);
  }
}
