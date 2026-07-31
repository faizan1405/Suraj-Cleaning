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

    // Fetch by both userId (primary) and email (legacy), then merge/dedup.
    const byUserId = await getOrdersByUserId(session.sub);
    const byEmail = await getOrdersByEmail(session.email);
    const seen = new Set<string>(byUserId.map((o) => o.id));
    const merged = [...byUserId, ...byEmail.filter((o) => !seen.has(o.id))];

    return NextResponse.json(merged);
  } catch (error) {
    console.error("Order list failed:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}