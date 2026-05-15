import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userDAL } from "@/app/server/dal/user.dal";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
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

  const { id: articleId } = await params;
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, editorId: true },
  });

  if (!article || article.editorId !== actor.id) {
    return NextResponse.json(
      { success: false, error: "Article not found" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const payload = body as { comments?: string; recommendation?: string };
  const comments = payload.comments?.trim() ?? "";
  const recommendation = payload.recommendation?.trim() ?? "";

  if (!comments || !recommendation) {
    return NextResponse.json(
      { success: false, error: "comments and recommendation are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.review.findFirst({
    where: { articleId, reviewerId: actor.id },
    select: { id: true },
  });

  const saved = existing
    ? await prisma.review.update({
        where: { id: existing.id },
        data: { comments, recommendation },
      })
    : await prisma.review.create({
        data: {
          id: randomUUID(),
          articleId,
          reviewerId: actor.id,
          comments,
          recommendation,
        },
      });

  return NextResponse.json({ success: true, data: saved });
}
