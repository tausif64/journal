import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

console.log(params);

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      authors: {
        orderBy: { authorOrder: "asc" },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      editor: {
        select: { id: true, name: true, email: true },
      },
      reviews: {
        include: {
          reviewer: {
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

  return NextResponse.json(article);
}
