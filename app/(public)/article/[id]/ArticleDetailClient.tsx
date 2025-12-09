// app/articles/[id]/ArticleDetailClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import ArticleCard from "@/components/article-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ApiResponse } from "@/types/dto";

type ArticleAuthorDTO = {
  authorOrder: number;
  isCorresponding: boolean;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

type ArticleDetailForView = {
  id: string;
  title: string;
  abstract: string;
  fileUrl: string;
  coverImage: string | null;
  keywords: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;

  authors: ArticleAuthorDTO[];

  editor: {
    id: string;
    name: string | null;
    email: string;
  } | null;

  issue: {
    id: string;
    issueNumber: number;
    volumeId?: string;
  } | null;

  payment: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  } | null;
};

type Props = {
  articleId: string;
};

export default function ArticleDetailClient({ articleId }: Props) {
  const router = useRouter();

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery<ArticleDetailForView, Error>({
    queryKey: ["articleDetail", articleId],
    queryFn: async () => {
      // 👇 IMPORTANT: type the response as ApiResponse<ArticleDetailForView>
      const res = await apiGet<ApiResponse<ArticleDetailForView>>(
        `/api/articles/${articleId}`
      );

      if (!res.success) {
        throw new Error(res.error || "Failed to load article");
      }

      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-6">
        <header>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </header>

        <Card>
          <CardContent className="flex gap-4 py-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-72 w-full" />
      </div>
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

  const updatedDate = new Date(article.updatedAt).toLocaleDateString();

  return (
    <div className="max-w-6xl mx-auto py-8 p-4 space-y-6">
      {/* Header + basic info via reusable card */}
      <ArticleCard article={article} />

      {/* Meta row: submitted, updated, optional withdraw */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-6">
        {article.issue && (
          <>
            <span>·</span>
            <span>
              Issue:{" "}
              <Badge variant="outline" className="ml-1">
                #{article.issue.issueNumber}
              </Badge>
            </span>
          </>
        )}
        <span>Last updated: {updatedDate}</span>

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
