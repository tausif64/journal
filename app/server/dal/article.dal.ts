// server/dal/article.dal.ts
import { randomUUID } from "node:crypto";
import type { article_status } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildArticleSlug } from "@/lib/slug";

export type CreateArticleAuthorInput = {
  authorId: string;
  order: number;
  isCorresponding: boolean;
};

type ArticleAuthorRelation = {
  id: string;
  authorId: string;
  authorOrder: number;
  isCorresponding: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type ArticleReviewRelation = {
  id: string;
  articleId: string;
  reviewerId: string;
  comments: string;
  recommendation: string;
  createdAt: Date;
  user?: {
    id: string;
    name: string | null;
    email?: string;
  } | null;
};

type ArticleEditorRelation =
  | {
      id: string;
      name: string | null;
      email?: string;
    }
  | null
  | undefined;

type MappableArticle = {
  articleauthor?: ArticleAuthorRelation[];
  review?: ArticleReviewRelation[];
  user?: ArticleEditorRelation;
  issue?: unknown;
  payment?: unknown;
} & Record<string, unknown>;

function mapArticle<T extends MappableArticle>(article: T) {
  const {
    articleauthor = [],
    review = [],
    user,
    ...rest
  } = article;

  return {
    ...rest,
    authors: articleauthor.map((author) => ({
      id: author.id,
      authorId: author.authorId,
      authorOrder: author.authorOrder,
      isCorresponding: author.isCorresponding,
      author: author.user,
    })),
    editor: user ?? null,
    reviews: review.map((item) => ({
      ...item,
      reviewer: item.user ?? null,
    })),
  };
}

const authorInclude = {
  articleauthor: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      authorOrder: "asc" as const,
    },
  },
};

export const articleDAL = {
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
        id: randomUUID(),
        slug: buildArticleSlug(
          data.title,
          randomUUID().replace(/-/g, ""),
        ),
        title: data.title,
        abstract: data.abstract,
        fileUrl: data.fileUrl,
        keywords: data.keywords ?? null,
        coverImage: data.coverImage ?? null,
        articleauthor: {
          create: data.authors.map((author) => ({
            id: randomUUID(),
            authorId: author.authorId,
            authorOrder: author.order,
            isCorresponding: author.isCorresponding,
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

  findById: async (id: string) => {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        ...authorInclude,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        review: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        payment: true,
        issue: {
          include: {
            volume: {
              select: {
                id: true,
                volumeNumber: true,
                year: true,
                journal: {
                  select: {
                    id: true,
                    name: true,
                    issn: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return article ? mapArticle(article) : null;
  },

  findBySlug: async (slug: string) => {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        ...authorInclude,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        review: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        payment: true,
        issue: {
          include: {
            volume: {
              select: {
                id: true,
                volumeNumber: true,
                year: true,
                journal: {
                  select: {
                    id: true,
                    name: true,
                    issn: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return article ? mapArticle(article) : null;
  },

  findByPublicIdentifier: async (identifier: string) => {
    const bySlug = await articleDAL.findBySlug(identifier);
    if (bySlug) {
      return bySlug;
    }

    return articleDAL.findById(identifier);
  },

  findManyByAuthorUserId: async (
    userId: string,
    opts?: { take?: number; skip?: number },
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    const articles = await prisma.article.findMany({
      where: {
        articleauthor: {
          some: { authorId: userId },
        },
      },
      include: {
        ...authorInclude,
        user: { select: { id: true, name: true, email: true } },
        issue: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    return articles.map(mapArticle);
  },

  findManyByAuthorEmail: async (
    email: string,
    opts?: { take?: number; skip?: number },
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    const articles = await prisma.article.findMany({
      where: {
        articleauthor: {
          some: {
            user: { email },
          },
        },
      },
      include: {
        ...authorInclude,
        user: { select: { id: true, name: true, email: true } },
        issue: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    return articles.map(mapArticle);
  },

  update: async (
    id: string,
    data: Partial<{
      title: string;
      abstract: string;
      fileUrl: string;
      keywords: string | null;
      coverImage: string | null;
      slug: string;
    }>,
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

  updateStatus: async (id: string, status: article_status) => {
    return prisma.article.update({
      where: { id },
      data: { status },
    });
  },

  assignEditor: async (id: string, editorId: string) => {
    return prisma.article.update({
      where: { id },
      data: { editorId },
    });
  },

  listPendingAssignment: async (opts?: { take?: number; skip?: number }) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);

    const articles = await prisma.article.findMany({
      where: { status: "SUBMITTED" },
      include: {
        ...authorInclude,
      },
      orderBy: { createdAt: "asc" },
      take,
      skip,
    });

    return articles.map(mapArticle);
  },
};
