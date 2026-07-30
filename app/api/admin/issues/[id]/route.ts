import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../_lib/require-admin";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await req.json()) as {
    issueNumber?: number;
    publicationDate?: string | null;
    status?: "DRAFT" | "PUBLISHED";
  };

  const issueNumber = body.issueNumber;
  const status = body.status;

  if (
    issueNumber !== undefined &&
    (!Number.isInteger(Number(issueNumber)) || Number(issueNumber) <= 0)
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid issueNumber" },
      { status: 400 }
    );
  }

  if (status && !["DRAFT", "PUBLISHED"].includes(status)) {
    return NextResponse.json(
      { success: false, error: "Invalid issue status" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.issue.update({
      where: { id },
      data: {
        issueNumber:
          issueNumber !== undefined ? Number(issueNumber) : undefined,
        publicationDate:
          body.publicationDate === undefined
            ? undefined
            : body.publicationDate
            ? new Date(body.publicationDate)
            : null,
        status: status ?? undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update issue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  try {
    await prisma.issue.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete issue. Remove related data first.",
      },
      { status: 400 }
    );
  }
}
