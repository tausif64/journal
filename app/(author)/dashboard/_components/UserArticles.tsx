"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserArticles } from "@/hooks/use-user";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type SortOption =
  | "date-desc"
  | "date-asc"
  | "status"
  | "title-asc"
  | "title-desc";

export default function UserArticles() {
  const { articles, isLoading } = useUserArticles();
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const sortedArticles = useMemo(() => {
    if (!articles) return [];
    const copy = [...articles];

    const statusOrder = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "REVISION",
      "ACCEPTED",
      "REJECTED",
      "PUBLISHED",
    ];

    switch (sortBy) {
      case "date-asc":
        return copy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "date-desc":
        return copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "status":
        return copy.sort(
          (a, b) =>
            statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );

      case "title-asc":
        return copy.sort((a, b) => a.title.localeCompare(b.title));

      case "title-desc":
        return copy.sort((a, b) => b.title.localeCompare(a.title));

      default:
        return copy;
    }
  }, [articles, sortBy]);

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
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
    <div className="space-y-4 mt-8">
      {/* SORT */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Your Articles</h2>
        <div className="flex items-center gap-4">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="title-asc">Title (A → Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z → A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GRID */}
      <div className="space-y-4">
        {sortedArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <Badge
                  variant={
                    article.status === "PUBLISHED"
                      ? "secondary"
                      : article.status === "REJECTED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {article.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Submited: {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
