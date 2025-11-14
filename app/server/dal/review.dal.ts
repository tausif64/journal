// server/dal/review.dal.ts
import type { Prisma } from "@/lib/generated/prisma/client";
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
    const payload: Prisma.ReviewUncheckedCreateInput = {
      articleId: data.articleId,
      reviewerId: data.reviewerId,
      comments: data.comments ?? "",
      recommendation: data.recommendation ?? "",
    };
    return prisma.review.create({ data: payload });
  },

  findByArticle: async (articleId: string) => {
    return prisma.review.findMany({
      where: { articleId },
      include: { reviewer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
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

  update: async (id: string, data: Partial<Prisma.ReviewUpdateInput>) => {
    return prisma.review.update({ where: { id }, data });
  },
};
