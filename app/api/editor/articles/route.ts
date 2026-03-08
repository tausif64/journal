import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userDAL } from "@/app/server/dal/user.dal";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const actor = await userDAL.findById(session.user.id);
  if (!actor || actor.role !== "EDITOR") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const articles = await prisma.article.findMany({
    where: { editorId: actor.id },
    include: {
      authors: {
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: { authorOrder: "asc" },
      },
      issue: {
        include: {
          volume: {
            select: { id: true, volumeNumber: true, year: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ success: true, data: articles });
}
