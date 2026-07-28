export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db";
import { normalizeProduct } from "@/lib/normalize";
import type { Product } from "@/data/products";

export async function GET() {
  try {
    const raw = await readJsonFile<Record<string, unknown>[]>("products.json");
    if (!Array.isArray(raw)) return NextResponse.json([]);
    const products = raw.map(normalizeProduct);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}
