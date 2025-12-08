// app/api/articles/route.ts

import { listMyArticlesController, submitArticleController } from "@/app/server/controllers";

export async function GET(req: Request) {
  return listMyArticlesController(req);
}

export async function POST(req: Request) {
  return submitArticleController(req);
}
