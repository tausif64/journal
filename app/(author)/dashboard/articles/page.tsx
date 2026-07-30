"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { useUserArticles } from "@/hooks/use-user";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ArticleCardSkeleton from "@/components/article-card-skeleton";
import AutherArticleCard from "../_components/AuthorArticleCard";

const PAGE_SIZE = 10;

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = Number(searchParams.get("page") ?? "1") || 1;
  const page = Math.max(1, pageParam);

  const { articles, meta, isLoading } = useUserArticles({
    page,
    limit: PAGE_SIZE,
  });

  const hasPrev = meta.page > 1;
  const hasNext = meta.returned === meta.limit; // if fewer than limit → last page

  const goToPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    router.push(`/articles?${params.toString()}`);
  };

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
          <p className="text-sm text-muted-foreground">
            Loading your submissions…
          </p>
        </header>
        <ArticleCardSkeleton />
      </div>
    );
  }

  /* ---------- EMPTY ---------- */
  if (!articles || articles.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="text-center space-y-4">
          <p>
            You have no articles yet. Start by submitting your first article!
          </p>
          <Link href="/dashboard/submit" className={buttonVariants()}>
            Submit
          </Link>
        </CardContent>
      </Card>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
          <p className="text-sm text-muted-foreground">
            Page {meta.page} · showing up to {meta.limit} per page
          </p>
        </div>
      </header>

      {/* List */}
      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <AutherArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                href={hasPrev ? `/articles?page=${meta.page - 1}` : "#"}
                onClick={(e) => {
                  e.preventDefault();
                  if (hasPrev) goToPage(meta.page - 1);
                }}
                className={!hasPrev ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {meta.page}
              </PaginationLink>
            </PaginationItem>

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href={hasNext ? `/articles?page=${meta.page + 1}` : "#"}
                onClick={(e) => {
                  e.preventDefault();
                  if (hasNext) goToPage(meta.page + 1);
                }}
                className={!hasNext ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
