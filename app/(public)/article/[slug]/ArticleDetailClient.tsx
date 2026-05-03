"use client";

import { useRouter } from "next/navigation";
import ArticleCard from "@/components/article-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArticleDetailSkeleton from "@/components/article-detail-skeleton";
import { usePublishedArticleBySlug } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";

type Props = {
  articleSlug: string;
};

export default function ArticleDetailClient({ articleSlug }: Props) {
  const router = useRouter();
  const { article, isLoading, isError, error } = usePublishedArticleBySlug(articleSlug);

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (isError || !article) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? "We could not load this article."}
        </p>
        <Button onClick={() => router.push("/publications/articles")}>
          Back to articles
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 py-8">
      <ArticleCard article={article} />

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {article.payment && (
          <>
            <span>·</span>
            <span>
              Payment:
              <Badge variant="outline" className="ml-1">
                {article.payment.status}
              </Badge>
            </span>
          </>
        )}
      </div>

      <Card>
        <CardContent className="space-y-4 py-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Abstract</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {article.abstract}
            </p>
          </div>

          {article.keywords && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Keywords</h3>
              <p className="text-xs text-muted-foreground">{article.keywords}</p>
            </div>
          )}

          {article.editor && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Editor</h3>
              <p className="text-xs text-muted-foreground">
                {article.editor.name ?? article.editor.email}
              </p>
            </div>
          )}

          {article.payment && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Payment</h3>
              <p className="text-xs text-muted-foreground">
                Status: {article.payment.status}
                {article.payment.amount != null && article.payment.currency && (
                  <>
                    {" "}
                    · {article.payment.amount} {article.payment.currency}
                  </>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Article PDF</h2>
          <a
            href={article.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            Open in new tab
          </a>
        </div>

        <div className="overflow-hidden rounded-lg border bg-muted">
          <object
            data={article.fileUrl}
            type="application/pdf"
            className="h-[520px] w-full md:h-[850px]"
          />
        </div>
      </div>
    </div>
  );
}
