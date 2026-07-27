export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db";

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

    if (!body.fullName || !body.mobile || !body.businessName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate Indian mobile number
    const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!mobileRegex.test(body.mobile.replace(/\s/g, ""))) {
      return NextResponse.json(
        { message: "Invalid mobile number" },
        { status: 400 }
      );
    }

    // Persist to submissions
    const submissions = (await readJsonFile<any[]>("submissions/distributor.json")) || [];
    submissions.push({
      id: `dist_${Date.now()}`,
      ...body,
      submittedAt: new Date().toISOString(),
    });
    await writeJsonFile("submissions/distributor.json", submissions);

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
