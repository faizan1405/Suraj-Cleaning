export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBaseUrl, getOAuthRedirectUri } from "@/lib/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

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
    redirect_uri: getOAuthRedirectUri(baseUrl),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
