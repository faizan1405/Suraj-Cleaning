import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getAddresses, addAddress } from "@/data/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const addresses = await getAddresses(auth.sub);
  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { label, fullName, mobile, address, city, state, pincode, landmark, isDefault } = body as {
      label: string;
      fullName: string;
      mobile: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
      isDefault: boolean;
    };

    if (!fullName || !mobile || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
    }

    const newAddress = await addAddress(auth.sub, {
      label: label || "Home",
      fullName,
      mobile,
      address,
      city,
      state,
      pincode,
      landmark,
      isDefault: isDefault || false,
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add address";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
