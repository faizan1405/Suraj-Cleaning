export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getOrderById } from "@/data/orders";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const url = new URL(request.url);
    const email = url.searchParams.get("email")?.toLowerCase() ?? "";

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (email && order.customer.email.toLowerCase() !== email) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
