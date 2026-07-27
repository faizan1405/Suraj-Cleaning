export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body["contact-website"]) {
      return NextResponse.json(
        { message: "Spam detected" },
        { status: 409 }
      );
    }

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Persist to submissions
    const submissions = (await readJsonFile<any[]>("submissions/contact.json")) || [];
    submissions.push({
      id: `contact_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      message: body.message,
      submittedAt: new Date().toISOString(),
    });
    await writeJsonFile("submissions/contact.json", submissions);

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
