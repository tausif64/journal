// app/server/controllers/article.controller.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { articleService } from "../services";
import { headers } from "next/headers";


function parsePositiveInt(value: string | null, fallback: number) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return NaN;
  return n;
}

/**
 * GET /api/articles?limit=20&page=1
 * - limit: number of items per page (default 20, max 100)
 * - page: page number (default 1)
 */
export async function listMyArticlesController(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const rawLimit = url.searchParams.get("limit");
  const rawPage = url.searchParams.get("page");

  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 100;

  const parsedLimit = parsePositiveInt(rawLimit, DEFAULT_LIMIT);
  const parsedPage = parsePositiveInt(rawPage, 1);

  if (!Number.isFinite(parsedLimit) || Number.isNaN(parsedLimit)) {
    return NextResponse.json(
      { error: "Invalid query: limit must be a positive integer" },
      { status: 400 }
    );
  }
  if (!Number.isFinite(parsedPage) || Number.isNaN(parsedPage)) {
    return NextResponse.json(
      { error: "Invalid query: page must be a positive integer" },
      { status: 400 }
    );
  }

  const limit = Math.min(MAX_LIMIT, parsedLimit);
  const page = Math.max(1, parsedPage);
  const take = limit;
  const skip = (page - 1) * take;

  try {
    const articles = await articleService.listMyArticles(session.user.id, {
      take,
      skip,
    });
    return NextResponse.json({
      data: articles,
      meta: {
        limit: take,
        page,
        returned: Array.isArray(articles) ? articles.length : 0,
      },
    });
  } catch (err) {
    // If you want more granular error handling, check error types (NotFoundError, PermissionError, etc.)
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/articles -> submit article (unchanged)
export async function submitArticleController(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Basic runtime checks (use Zod for production)
  const payload = body as Record<string, unknown>;
  if (!payload.title || !payload.abstract || !payload.fileUrl) {
    return NextResponse.json(
      { error: "Missing required fields: title, abstract, fileUrl" },
      { status: 422 }
    );
  }

  try {
    const article = await articleService.submitArticle(session.user.id, {
      title: String(payload.title),
      abstract: String(payload.abstract),
      fileUrl: String(payload.fileUrl),
      keywords: typeof payload.keywords === "string" ? payload.keywords : null,
      coverImage:
        typeof payload.coverImage === "string" ? payload.coverImage : null,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}