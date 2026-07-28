export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db";
import { normalizeProduct } from "@/lib/normalize";

export async function GET() {
  try {
    const raw = await readJsonFile<Record<string, unknown>[]>("products.json");
    if (!Array.isArray(raw)) return NextResponse.json([]);
    const products = raw.map(normalizeProduct);
    const combos = products.filter(
      (p) => p.active && (p.badge && /combo/i.test(p.badge) || /combo/i.test(p.category))
    );
    return NextResponse.json(combos);
  } catch {
    return NextResponse.json([]);
  }
}
