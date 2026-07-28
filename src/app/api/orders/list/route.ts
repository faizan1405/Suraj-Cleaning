export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getOrdersByEmail } from "@/data/orders";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email")?.trim() ?? "";

    if (!email) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await getOrdersByEmail(email);
    // Redact sensitive info in list view
    const redacted = orders.map((o) => ({
      id: o.id,
      razorpayOrderId: o.razorpayOrderId,
      status: o.status,
      paymentStatus: o.paymentStatus,
      total: o.total,
      itemCount: o.items.reduce((s, i) => s + i.quantity, 0),
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    }));

    return NextResponse.json({ orders: redacted });
  } catch (error) {
    console.error("Order list failed:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
