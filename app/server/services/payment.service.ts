// app/server/services/payment.service.ts
import { randomUUID } from "node:crypto";
import { paymentDAL } from "../dal/payment.dal";
import { articleDAL } from "../dal/article.dal";
import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "@/lib/errors";
/**
 * Payment service — record payments and update article state atomically.
 * Razorpay / payment gateway orchestration (creating orders, webhooks) is
 * expected to be handled in controllers or separate integration layer.
 */

export const paymentService = {
  /**
   * Record a successful payment and accept article in one transaction.
   * Returns the created payment record.
   */
  recordSuccessfulPaymentAndAccept: async (payload: {
    articleId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  }) => {
    // Validate article exists
    const article = await articleDAL.findById(payload.articleId);
    if (!article) throw new NotFoundError("Article not found");

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          id: randomUUID(),
          articleId: payload.articleId,
          razorpayOrderId: payload.razorpayOrderId,
          amount: payload.amount,
          currency: payload.currency,
          status: "paid",
        },
      });

      await tx.article.update({
        where: { id: payload.articleId },
        data: { status: "ACCEPTED" },
      });

      return payment;
    });
  },

  getPaymentByArticle: async (articleId: string) => {
    return paymentDAL.findByArticle(articleId);
  },

  listPaymentsForAuthor: async (
    authorId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    return paymentDAL.listByAuthor(authorId, opts);
  },

  markPaymentFailed: async (paymentId: string) => {
    return paymentDAL.updateStatus(paymentId, "failed");
  },
};
