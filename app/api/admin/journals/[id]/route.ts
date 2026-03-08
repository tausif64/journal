import { NextResponse } from "next/server";
import { requireAdmin } from "../../_lib/require-admin";
import { journalDAL } from "@/app/server/dal/journal.dal";

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

  const payload = body as {
    name?: string;
    issn?: string;
    status?: "ACTIVE" | "INACTIVE";
  };

  if (payload.status && !["ACTIVE", "INACTIVE"].includes(payload.status)) {
    return NextResponse.json(
      { success: false, error: "Invalid journal status" },
      { status: 400 }
    );
  }

  const name = payload.name?.trim();
  const issn = payload.issn?.trim();
  if (!name || !issn) {
    return NextResponse.json(
      { success: false, error: "name and issn are required" },
      { status: 400 }
    );
  }

  try {
    const updated = await journalDAL.update(id, {
      name,
      issn,
      status: payload.status ?? "ACTIVE",
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update journal",
      },
      { status: 500 }
    );
  }
}
