import { NextResponse } from "next/server";
import { journalDAL } from "@/app/server/dal/journal.dal";
import { adminService } from "@/app/server/services/admin.service";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const journals = await journalDAL.list({ take: 100, skip: 0 });
    return NextResponse.json({ success: true, data: journals });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load journals",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = (await req.json()) as {
    name?: string;
    issn?: string;
    status?: "ACTIVE" | "INACTIVE";
  };

  const name = body.name?.trim();
  const issn = body.issn?.trim();

  if (!name || !issn) {
    return NextResponse.json(
      { success: false, error: "name and issn are required" },
      { status: 400 }
    );
  }

  try {
    if (body.status && !["ACTIVE", "INACTIVE"].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid journal status" },
        { status: 400 }
      );
    }

    const created = await adminService.createJournal(
      { role: guard.actor.role },
      { name, issn, status: body.status ?? "ACTIVE" }
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create journal",
      },
      { status: 500 }
    );
  }
}
