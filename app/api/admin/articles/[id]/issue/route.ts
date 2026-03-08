import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../../_lib/require-admin";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await req.json()) as { issueId?: string; volumeId?: string };
  const issueId = body.issueId;
  const volumeId = body.volumeId;

  if (!issueId || !volumeId) {
    return NextResponse.json(
      { success: false, error: "volumeId and issueId are required" },
      { status: 400 }
    );
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { id: true, volumeId: true },
  });

  if (!issue) {
    return NextResponse.json(
      { success: false, error: "Issue not found" },
      { status: 404 }
    );
  }

  if (issue.volumeId !== volumeId) {
    return NextResponse.json(
      {
        success: false,
        error: "Selected issue does not belong to selected volume",
      },
      { status: 400 }
    );
  }

  const article = await prisma.article.update({
    where: { id },
    data: { issueId },
  });

  return NextResponse.json({ success: true, data: article });
}
