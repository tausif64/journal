// server/dal/article.dal.ts
import type { ArticleStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildArticleSlug } from "@/lib/slug";

/**
 * Input used only inside DAL for creating ArticleAuthor rows.
 * We only need IDs + ordering + corresponding flag here.
 */
export type CreateArticleAuthorInput = {
  authorId: string;
  order: number;
  isCorresponding: boolean;
};

export const articleDAL = {
  /**
   * Create a new article with associated ArticleAuthor rows.
   */
  create: async (data: {
    title: string;
    abstract: string;
    fileUrl: string;
    keywords?: string | null;
    coverImage?: string | null;
    authors: CreateArticleAuthorInput[];
  }) => {
    const article = await prisma.article.create({
      data: {
        slug: buildArticleSlug(data.title, crypto.randomUUID().replace(/-/g, "")),
        title: data.title,
        abstract: data.abstract,
        fileUrl: data.fileUrl,
        keywords: data.keywords ?? null,
        coverImage: data.coverImage ?? null,
        authors: {
          create: data.authors.map((a) => ({
            authorId: a.authorId,
            authorOrder: a.order,
            isCorresponding: a.isCorresponding,
          })),
        },
      },
    });

    const nextSlug = buildArticleSlug(article.title, article.id);
    if (article.slug !== nextSlug) {
      return prisma.article.update({
        where: { id: article.id },
        data: { slug: nextSlug },
      });
    }

    return article;
  },

  /**
   * Find a single article by ID, with default includes:
   * - authors + each author's User (id, name, email)
   * - editor (id, name, email)
   * - reviews
   * - payment
   * - issue
   *
   * If you need a custom include later, you can extend this, but for now
   * we keep it simple for type safety.
   */
  findById: async (id: string) => {
    return prisma.article.findUnique({
      where: { id },
      include: {
        authors: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { authorOrder: "asc" },
        },
        editor: { select: { id: true, name: true, email: true } },
        reviews: true,
        payment: true,
        issue: true,
      },
    });
  },

  findBySlug: async (slug: string) => {
    return prisma.article.findUnique({
      where: { slug },
      include: {
        authors: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { authorOrder: "asc" },
        },
        editor: { select: { id: true, name: true, email: true } },
        reviews: true,
        payment: true,
        issue: {
          include: {
            volume: {
              select: {
                id: true,
                volumeNumber: true,
                year: true,
                journal: { select: { id: true, name: true, issn: true } },
              },
            },
          },
        },
      },
    });
  },

  findByPublicIdentifier: async (identifier: string) => {
    const bySlug = await articleDAL.findBySlug(identifier);
    if (bySlug) {
      return bySlug;
    }

    return articleDAL.findById(identifier);
  },

  /**
   * "My articles" by userId: all articles where this user is one of the authors.
   */
  findManyByAuthorUserId: async (
    userId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    return prisma.article.findMany({
      where: {
        authors: {
          some: { authorId: userId },
        },
      },
      include: {
        authors: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { authorOrder: "asc" },
        },
        editor: { select: { id: true, name: true } },
        issue: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },

  /**
   * Optional helper: find articles by an author's email.
   */
  findManyByAuthorEmail: async (
    email: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    return prisma.article.findMany({
      where: {
        authors: {
          some: {
            author: { email },
          },
        },
      },
      include: {
        authors: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { authorOrder: "asc" },
        },
        editor: { select: { id: true, name: true } },
        issue: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },

  /**
   * Update basic article fields (no author changes here).
   */
  update: async (
    id: string,
    data: Partial<{
      title: string;
      abstract: string;
      fileUrl: string;
      keywords: string | null;
      coverImage: string | null;
      slug: string;
    }>
  ) => {
    const nextData = { ...data };
    if (data.title && data.title.trim().length > 0) {
      const current = await prisma.article.findUnique({
        where: { id },
        select: { id: true },
      });

      if (current) {
        nextData.slug = buildArticleSlug(data.title, current.id);
      }
    }

    return prisma.article.update({
      where: { id },
      data: nextData,
    });
  },

  /**
   * Update article status (e.g. to REJECTED for withdrawal).
   */
  updateStatus: async (id: string, status: ArticleStatus) => {
    return prisma.article.update({
      where: { id },
      data: { status },
    });
  },

  /**
   * Assign an editor to an article.
   */
  assignEditor: async (id: string, editorId: string) => {
    return prisma.article.update({
      where: { id },
      data: { editorId },
    });
  },

  /**
   * List articles pending editor assignment / review.
   */
  listPendingAssignment: async (opts?: { take?: number; skip?: number }) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    return prisma.article.findMany({
      where: { status: "SUBMITTED" },
      include: {
        authors: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { authorOrder: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
      take,
      skip,
    });
  },
};
