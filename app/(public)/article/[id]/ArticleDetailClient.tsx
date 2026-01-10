// app/articles/[id]/ArticleDetailClient.tsx
"use client";

import { useRouter } from "next/navigation";
import ArticleCard from "@/components/article-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArticleDetailSkeleton from "@/components/article-detail-skeleton";
import { useArticleById } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";



type Props = {
  articleId: string;
};

export default function ArticleDetailClient({ articleId }: Props) {
  const router = useRouter();

  const { article, isLoading, isError, error } = useArticleById(articleId);

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <ArticleDetailSkeleton />
    );
  }

  /* ---------- ERROR ---------- */
  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? "We couldn’t load this article."}
        </p>
        <Button onClick={() => router.push("/articles")}>
          Back to articles
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 p-4 space-y-6">
      {/* Header + basic info via reusable card */}
      <ArticleCard article={article} />

      {/* Meta row: submitted, updated, optional withdraw */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-6">

        {article.payment && (
          <>
            <span>·</span>
            <span>
              Payment:{" "}
              <Badge variant="outline" className="ml-1">
                {article.payment.status}
              </Badge>
            </span>
          </>
        )}
        {/* 
        {canWithdraw && (
          <>
            <span>·</span>
            <Button
              size="sm"
              variant="outline"
              disabled={withdrawMutation.isLoading}
              onClick={() => withdrawMutation.mutate()}
            >
              {withdrawMutation.isLoading
                ? "Withdrawing..."
                : "Withdraw submission"}
            </Button>
          </>
        )} */}
      </div>

      {/* Abstract + details */}
      <Card>
        <CardContent className="py-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Abstract</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {article.abstract}
            </p>
          </div>

          {article.keywords && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Keywords</h3>
              <p className="text-xs text-muted-foreground">
                {article.keywords}
              </p>
            </div>
          )}

          {article.editor && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Editor</h3>
              <p className="text-xs text-muted-foreground">
                {article.editor.name ?? article.editor.email}
              </p>
            </div>
          )}

          {article.payment && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Payment</h3>
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

      {/* PDF Viewer */}
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

        <div className="border rounded-lg overflow-hidden bg-muted">
          <object
            // data={article.fileUrl}
            data={"/sample.pdf"}
            type="application/pdf"
            className="w-full h-[520px] md:h-[850px]"
          />
        </div>
      </div>
    </div>
  );
}
