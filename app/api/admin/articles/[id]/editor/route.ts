import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../../_lib/require-admin";
import { userDAL } from "@/app/server/dal/user.dal";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await req.json()) as { editorId?: string };
  const editorId = body.editorId;

  if (!editorId || typeof editorId !== "string") {
    return NextResponse.json(
      { success: false, error: "editorId is required" },
      { status: 400 }
    );
  }

  const editor = await userDAL.findById(editorId);
  if (!editor) {
    return NextResponse.json(
      { success: false, error: "Editor not found" },
      { status: 404 }
    );
  }

  if (editor.role !== "EDITOR") {
    return NextResponse.json(
      { success: false, error: "Selected user is not an editor" },
      { status: 400 }
    );
  }

  const article = await prisma.article.update({
    where: { id },
    data: { editorId },
  });

  return NextResponse.json({ success: true, data: article });
}
