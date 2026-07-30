import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
    take: 30,
  });

  return NextResponse.json({ success: true, data: testimonials });
}
