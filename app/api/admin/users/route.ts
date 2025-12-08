// app/api/admin/users/route.ts
import { headers } from "next/headers";
import { auth } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import { adminService } from "../../../server/services/admin.service";
import { userDAL } from "../../../server/dal/user.dal";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ success: false, error: "Unauthorized" });

  // load full user record to get role and other metadata
  const actor = await userDAL.findById(session.user.id);
  if (!actor)
    return NextResponse.json({ success: false, error: "User not found" });

  try {
    const users = await adminService.listUsers(
      { role: actor.role },
      { take: 50, skip: 0 }
    );
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },

    );
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ success: false, error: "Unauthorized" });

  // load full user record to get role and other metadata
  const actor = await userDAL.findById(session.user.id);
  if (!actor)
    return NextResponse.json({ success: false, error: "User not found" });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" });
  }

  if (actor.role !== "ADMIN")
    return NextResponse.json({ success: false, error: "Forbidden" });

  const payload = body as Record<string, unknown>;

  if (payload.action === "createJournal") {
    const name = String(payload.name || "");
    const issn = String(payload.issn || "");
    if (!name || !issn)
      return NextResponse.json(
        { success: false, error: "Missing name or issn" }
      );

    try {
      const journal = await adminService.createJournal(
        { role: actor.role },
        { name, issn }
      );
      return NextResponse.json({ success: false, data: journal });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  }

  return NextResponse.json({ success: false, error: "Invalid action" });
}
