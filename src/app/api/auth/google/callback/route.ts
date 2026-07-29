export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const host = url.host;
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}

function signSession(payload: object): string {
  const secret = process.env.NEXTAUTH_SECRET || "swaraj_dev_secret_change_me";
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${baseUrl}/signin?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/signin?error=missing_params`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/signin?error=invalid_state`);
  }

  cookieStore.delete("oauth_state");

  try {
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

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
      return NextResponse.redirect(`${baseUrl}/signin?error=token_exchange_failed`);
    }

    const tokens = await tokenRes.json() as {
      access_token: string;
      id_token: string;
      expires_in: number;
      refresh_token?: string;
      token_type: string;
      scope: string;
    };

    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${baseUrl}/signin?error=userinfo_failed`);
    }

    const user = await userRes.json() as {
      sub: string;
      email: string;
      email_verified: boolean;
      name: string;
      picture?: string;
    };

    if (!user.email_verified) {
      return NextResponse.redirect(`${baseUrl}/signin?error=email_not_verified`);
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
      secure: !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1"),
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.redirect(`${baseUrl}/profile`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/signin?error=callback_failed`);
  }
}
