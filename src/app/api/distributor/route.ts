import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ message: "Spam detected" }, { status: 200 });
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

    console.log("Distributor application:", body);

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
