import crypto from "crypto";

const _secret = process.env.NEXTAUTH_SECRET;
if (!_secret) {
  throw new Error("NEXTAUTH_SECRET is not set in environment variables");
}
const SECRET = _secret as string;

export const SESSION_COOKIE_NAME = "session";
export const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function isLocalhost(host: string): boolean {
  return host.includes("localhost") || host.includes("127.0.0.1");
}

export function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const host = url.host;
  const proto = request.headers.get("x-forwarded-proto") || (isLocalhost(host) ? "http" : "https");
  return `${proto}://${host}`;
}

export function getCookieOptions(baseUrl: string) {
  const isLocal = isLocalhost(baseUrl);
  return {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? ("lax" as const) : ("none" as const),
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
  };
}

export function getOAuthRedirectUri(baseUrl: string): string {
  return `${baseUrl}/api/auth/google/callback`;
}

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface SessionPayload extends SessionUser {
  iat: number;
  exp: number;
}

export function signSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function parseSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (sig !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return parseSession(token);
}
