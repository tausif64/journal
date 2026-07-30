import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Role = "AUTHOR" | "EDITOR" | "ADMIN";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; role?: Role };
    const email = body.email?.trim().toLowerCase();
    const role = body.role;

    if (!email || !role) {
      return NextResponse.json(
        { success: false, allowed: false, error: "email and role are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ success: true, allowed: true });
    }

    if (user.role !== role) {
      return NextResponse.json({
        success: false,
        allowed: false,
        error: `This section does not allow ${user.role.toLowerCase()} accounts.`,
      });
    }

    return NextResponse.json({ success: true, allowed: true });
  } catch {
    return NextResponse.json(
      { success: false, allowed: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
