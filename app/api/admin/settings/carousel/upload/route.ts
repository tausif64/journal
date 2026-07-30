import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Image file is required" },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, error: "Only image files are allowed" },
      { status: 400 }
    );
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { success: false, error: "Image must be <= 5MB" },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "carousel");
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `carousel-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}${ext}`;
  const absolutePath = path.join(uploadDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  return NextResponse.json({
    success: true,
    data: { url: `/uploads/carousel/${filename}` },
  });
}
