import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json(
        { message: "Spam detected" },
        { status: 409 }
      );
    }

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 400 }
      );
    }

    // Persist to submissions
    const submissions = readJsonFile<any[]>("submissions/newsletter.json");
    submissions.push({
      id: `news_${Date.now()}`,
      email: body.email,
      submittedAt: new Date().toISOString(),
    });
    writeJsonFile("submissions/newsletter.json", submissions);

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
