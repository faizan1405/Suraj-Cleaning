import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getUser, createUser, updateUser } from "@/data/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const user = await getUser(auth.sub);
  if (!user) {
    // Auto-create user profile from OAuth session
    const created = await createUser({
      id: auth.sub,
      email: auth.email,
      name: auth.name,
      picture: auth.picture,
      addresses: [],
    });
    return NextResponse.json(created);
  }
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { name, phone } = body as { name?: string; phone?: string };

    if (!name && phone === undefined) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updates: { name?: string; phone?: string } = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim() || undefined;

    const updated = await updateUser(auth.sub, updates);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
