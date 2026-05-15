// server/dal/review.dal.ts
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * We use UncheckedCreate so we can pass articleId & reviewerId directly.
 * Prisma types require non-optional strings for comments/recommendation if your schema declares them non-nullable.
 * We default undefined -> "" to satisfy type constraints.
 */

export const reviewDAL = {
  create: async (data: {
    articleId: string;
    reviewerId: string;
    comments?: string;
    recommendation?: string;
  }) => {
    const payload = {
      id: randomUUID(),
      articleId: data.articleId,
      reviewerId: data.reviewerId,
      comments: data.comments ?? "",
      recommendation: data.recommendation ?? "",
    };
    return prisma.review.create({ data: payload });
  },

  findByArticle: async (articleId: string) => {
    const reviews = await prisma.review.findMany({
      where: { articleId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });

    return reviews.map(({ user, ...review }) => ({
      ...review,
      reviewer: user,
    }));
  },

  findAssignedForReviewer: async (
    reviewerId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.review.findMany({
      where: { reviewerId },
      include: { article: true },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },

  update: async (
    id: string,
    data: Partial<{ comments: string; recommendation: string }>
  ) => {
    return prisma.review.update({ where: { id }, data });
  },
};
