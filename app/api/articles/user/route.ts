// app/api/articles/user/route.ts
import { NextRequest } from "next/server";
import {
  listMyArticlesController,
  submitArticleController,
  updateArticleController,
  withdrawArticleController,
} from "@/app/server/controllers/article.controller";

export async function GET(req: NextRequest) {
  return listMyArticlesController(req as unknown as Request);
}

export async function POST(req: NextRequest) {
  return submitArticleController(req as unknown as Request);
}

export async function PUT(req: NextRequest) {
  return updateArticleController(req as unknown as Request);
}

export async function DELETE(req: NextRequest) {
  return withdrawArticleController(req as unknown as Request);
}
