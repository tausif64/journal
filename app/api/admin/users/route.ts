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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // load full user record to get role and other metadata
  const actor = await userDAL.findById(session.user.id);
  if (!actor)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  try {
    const users = await adminService.listUsers(
      { role: actor.role },
      { take: 50, skip: 0 }
    );
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 403 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // load full user record to get role and other metadata
  const actor = await userDAL.findById(session.user.id);
  if (!actor)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (actor.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = body as Record<string, unknown>;

  if (payload.action === "createJournal") {
    const name = String(payload.name || "");
    const issn = String(payload.issn || "");
    if (!name || !issn)
      return NextResponse.json(
        { error: "Missing name or issn" },
        { status: 422 }
      );

    try {
      const journal = await adminService.createJournal(
        { role: actor.role },
        { name, issn }
      );
      return NextResponse.json(journal, { status: 201 });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Unknown error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
