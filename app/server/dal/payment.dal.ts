// server/dal/payment.dal.ts
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const paymentDAL = {
  create: async (data: {
    articleId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    status: string;
  }) => {
    const payload: Prisma.PaymentUncheckedCreateInput = {
      articleId: data.articleId,
      razorpayOrderId: data.razorpayOrderId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
    };
    return prisma.payment.create({ data: payload });
  },

  findByArticle: async (articleId: string) => {
    return prisma.payment.findUnique({ where: { articleId } });
  },

  updateStatus: async (id: string, status: string) => {
    return prisma.payment.update({ where: { id }, data: { status } });
  },

  listByAuthor: async (
    authorId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    const take = Math.min(100, Math.max(1, opts?.take ?? 20));
    const skip = Math.max(0, opts?.skip ?? 0);
    return prisma.payment.findMany({
      where: { article: { authorId } },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },
};
