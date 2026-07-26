import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ message: "Spam detected" }, { status: 200 });
    }

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 400 }
      );
    }

    // In production, integrate with email service here
    console.log("Newsletter subscription:", body.email);

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
