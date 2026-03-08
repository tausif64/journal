import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userDAL } from "@/app/server/dal/user.dal";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
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

  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
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
      reviews: {
        include: {
          reviewer: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!article || article.editorId !== actor.id) {
    return NextResponse.json(
      { success: false, error: "Article not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: article });
}
