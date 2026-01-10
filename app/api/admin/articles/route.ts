import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

export async function GET() {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });

  //   if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

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
