import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      return NextResponse.json({ status: "ok", mongodb: "connected" });
    }
    return NextResponse.json({ status: "error", mongodb: "disconnected" }, { status: 503 });
  } catch {
    return NextResponse.json({ status: "error", mongodb: "disconnected" }, { status: 503 });
  }
}
