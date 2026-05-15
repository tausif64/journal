import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { article_status } from "@/lib/generated/prisma/client";
import { requireAdmin } from "../../../_lib/require-admin";

type ArticleStatusValue = (typeof article_status)[keyof typeof article_status];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = (await req.json()) as { status?: ArticleStatusValue };
  const status = body.status;

  if (!status || !Object.values(article_status).includes(status)) {
    return NextResponse.json(
      { success: false, error: "Invalid status" },
      { status: 400 }
    );
  }

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      editorId: true,
      issueId: true,
      issue: {
        select: {
          id: true,
          volumeId: true,
        },
      },
    },
  });

  if (!article) {
    return NextResponse.json(
      { success: false, error: "Article not found" },
      { status: 404 }
    );
  }

  if (
    article.status === article_status.PUBLISHED &&
    status !== article_status.PUBLISHED
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Published article status cannot be changed",
      },
      { status: 400 }
    );
  }

  if (status === article_status.PUBLISHED) {
    if (!article.editorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Assign an editor before publishing this article",
        },
        { status: 400 }
      );
    }

    if (!article.issueId || !article.issue || !article.issue.volumeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Assign issue and volume before publishing this article",
        },
        { status: 400 }
      );
    }
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ success: true, data: updatedArticle });
}
