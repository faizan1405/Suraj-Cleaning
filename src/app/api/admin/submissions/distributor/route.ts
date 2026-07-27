export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.mobile || !body.businessName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const submissions = readJsonFile<any[]>("submissions/distributor.json");
    const entry = {
      id: `dist_${Date.now()}`,
      ...body,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(entry);
    writeJsonFile("submissions/distributor.json", submissions);

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/submissions/distributor:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
