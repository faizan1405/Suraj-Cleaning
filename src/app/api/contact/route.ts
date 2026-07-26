import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body["contact-website"]) {
      return NextResponse.json(
        { message: "Spam detected" },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, integrate with email service or CRM here
    console.log("Contact form submission:", body);

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
