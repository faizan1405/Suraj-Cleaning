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
    // Return full orders so the profile dashboard can show items + images.
    // Sensitive secrets (signatures) are already not stored on the order.
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Order list failed:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
