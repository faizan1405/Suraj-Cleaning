export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readJsonFile } from "@/lib/db";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contact = (await readJsonFile<any[]>("submissions/contact.json")) || [];
    const distributor = (await readJsonFile<any[]>("submissions/distributor.json")) || [];
    const newsletter = (await readJsonFile<any[]>("submissions/newsletter.json")) || [];

    const all = [
      ...contact.map((c) => ({ ...c, type: "contact" })),
      ...distributor.map((d) => ({ ...d, type: "distributor" })),
      ...newsletter.map((n) => ({ ...n, type: "newsletter" })),
    ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json(all);
  } catch (error) {
    console.error("GET /api/admin/submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
