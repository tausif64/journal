// server/dal/article.dal.ts
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const articleDAL = {
  create: async (data: {
    title: string;
    abstract: string;
    fileUrl: string;
    keywords?: string | null;
    authorId: string;
    coverImage?: string | null;
  }) => {
    // Use unchecked create if you prefer passing foreign keys directly:
    const payload: Prisma.ArticleUncheckedCreateInput = {
      title: data.title,
      abstract: data.abstract,
      fileUrl: data.fileUrl,
      keywords: data.keywords ?? null,
      authorId: data.authorId,
      coverImage: data.coverImage ?? null,
    };
    return prisma.article.create({ data: payload });
  },

  findById: async (id: string, opts?: { include?: Prisma.ArticleInclude }) => {
    return prisma.article.findUnique({
      where: { id },
      include: opts?.include ?? {
        author: { select: { id: true, name: true, email: true } },
        editor: { select: { id: true, name: true, email: true } },
        reviews: true,
        payment: true,
        issue: true,
      },
    });
  },

  findManyByAuthor: async (
    authorId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.article.findMany({
      where: { authorId },
      include: {
        editor: { select: { id: true, name: true } },
        issue: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },

  update: async (id: string, data: Partial<Prisma.ArticleUpdateInput>) => {
    return prisma.article.update({ where: { id }, data });
  },

  updateStatus: async (id: string, status: Prisma.ArticleUpdateInput["status"]) => {
    return prisma.article.update({ where: { id }, data: { status } });
  },

  assignEditor: async (id: string, editorId: string) => {
    return prisma.article.update({ where: { id }, data: { editorId } });
  },

  listPendingAssignment: async (opts?: { take?: number; skip?: number }) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.article.findMany({
      where: { status: "SUBMITTED" },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
      take,
      skip,
    });
  },
};
