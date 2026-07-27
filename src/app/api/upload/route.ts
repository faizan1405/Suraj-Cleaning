export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import cloudinary, { initCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    initCloudinary();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded. Please choose an image." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Please upload an image.` },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using base64 — simpler and avoids stream issues in Next.js runtime
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "suraj-cleaning/admin",
      resource_type: "auto",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("[upload] Error:", error?.message || error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          error?.error?.message ||
          "Upload failed. Please check the server logs.",
      },
      { status: 500 }
    );
  }
}