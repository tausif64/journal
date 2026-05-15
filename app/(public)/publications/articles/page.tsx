import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 9;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const suffix = q ? `Search: "${q}"` : "All Published Articles";
  return {
    title: `${suffix} | MACROJ`,
    description:
      q.length > 0
        ? `Browse published MACROJ articles matching "${q}" (page ${page}).`
        : `Browse all published MACROJ research articles with pagination.`,
    alternates: {
      canonical: `/publications/articles${q || page > 1 ? `?q=${encodeURIComponent(q)}&page=${page}` : ""}`,
    },
  };
}

export default async function PublishedArticlesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    status: "PUBLISHED" as const,
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { abstract: { contains: query } },
            { keywords: { contains: query } },
          ],
        }
      : {}),
  };

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: {
        articleauthor: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { authorOrder: "asc" },
        },
        issue: {
          include: {
            volume: {
              include: {
                journal: {
                  select: { name: true, issn: true, status: true },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const pageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/publications/articles${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <BreadcrumbBanner
        title="Published Articles"
        subtitle="Search and browse all published research articles from MACROJ."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <form action="/publications/articles" className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search published articles by title, abstract, keywords..."
              className="sm:flex-1"
            />
            <Button type="submit">Search</Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Search works on published articles only.
          </p>
        </form>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Results</h2>
          <Badge variant="outline">{total} published articles</Badge>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="rounded-none">
                <CardContent className="space-y-3 p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold">{article.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {article.abstract}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.articleauthor
                      .map((a) => a.user.name ?? a.user.email)
                      .join(", ")}
                  </p>
                  {article.issue ? (
                    <p className="text-xs text-muted-foreground">
                      {article.issue.volume.journal.name} • Vol{" "}
                      {article.issue.volume.volumeNumber} ({article.issue.volume.year}) •
                      Issue {article.issue.issueNumber}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Issue not assigned</p>
                  )}
                  <Button asChild size="sm">
                    <Link href={`/article/${article.slug ?? article.id}`}>Read Article</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-10 text-center text-muted-foreground">
            No published articles found.
          </div>
        )}

        <div className="mt-8 flex items-center justify-end gap-2">
          {prevPage ? (
            <Button asChild variant="outline">
              <Link href={pageUrl(prevPage)}>Previous</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Previous
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          {nextPage ? (
            <Button asChild variant="outline">
              <Link href={pageUrl(nextPage)}>Next</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
