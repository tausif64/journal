import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminService } from "@/app/server/services/admin.service";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const volumes = await prisma.volume.findMany({
      include: {
        journal: {
          select: {
            id: true,
            name: true,
            issn: true,
          },
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { volumeNumber: "desc" }],
    });

    return NextResponse.json({ success: true, data: volumes });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load volumes",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = (await req.json()) as {
    journalId?: string;
    volumeNumber?: number; // optional; if provided it must match expected sequence
    year?: number;
    coverImage?: string | null;
  };

  const journalId = body.journalId;
  const year = Number(body.year);

  if (!journalId || !Number.isInteger(year)) {
    return NextResponse.json(
      {
        success: false,
        error: "journalId and year are required",
      },
      { status: 400 }
    );
  }

  try {
    const lastVolumeForYear = await prisma.volume.findFirst({
      where: { year },
      orderBy: { volumeNumber: "desc" },
      select: { volumeNumber: true },
    });

    const expectedVolumeNumber = (lastVolumeForYear?.volumeNumber ?? 0) + 1;
    const requestedVolumeNumber =
      body.volumeNumber === undefined ? undefined : Number(body.volumeNumber);

    if (
      requestedVolumeNumber !== undefined &&
      (!Number.isInteger(requestedVolumeNumber) ||
        requestedVolumeNumber !== expectedVolumeNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `For year ${year}, next volume must be ${expectedVolumeNumber}`,
        },
        { status: 400 }
      );
    }

    const created = await adminService.createVolume(
      { role: guard.actor.role },
      {
        journalId,
        volumeNumber: expectedVolumeNumber,
        year,
        coverImage: body.coverImage ?? null,
      }
    );

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create volume",
      },
      { status: 500 }
    );
  }
}
