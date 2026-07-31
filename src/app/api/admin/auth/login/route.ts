import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/admin-auth";
import logger from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password || !validateCredentials(username, password)) {
      logger.warn("Admin login failed", { username });
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("admin-session", process.env.ADMIN_SESSION_SECRET!, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
