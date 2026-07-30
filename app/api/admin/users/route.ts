import { NextResponse } from "next/server";
import { adminService } from "../../../server/services/admin.service";
import { userDAL } from "../../../server/dal/user.dal";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const users = await adminService.listUsers({ role: guard.actor.role }, { take: 50, skip: 0 });
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  } 

  const payload = body as Record<string, unknown>;

  if (payload.action === "createJournal") {
    const name = String(payload.name || "");
    const issn = String(payload.issn || "");
    if (!name || !issn)
      return NextResponse.json(
        { success: false, error: "Missing name or issn" },
        { status: 400 }
      );

    try {
      const journal = await adminService.createJournal(
        { role: guard.actor.role },
        { name, issn }
      );
      return NextResponse.json({ success: true, data: journal }, { status: 201 });
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: "Invalid action" },
    { status: 400 }
  );
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const payload = body as { userId?: string; role?: string };
  const userId = String(payload.userId ?? "").trim();
  const role = String(payload.role ?? "").trim().toUpperCase();

  if (!userId || !role) {
    return NextResponse.json(
      { success: false, error: "userId and role are required" },
      { status: 400 }
    );
  }

  if (!["AUTHOR", "REVIEWER", "EDITOR", "ADMIN"].includes(role)) {
    return NextResponse.json(
      { success: false, error: "Invalid role" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await userDAL.setRole(userId, role as "AUTHOR" | "REVIEWER" | "EDITOR" | "ADMIN");
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
