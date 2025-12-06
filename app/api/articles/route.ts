// app/api/articles/route.ts
import {
  listMyArticlesController,
  submitArticleController,
} from "../../server/controllers/article.controller";

/**
 * GET  -> list user's articles (supports ?limit & ?page handled by controller)
 * POST -> submit article (JSON body expected)
 */

export async function GET(req: Request) {
  return listMyArticlesController(req);
}

export async function POST(req: Request) {
  return submitArticleController(req);
}
