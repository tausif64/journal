import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../_lib/require-admin";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const payload = body as { status?: "PENDING" | "APPROVED" | "REJECTED" };
  if (!payload.status || !["PENDING", "APPROVED", "REJECTED"].includes(payload.status)) {
    return NextResponse.json(
      { success: false, error: "Invalid testimonial status" },
      { status: 400 }
    );
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      status: payload.status,
      approvedAt: payload.status === "APPROVED" ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
