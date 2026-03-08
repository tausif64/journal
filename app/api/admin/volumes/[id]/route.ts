import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../_lib/require-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const volume = await prisma.volume.findUnique({
    where: { id },
    include: {
      journal: {
        select: {
          id: true,
          name: true,
          issn: true,
        },
      },
      issues: {
        orderBy: { issueNumber: "desc" },
      },
    },
  });

  if (!volume) {
    return NextResponse.json(
      { success: false, error: "Volume not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: volume });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await req.json()) as {
    volumeNumber?: number;
    year?: number;
    coverImage?: string | null;
  };

  const volumeNumber = body.volumeNumber;
  const year = body.year;

  if (
    (volumeNumber !== undefined &&
      (!Number.isInteger(Number(volumeNumber)) || Number(volumeNumber) <= 0)) ||
    (year !== undefined && !Number.isInteger(Number(year)))
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid volumeNumber or year" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.volume.update({
      where: { id },
      data: {
        volumeNumber:
          volumeNumber !== undefined ? Number(volumeNumber) : undefined,
        year: year !== undefined ? Number(year) : undefined,
        coverImage: body.coverImage ?? undefined,
      },
      include: {
        journal: {
          select: { id: true, name: true, issn: true },
        },
        _count: {
          select: { issues: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update volume",
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
    await prisma.volume.delete({
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
            : "Failed to delete volume. Remove related data first.",
      },
      { status: 400 }
    );
  }
}
