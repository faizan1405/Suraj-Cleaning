import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const submissions = readJsonFile<any[]>("submissions/contact.json");
    const entry = {
      id: `contact_${Date.now()}`,
      ...body,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(entry);
    writeJsonFile("submissions/contact.json", submissions);

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/submissions/contact:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
