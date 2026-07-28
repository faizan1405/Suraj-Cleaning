export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.redirect(new URL("/signin", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}
