import { Metadata } from "next";
import { BreadcrumbBanner } from "@/components/breadcrumb-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Banner from "@/components/banner";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Journal Articles - MACROJ Research Journal",
  description: "Explore the articles of the journal issue.",
};

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ journalId: string; volumeId: string; issueId: string }>;
}) {
  const { journalId, volumeId, issueId } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      volume: {
        include: {
          journal: true,
        },
      },
    },
  });

  if (
    !issue ||
    issue.volumeId !== volumeId ||
    issue.volume.journalId !== journalId
  ) {
    notFound();
  }

  const articles = await prisma.article.findMany({
    where: {
      issueId,
      status: "PUBLISHED",
    },
      include: {
        authors: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            authorOrder: "asc",
          },
        },
      issue: {
        include: {
          volume: {
            include: {
              journal: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <BreadcrumbBanner
        title={`${issue.volume.journal.name} - Volume ${issue.volume.volumeNumber} Issue ${issue.issueNumber} Articles`}
        subtitle="Explore the articles of this issue."
        image="https://placehold.co/1200x400/FF5733/FFFFFF.png"
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-center text-3xl font-semibold">Articles</h2>
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="flex h-full flex-col rounded-none transition-shadow hover:shadow-md"
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex-1 space-y-3">
                    <FileText className="h-6 w-6 text-amber-600" />

                    <h3 className="min-h-14 font-semibold text-slate-800 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="min-h-10 text-sm text-slate-600">
                      <strong>Authors:</strong>{" "}
                      {article.authors.length > 0
                        ? article.authors
                            .map(
                              (author) => author.user.name ?? author.user.email,
                            )
                            .join(", ")
                        : "Not available"}
                    </p>

                    <p className="min-h-[72px] line-clamp-3 text-sm text-slate-600">
                      {article.abstract}
                    </p>

                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        <strong>Year:</strong>{" "}
                        {article.issue?.volume.year ?? "N/A"}
                      </p>

                      <p>
                        <strong>Volume:</strong>{" "}
                        {article.issue?.volume.volumeNumber ?? "N/A"}
                      </p>

                      <p>
                        <strong>Issue:</strong>{" "}
                        {article.issue?.issueNumber ?? "N/A"}
                      </p>

                      <p className="line-clamp-1">
                        <strong>Journal:</strong>{" "}
                        {article.issue?.volume.journal.name ?? "N/A"}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <Button asChild className="mt-5 w-full">
                    <Link href={`/article/${article.slug ?? article.id}`}>
                      Read Article
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No published articles found for this issue.
          </p>
        )}
      </section>

      <Banner />
    </>
  );
}
