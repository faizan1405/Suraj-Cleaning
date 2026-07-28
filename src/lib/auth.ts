import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "swaraj-dev-secret-change-me-in-production";

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
  const token = cookieStore.get("session")?.value;
  return parseSession(token);
}
