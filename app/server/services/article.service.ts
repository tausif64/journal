// app/server/services/article.service.ts
import type { Prisma } from "../../../lib/generated/prisma/client";
import { articleDAL } from "../dal/article.dal";
import { userDAL } from "../dal/user.dal";
import { reviewDAL } from "../dal/review.dal";
import { prisma } from "../../../lib/prisma";
import { NotFoundError, PermissionError } from "@/lib/errors";

/**
 * Article service:
 * - business rules for authors, editors and publishing flows
 * - multi-step operations use prisma.$transaction
 */

export const articleService = {
  listMyArticles: async (
    userId: string,
    opts?: { take?: number; skip?: number }
  ) => {
    return articleDAL.findManyByAuthor(userId, opts);
  },

  submitArticle: async (
    userId: string,
    payload: {
      title: string;
      abstract: string;
      fileUrl: string;
      keywords?: string | null;
      coverImage?: string | null;
      journalId?: string | null;
    }
  ) => {
    const user = await userDAL.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    if (user.banned)
      throw new PermissionError("Banned users cannot submit articles");

    // Use unchecked create input in DAL; here we could add additional validation.
    return articleDAL.create({
      title: payload.title,
      abstract: payload.abstract,
      fileUrl: payload.fileUrl,
      keywords: payload.keywords ?? null,
      authorId: userId,
      coverImage: payload.coverImage ?? null,
    });
  },

  getArticleForAuthor: async (userId: string, articleId: string) => {
    const article = await articleDAL.findById(articleId);
    if (!article) throw new NotFoundError("Article not found");
    if (article.authorId !== userId)
      throw new PermissionError("Not allowed to view this article");
    return article;
  },

  getArticleForEditor: async (editorId: string, articleId: string) => {
    const article = await articleDAL.findById(articleId);
    if (!article) throw new NotFoundError("Article not found");
    // editors should either be assigned or have elevated role check externally
    if (article.editorId && article.editorId !== editorId) {
      throw new PermissionError("Not the assigned editor");
    }
    return article;
  },

  assignEditor: async (
    actor: { id: string; role: string },
    articleId: string,
    editorId: string
  ) => {
    // Only EDITOR or ADMIN should be able to assign editors (business decision).
    if (!["EDITOR", "ADMIN"].includes(actor.role))
      throw new PermissionError("Insufficient permissions");

    // ensure article exists and editor is a user with role EDITOR
    const article = await articleDAL.findById(articleId);
    if (!article) throw new NotFoundError("Article not found");

    const editor = await userDAL.findById(editorId);
    if (!editor) throw new NotFoundError("Editor user not found");
    if (editor.role !== "EDITOR" && editor.role !== "ADMIN")
      throw new PermissionError("User is not an editor");

    return articleDAL.assignEditor(articleId, editorId);
  },

  listPendingAssignment: async (
    actor: { role: string },
    opts?: { take?: number; skip?: number }
  ) => {
    if (!["EDITOR", "ADMIN"].includes(actor.role))
      throw new PermissionError("Insufficient permissions");
    return articleDAL.listPendingAssignment(opts);
  },

  /**
   * Publish an article into an issue (atomic)
   * - set article.issueId and change status to PUBLISHED
   */
  publishArticleToIssue: async (
    actor: { role: string },
    articleId: string,
    issueId: string
  ) => {
    if (!["EDITOR", "ADMIN"].includes(actor.role))
      throw new PermissionError("Insufficient permissions");
    // perform transaction: update article and optionally update issue relationships
    return prisma.$transaction(async (tx) => {
      // verify article exists
      const art = await tx.article.findUnique({ where: { id: articleId } });
      if (!art) throw new NotFoundError("Article not found");

      const updated = await tx.article.update({
        where: { id: articleId },
        data: {
          issueId,
          status: "PUBLISHED" as Prisma.ArticleUpdateInput["status"],
        },
      });

      // optionally: reorder/update issue metadata here

      return updated;
    });
  },

  /**
   * If you need to withdraw a submission (author-only)
   */
  withdrawSubmission: async (userId: string, articleId: string) => {
    const article = await articleDAL.findById(articleId);
    if (!article) throw new NotFoundError("Article not found");
    if (article.authorId !== userId)
      throw new PermissionError("Not allowed to withdraw this article");

    // Only allow withdraw if not yet published
    if (article.status === "PUBLISHED")
      throw new PermissionError("Cannot withdraw published article");

    return articleDAL.update(articleId, { status: "REJECTED" }); // or custom WITHDRAWN state
  },

  // Helper: fetch article reviews
  getReviewsForArticle: async (articleId: string) => {
    return reviewDAL.findByArticle(articleId);
  },
};
