"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditorArticleDetail = {
  id: string;
  title: string;
  abstract: string;
  status: string;
  fileUrl: string;
  authors: Array<{
    authorOrder: number;
    author: { id: string; name: string | null; email: string };
  }>;
  reviews: Array<{
    id: string;
    comments: string;
    recommendation: string;
    reviewer: { id: string; name: string | null; email: string };
  }>;
};

type EditorArticleResponse = {
  success: boolean;
  data?: EditorArticleDetail;
  error?: string;
};

export default function EditorArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [recommendation, setRecommendation] = useState("");
  const [comments, setComments] = useState("");
  const qc = useQueryClient();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  const { data, isLoading, isError } = useQuery<EditorArticleDetail>({
    queryKey: ["editor-article", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await apiGet<EditorArticleResponse>(`/api/editor/articles/${id}`);
      if (!res.success || !res.data) throw new Error(res.error ?? "Not found");
      return res.data;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async () =>
      apiPost(`/api/editor/articles/${id}/review`, {
        recommendation: recommendation.trim(),
        comments: comments.trim(),
      }),
    onSuccess: () => {
      toast.success("Review saved");
      setRecommendation("");
      setComments("");
      void qc.invalidateQueries({ queryKey: ["editor-article", id] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to save review");
    },
  });

  if (isLoading) {
    return <div className="mx-auto max-w-5xl p-6">Loading article...</div>;
  }
  if (isError || !data) {
    return <div className="mx-auto max-w-5xl p-6 text-destructive">Article not found</div>;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Review Article</h1>
          <Button asChild variant="outline">
            <Link href="/editor">Back</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{data.abstract}</p>
            <div className="text-sm">
              <p className="font-medium">Authors</p>
              <p className="text-muted-foreground">
                {data.authors
                  .map((a) => `${a.author.name ?? a.author.email}`)
                  .join(", ")}
              </p>
            </div>
            <Button asChild>
              <a href={data.fileUrl} target="_blank" rel="noreferrer">
                Open Manuscript
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit / Update Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Recommendation <span className="text-destructive">*</span>
              </p>
              <Input
                placeholder="ACCEPT / REVISION / REJECT"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Review Comments <span className="text-destructive">*</span>
              </p>
              <Textarea
                rows={6}
                placeholder="Write your editorial review comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => reviewMutation.mutate()}
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? "Saving..." : "Save Review"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Existing Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {data.reviews.length ? (
              <div className="space-y-3">
                {data.reviews.map((r) => (
                  <div key={r.id} className="rounded-md border p-3">
                    <p className="text-sm font-medium">
                      {r.reviewer.name ?? r.reviewer.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.recommendation}
                    </p>
                    <p className="mt-2 text-sm">{r.comments}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
