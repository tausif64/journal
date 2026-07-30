import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      editor: {
        select: { id: true, name: true },
      },
      issue: {
        include: {
          volume: {
            select: { volumeNumber: true },
          },
        },
      },
    },
  });

  return NextResponse.json(
    articles.map(({ editor, issue, ...article }) => ({
      ...article,
      editor: editor
        ? {
            id: editor.id,
            name: editor.name,
          }
        : null,
      issue: issue
        ? {
            id: issue.id,
            issueNumber: issue.issueNumber,
            volumeNumber: issue.volume.volumeNumber,
          }
        : null,
    })),
  );
}
