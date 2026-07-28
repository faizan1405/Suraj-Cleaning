export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readJsonFile, writeJsonFile } from "@/lib/db";
import { normalizeProduct } from "@/lib/normalize";

const ENTITY_FILES: Record<string, string> = {
  products: "products.json",
  categories: "categories.json",
  testimonials: "testimonials.json",
  qualityProcess: "qualityProcess.json",
  company: "company.json",
  contact: "submissions/contact.json",
  distributor: "submissions/distributor.json",
  newsletter: "submissions/newsletter.json",
};

function getEntityFile(entity: string): string {
  const file = ENTITY_FILES[entity];
  if (!file) throw new Error(`Unknown entity: ${entity}`);
  return file;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const file = getEntityFile(entity);
    const data = await readJsonFile(file);

    // Normalize products so the frontend never sees undefined sizes,
    // string-instead-of-array benefits/directions, or missing images.
    if (entity === "products") {
      const items = Array.isArray(data) ? data : [];
      return NextResponse.json(items.map(normalizeProduct));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entity } = await params;
    const body = await request.json();
    const file = getEntityFile(entity);

    if (entity === "company") {
      await writeJsonFile(file, body.data);
      return NextResponse.json({ success: true, data: body.data });
    }

    const current = (await readJsonFile<any[]>(file)) || [];
    const rawItem = { ...body.data, id: body.id || crypto.randomUUID() };
    const newItem = entity === "products" ? normalizeProduct(rawItem) : rawItem;
    current.push(newItem);
    await writeJsonFile(file, current);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/data:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entity } = await params;
    const body = await request.json();
    const file = getEntityFile(entity);

    if (entity === "company") {
      await writeJsonFile(file, body.data);
      return NextResponse.json({ success: true, data: body.data });
    }

    const current = await readJsonFile<any[]>(file);
    const index = current.findIndex((item) => item.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const merged = { ...current[index], ...body.data };
    if (entity === "products") {
      current[index] = normalizeProduct(merged);
    } else {
      current[index] = merged;
    }
    await writeJsonFile(file, current);
    return NextResponse.json({ success: true, data: current[index] });
  } catch (error) {
    console.error("PUT /api/admin/data:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entity } = await params;
    const body = await request.json();
    const file = getEntityFile(entity);

    if (entity === "company") {
      return NextResponse.json({ error: "Cannot delete company" }, { status: 400 });
    }

    const current = await readJsonFile<any[]>(file);
    const filtered = current.filter((item) => item.id !== body.id);
    await writeJsonFile(file, filtered);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/admin/data:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
