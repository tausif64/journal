import { NextResponse } from "next/server";
import { articleService } from "@/app/server/services/article.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await articleService.getPublishedArticleBySlug(slug);
    return NextResponse.json({ success: true, data: article });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 404 });
  }
}
