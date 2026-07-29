export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getOrdersByEmail, getOrdersByUserId } from "@/data/orders";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prefer linking by user id (Google sub), fall back to email for legacy orders.
    const orders = await getOrdersByUserId(session.sub);
    const finalOrders = orders.length > 0
      ? orders
      : await getOrdersByEmail(session.email);

    return NextResponse.json(finalOrders);
  } catch (error) {
    console.error("Order list failed:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}