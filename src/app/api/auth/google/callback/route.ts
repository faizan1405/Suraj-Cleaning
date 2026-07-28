export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
  scope: string;
}

interface GoogleUser {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

function signSession(payload: object): string {
  const secret = process.env.NEXTAUTH_SECRET || "swaraj-dev-secret-change-me";
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=missing_params`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=invalid_state`);
  }

  cookieStore.delete("oauth_state");

  try {
    const redirectUri = `${NEXTAUTH_URL}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Google token exchange failed:", err);
      return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=token_exchange_failed`);
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=userinfo_failed`);
    }

    const user: GoogleUser = await userRes.json();

    if (!user.email_verified) {
      return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=email_not_verified`);
    }

    const sessionPayload = {
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    };

    const sessionToken = signSession(sessionPayload);

    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.redirect(`${NEXTAUTH_URL}/profile`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${NEXTAUTH_URL}/signin?error=callback_failed`);
  }
}