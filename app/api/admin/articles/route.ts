import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
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
    articles.map(({ user, issue, ...article }) => ({
      ...article,
      editor: user
        ? {
            id: user.id,
            name: user.name,
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
