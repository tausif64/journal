import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../_lib/require-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;


  const article = await prisma.article.findUnique({
    where: { id: id },
    include: {
      authors: {
        orderBy: { authorOrder: "asc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      editor: {
        select: { id: true, name: true, email: true },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      issue: {
        include: {
          volume: {
            select: { id: true, volumeNumber: true },
          },
        },
      },
      payment: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const { authors, editor, reviews, ...rest } = article;

  return NextResponse.json({
    ...rest,
    authors: authors.map((author) => ({
      id: author.id,
      authorId: author.authorId,
      authorOrder: author.authorOrder,
      isCorresponding: author.isCorresponding,
      author: author.user,
    })),
    editor: editor ?? null,
    reviews: reviews.map((item) => ({
      ...item,
      reviewer: item.user,
    })),
  });
}
