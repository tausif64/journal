import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const data = await prisma.testimonial.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ success: true, data });
}
