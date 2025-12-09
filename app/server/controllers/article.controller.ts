// app/server/controllers/article.controller.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { articleService } from "../services/article.service";
import { z } from "zod";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * GET /api/articles/user
 * List articles where the current user is one of the authors.
 * Supports ?limit & ?page query params.
 */
export async function listMyArticlesController(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" }
    );
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const take = Math.min(100, Math.max(1, limit));
  const skip = Math.max(0, (page - 1) * take);

  const articles = await articleService.listMyArticles(session.user.id, {
    take,
    skip,
  });

  return NextResponse.json({
    success: true,
    data: articles,
    meta: { limit: take, page, returned: articles.length },
  });
}

/**
 * POST /api/articles/user
 * Submit a new article with 1–4 authors identified by email.
 */
const submitArticleBodySchema = z.object({
  title: z.string().min(1),
  abstract: z.string().min(1),
  fileUrl: z.string().min(1),
  keywords: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  authors: z
    .array(
      z.object({
        // Optional name & affiliation for UI; backend trusts email
        fullName: z.string().optional(),
        email: z.string().email(), // REQUIRED for lookup
        affiliation: z.string().optional(),
      })
    )
    .min(1)
    .max(4),
});

export async function submitArticleController(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
    );
  }

  const json = await req.json();
  const parsed = submitArticleBodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid payload" + parsed.error.flatten(),
      },
    );
  }

  const article = await articleService.submitArticle(
    session.user.id,
    parsed.data
  );

  return NextResponse.json({ success: true, data: article });
}

/**
 * PUT /api/articles/user
 * Body: { articleId, ...fieldsToUpdate }
 */
export async function updateArticleController(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
    );
  }

  const body = await req.json();
  const { articleId, ...data } = body ?? {};

  if (!articleId || typeof articleId !== "string") {
    return NextResponse.json(
      { success: false, error: "articleId is required" },
    );
  }

  const updated = await articleService.updateArticle(
    session.user.id,
    articleId,
    data
  );

  return NextResponse.json({ success: true, data: updated });
}

/**
 * DELETE /api/articles/user?articleId=...
 */
export async function withdrawArticleController(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
    );
  }

  const url = new URL(req.url);
  const articleId = url.searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json(
      { success: false, error: "articleId is required" },
    );
  }

  const result = await articleService.withdrawArticle(
    session.user.id,
    articleId
  );

  return NextResponse.json({ success: true, data: result });
}
