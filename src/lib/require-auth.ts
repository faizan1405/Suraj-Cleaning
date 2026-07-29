import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireAuth(): Promise<{ sub: string; email: string; name: string; picture?: string } | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return {
    sub: session.sub,
    email: session.email,
    name: session.name,
    picture: session.picture,
  };
}
