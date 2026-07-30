import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Role = "AUTHOR" | "EDITOR" | "ADMIN";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { token?: string; role?: Role };
    const token = body.token?.trim();
    const role = body.role;

    if (!token || !role) {
      return NextResponse.json(
        { success: false, allowed: false, error: "token and role are required" },
        { status: 400 }
      );
    }

    const verification = await prisma.verification.findFirst({
      where: { identifier: `reset-password:${token}` },
      select: { value: true, expiresAt: true },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, allowed: false, error: "Invalid reset token" },
        { status: 400 }
      );
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, allowed: false, error: "Reset token expired" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: verification.value },
      select: { role: true },
    });

    if (!user || user.role !== role) {
      return NextResponse.json(
        {
          success: false,
          allowed: false,
          error: "This reset link is not valid for this section.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, allowed: true });
  } catch {
    return NextResponse.json(
      { success: false, allowed: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
