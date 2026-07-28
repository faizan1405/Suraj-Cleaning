export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getOrders } from "@/data/orders";
import type { Order } from "@/data/orders";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, data } = body as { id: string; data: Partial<Order> };

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const { updateOrder } = await import("@/data/orders");
    const updated = await updateOrder(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
