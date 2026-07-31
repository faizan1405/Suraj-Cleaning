export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "distributor";

const distributorSchema = z.object({
  fullName: z.string().min(1, "Name required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Invalid email"),
  businessName: z.string().min(1, "Business name required"),
  city: z.string().min(1),
  state: z.string().min(1),
  businessType: z.string().optional(),
  investment: z.string().optional(),
  message: z.string().optional(),
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
      items.map((i) => ({ ...i, _id: i._id?.toString(), type: "distributor" }))
    );
  } catch (error) {
    console.error("[admin/distributor] list error", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = distributorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const db = await getDb();
    const entry = { ...parsed.data, submittedAt: new Date(), type: "distributor" };
    const result = await db.collection(COLLECTION).insertOne(entry);
    return NextResponse.json(
      { success: true, data: { ...entry, _id: result.insertedId.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[admin/distributor] create error", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
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
    console.error("[admin/distributor] delete error", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}