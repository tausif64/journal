// app/server/services/article.service.ts
import { articleDAL } from "../dal/article.dal";
import { userDAL } from "../dal/user.dal";
import { NotFoundError, PermissionError } from "@/lib/errors";
import type { ArticleCreateDTO } from "@/types/dto";

export const articleService = {
  /**
   * List articles where the current user is one of the authors.
   */
  listMyArticles: (userId: string, opts?: { take?: number; skip?: number }) =>
    articleDAL.findManyByAuthorUserId(userId, opts),

  getArticleById: (id: string) => articleDAL.findById(id),
  getPublishedArticleBySlug: async (slug: string) => {
    const article = await articleDAL.findByPublicIdentifier(slug);
    if (!article || article.status !== "PUBLISHED") {
      throw new NotFoundError("Article not found");
    }
    return article;
  },

  /**
   * Submit a new multi-author article.
   * - Authors are provided by email in the payload.
   * - We resolve emails to User IDs (authorId).
   * - We enforce 1–4 authors.
   * - We enforce that the submitting user is one of the authors.
   */
  submitArticle: async (userId: string, payload: ArticleCreateDTO) => {
    const { authors, ...articleData } = payload;

    if (!authors || authors.length < 1 || authors.length > 4) {
      throw new Error("Articles must have between 1 and 4 authors");
    }

    const resolvedAuthors: {
      authorId: string;
      order: number;
      isCorresponding: boolean;
    }[] = [];

    for (let i = 0; i < authors.length; i++) {
      const raw = authors[i];
      const email = raw.email.trim().toLowerCase();

      const user = await userDAL.findByEmail(email);
      if (!user) {
        throw new Error(
          `Author with email "${email}" must register an account before being added.`
        );
      }

      resolvedAuthors.push({
        authorId: user.id,
        order: i + 1,
        isCorresponding: i === 0, // first author is corresponding
      });
    }

    const isSubmittingAuthor = resolvedAuthors.some(
      (a) => a.authorId === userId
    );
    if (!isSubmittingAuthor) {
      throw new PermissionError(
        "You must be one of the authors to submit this article"
      );
    }

    const article = await articleDAL.create({
      title: articleData.title,
      abstract: articleData.abstract,
      fileUrl: articleData.fileUrl,
      keywords: articleData.keywords ?? null,
      coverImage: articleData.coverImage ?? null,
      authors: resolvedAuthors,
    });

    return article;
  },

  /**
   * Update basic article fields (not authors).
   */
  updateArticle: async (
    userId: string,
    articleId: string,
    data: {
      title?: string;
      abstract?: string;
      fileUrl?: string;
      keywords?: string | null;
      coverImage?: string | null;
    }
  ) => {
    const article = await articleDAL.findById(articleId);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    const isAuthor = article.authors.some((aa) => aa.authorId === userId);
    if (!isAuthor) {
      throw new PermissionError("You are not an author of this article");
    }

    if (article.status === "PUBLISHED") {
      throw new PermissionError("Cannot update a published article");
    }

    return articleDAL.update(articleId, data);
  },

  /**
   * Withdraw an article (e.g. mark as REJECTED).
   */
  withdrawArticle: async (userId: string, articleId: string) => {
    const article = await articleDAL.findById(articleId);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    const isAuthor = article.authors.some((aa) => aa.authorId === userId);
    if (!isAuthor) {
      throw new PermissionError("You are not an author of this article");
    }

    if (article.status === "PUBLISHED") {
      throw new PermissionError("Cannot withdraw a published article");
    }

    return articleDAL.updateStatus(articleId, "REJECTED");
  },

  // Helper methods (for admin/editor)
  findArticleById: (id: string) => articleDAL.findById(id),

  assignEditor: (articleId: string, editorId: string) =>
    articleDAL.assignEditor(articleId, editorId),

  listPendingAssignment: (opts?: { take?: number; skip?: number }) =>
    articleDAL.listPendingAssignment(opts),
};
