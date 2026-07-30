import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const data = await prisma.testimonial.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const payload = body as { quote?: string; designation?: string; imageUrl?: string };
  const quote = payload.quote?.trim();
  const designation = payload.designation?.trim() ?? "";
  const imageUrl = payload.imageUrl?.trim() ?? "";

  if (!quote || quote.length < 10) {
    return NextResponse.json(
      { success: false, error: "Quote must be at least 10 characters" },
      { status: 400 }
    );
  }

  const existingPending = await prisma.testimonial.count({
    where: { userId: session.user.id, status: "PENDING" },
  });

  if (existingPending >= 3) {
    return NextResponse.json(
      {
        success: false,
        error: "You already have pending testimonials. Please wait for review.",
      },
      { status: 400 }
    );
  }

  const created = await prisma.testimonial.create({
    data: {
      id: randomUUID(),
      quote,
      designation: designation || null,
      imageUrl: imageUrl || null,
      userId: session.user.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
