import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";

type GuardSuccess = {
  ok: true;
  actor: NonNullable<Awaited<ReturnType<typeof userDAL.findById>>>;
};

type GuardFailure = {
  ok: false;
  response: NextResponse;
};

export async function requireAdmin(): Promise<GuardSuccess | GuardFailure> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const actor = await userDAL.findById(session.user.id);

  if (!actor) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      ),
    };
  }

  if (actor.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { ok: true, actor };
}
