export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const host = url.host;
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}

function generateState(): string {
  return Buffer.from(`${Date.now()}-${Math.random().toString(36).slice(2)}`).toString("base64url");
}

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request);
  const state = generateState();

  const cookieStore = await cookies();

  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1"),
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
