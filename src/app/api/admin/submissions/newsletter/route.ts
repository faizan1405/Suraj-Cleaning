export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "newsletter";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
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
      .sort({ subscribedAt: -1 })
      .limit(500)
      .toArray();
    return NextResponse.json(
      items.map((i) => ({ ...i, _id: i._id?.toString(), type: "newsletter" }))
    );
  } catch (error) {
    console.error("[admin/newsletter] list error", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }
    const db = await getDb();
    const entry = {
      email: parsed.data.email.toLowerCase(),
      subscribedAt: new Date(),
      type: "newsletter",
    };
    try {
      await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });
    } catch {
      // Index may already exist
    }
    try {
      const result = await db.collection(COLLECTION).insertOne(entry);
      return NextResponse.json(
        { success: true, data: { ...entry, _id: result.insertedId.toString() } },
        { status: 201 }
      );
    } catch (e: any) {
      if (e?.code === 11000) {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      throw e;
    }
  } catch (error) {
    console.error("[admin/newsletter] create error", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
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
    console.error("[admin/newsletter] delete error", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}