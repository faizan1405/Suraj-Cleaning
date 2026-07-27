import { NextResponse } from "next/server";
import { navigation } from "@/data/navigation";

export async function GET() {
  return NextResponse.json({ items: navigation });
}
