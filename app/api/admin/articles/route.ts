import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      editor: {
        select: { id: true, name: true },
      },
      issue: {
        select: {
          id: true,
          issueNumber: true,
          volume: {
            select: { volumeNumber: true },
          },
        },
      },
    },
  });

  return NextResponse.json(
    articles.map((a) => ({
      ...a,
      issue: a.issue
        ? {
            id: a.issue.id,
            issueNumber: a.issue.issueNumber,
            volumeNumber: a.issue.volume.volumeNumber,
          }
        : null,
    }))
  );
}
