import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "PDF file is required" },
      { status: 400 }
    );
  }

  const isPdfType = file.type === "application/pdf";
  const hasPdfExt = path.extname(file.name).toLowerCase() === ".pdf";
  if (!isPdfType && !hasPdfExt) {
    return NextResponse.json(
      { success: false, error: "Only PDF files are allowed" },
      { status: 400 }
    );
  }

  const maxBytes = 20 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { success: false, error: "PDF must be <= 20MB" },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "articles");
  await mkdir(uploadDir, { recursive: true });

  const filename = `article-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.pdf`;
  const absolutePath = path.join(uploadDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  return NextResponse.json({
    success: true,
    data: { url: `/uploads/articles/${filename}` },
  });
}
