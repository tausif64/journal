import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../_lib/require-admin";
import { adminService } from "@/app/server/services/admin.service";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const issues = await prisma.issue.findMany({
    include: {
      volume: {
        select: {
          id: true,
          volumeNumber: true,
        },
      },
    },
    orderBy: [{ volume: { volumeNumber: "desc" } }, { issueNumber: "desc" }],
  });

  return NextResponse.json({ success: true, data: issues });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = (await req.json()) as {
    issueNumber?: number; // optional; if provided it must match expected sequence
    volumeId?: string;
    publicationDate?: string | null;
    status?: "DRAFT" | "PUBLISHED";
    coverImage?: string | null;
  };

  const volumeId = body.volumeId;

  if (!volumeId) {
    return NextResponse.json(
      { success: false, error: "volumeId is required" },
      { status: 400 }
    );
  }

  if (body.status && !["DRAFT", "PUBLISHED"].includes(body.status)) {
    return NextResponse.json(
      { success: false, error: "Invalid issue status" },
      { status: 400 }
    );
  }

  try {
    const lastIssueForVolume = await prisma.issue.findFirst({
      where: { volumeId },
      orderBy: { issueNumber: "desc" },
      select: { issueNumber: true },
    });

    const expectedIssueNumber = (lastIssueForVolume?.issueNumber ?? 0) + 1;
    const requestedIssueNumber =
      body.issueNumber === undefined ? undefined : Number(body.issueNumber);

    if (
      requestedIssueNumber !== undefined &&
      (!Number.isInteger(requestedIssueNumber) ||
        requestedIssueNumber !== expectedIssueNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `For this volume, next issue must be ${expectedIssueNumber}`,
        },
        { status: 400 }
      );
    }

    const created = await adminService.createIssue(
      { role: guard.actor.role },
      {
        issueNumber: expectedIssueNumber,
        volumeId,
        publicationDate: body.publicationDate
          ? new Date(body.publicationDate)
          : null,
        status: body.status ?? "DRAFT",
        coverImage: body.coverImage ?? null,
      }
    );

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create issue",
      },
      { status: 500 }
    );
  }
}
