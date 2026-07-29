import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  const url = new URL(request.url);
  const host = url.host;
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");

  return NextResponse.redirect(new URL("/signin", `${proto}://${host}`));
}
