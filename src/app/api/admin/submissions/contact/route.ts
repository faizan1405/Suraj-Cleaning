export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "contact";

const contactSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message required"),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    const items = await db
      .collection(COLLECTION)
      .find({})
      .sort({ submittedAt: -1 })
      .limit(500)
      .toArray();
    return NextResponse.json(
      items.map((i) => ({ ...i, _id: i._id?.toString(), type: "contact" }))
    );
  } catch (error) {
    console.error("[admin/contact] list error", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/contact] delete error", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}