import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { updateAddress, deleteAddress } from "@/data/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { addressId } = await params;
    const body = await request.json();
    const { label, fullName, mobile, address, city, state, pincode, landmark, isDefault } = body as {
      label?: string;
      fullName?: string;
      mobile?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      landmark?: string;
      isDefault?: boolean;
    };

    const updates: Record<string, unknown> = {};
    if (label !== undefined) updates.label = label;
    if (fullName !== undefined) updates.fullName = fullName;
    if (mobile !== undefined) updates.mobile = mobile;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (pincode !== undefined) updates.pincode = pincode;
    if (landmark !== undefined) updates.landmark = landmark;
    if (isDefault !== undefined) updates.isDefault = isDefault;

    const updated = await updateAddress(auth.sub, addressId, updates);
    if (!updated) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { addressId } = await params;
    const success = await deleteAddress(auth.sub, addressId);
    if (!success) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
