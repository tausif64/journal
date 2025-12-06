// app/server/services/review.service.ts
import { reviewDAL } from "../dal/review.dal";
import { articleDAL } from "../dal/article.dal";
import { userDAL } from "../dal/user.dal";
import { prisma } from "../../../lib/prisma";
import { NotFoundError, PermissionError } from "@/lib/errors";

/**
 * Review service:
 * - assign reviews (editor)
 * - submit review (reviewer)
 * - optionally update article status if business rules met
 */

export const reviewService = {
  assignReview: async (
    actor: { role: string },
    articleId: string,
    reviewerId: string
  ) => {
    if (!["EDITOR", "ADMIN"].includes(actor.role))
      throw new PermissionError("Insufficient permissions");
    const article = await articleDAL.findById(articleId);
    if (!article) throw new NotFoundError("Article not found");

    const reviewer = await userDAL.findById(reviewerId);
    if (!reviewer) throw new NotFoundError("Reviewer not found");
    if (reviewer.role !== "REVIEWER" && reviewer.role !== "ADMIN")
      throw new PermissionError("User is not a reviewer");

    // create Review row. You might also want to send notification/email here.
    return reviewDAL.create({
      articleId,
      reviewerId,
      comments: "",
      recommendation: "",
    });
  },

  submitReview: async (
    reviewerId: string,
    reviewId: string,
    payload: { comments: string; recommendation: string }
  ) => {
    // ensure review exists and belongs to reviewer
    const reviews = await reviewDAL.findAssignedForReviewer(reviewerId, {
      take: 1,
      skip: 0,
    });
    const match = reviews.find((r) => r.id === reviewId);
    if (!match) {
      // fallback: try fetching the review
      const r = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!r)
        throw new NotFoundError("Review not found or not assigned to reviewer");
      if (r.reviewerId !== reviewerId)
        throw new PermissionError("Not allowed to submit this review");
    }

    // update review row
    const updated = await reviewDAL.update(reviewId, {
      comments: payload.comments,
      recommendation: payload.recommendation,
    });

    // business rule: if all required reviews completed, update article status (example).
    // This is a simple rule — adapt to your workflow (e.g., count of reviewers, thresholds)
    await maybeUpdateArticleAfterReviews(updated.articleId);

    return updated;
  },

  getAssignedReviewsForReviewer: async (
    reviewerId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    return reviewDAL.findAssignedForReviewer(reviewerId, opts);
  },
};

async function maybeUpdateArticleAfterReviews(articleId: string) {
  // Example rule: if there are >=2 reviews with non-empty recommendation, mark article UNDER_REVIEW -> REVISION/ACCEPTED etc.
  const reviews = await reviewDAL.findByArticle(articleId);
  const completed = reviews.filter(
    (r) => r.recommendation && r.recommendation.trim().length > 0
  );
  if (completed.length >= 2) {
    // simple policy: mark UNDER_REVIEW -> REVISION
    await articleDAL.updateStatus(articleId, "REVISION");
  }
}
