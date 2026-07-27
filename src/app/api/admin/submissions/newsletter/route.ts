export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const submissions = (await readJsonFile<any[]>("submissions/newsletter.json")) || [];
    const entry = {
      id: `news_${Date.now()}`,
      ...body,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(entry);
    await writeJsonFile("submissions/newsletter.json", submissions);

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/submissions/newsletter:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
