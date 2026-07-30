// app/api/articles/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { articleService } from "../../../server/services/article.service";
import { headers } from "next/headers";

/**
 * GET  /api/articles/:id  -> get article for author
 * DELETE /api/articles/:id -> withdraw submission (author only)
 */

export async function GET(req: Request) {
  const url = new URL(req.url);
  // id is part of path; Next provides it via the pathname
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 1];

  try {
    const article = await articleService.getArticleById(
      id
    );
    return NextResponse.json({ data: article, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ success: false, error: message });
  }
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ success: false, error: "Unauthorized" });

  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 1];

  try {
    const result = await articleService.withdrawArticle(session.user.id, id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message });
  }
}
