// components/article-card.tsx
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-user";
import Link from "next/link";

type ArticleAuthorDTO = {
  authorOrder: number;
  isCorresponding: boolean;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

type ArticleEditorDTO = {
  id: string;
  name: string | null;
  email: string;
} | null;

type ArticleIssueDTO = {
  id: string;
  issueNumber: number;
  volumeId?: string;
} | null;

type ArticlePaymentDTO = {
  status: string;
  amount?: number;
  currency?: string;
} | null;

export type ArticleCardProps = {
  article: {
    id: string;
    title: string;
    status: string;
    createdAt: string | Date;
    coverImage?: string | null;
    keywords?: string | null;
    authors?: ArticleAuthorDTO[];

    // Optional extras – only shown for logged-in users
    editor?: ArticleEditorDTO;
    issue?: ArticleIssueDTO;
    payment?: ArticlePaymentDTO;
  };
};

export default function AutherArticleCard({ article }: ArticleCardProps) {
  const { session } = useSession();
  const isLoggedIn = !!session?.user;
  const currentUserEmail = session?.user?.email?.toLowerCase() ?? null;

  const created = new Date(article.createdAt).toLocaleDateString();

  const statusVariant =
    article.status === "PUBLISHED"
      ? "secondary"
      : article.status === "REJECTED"
      ? "destructive"
      : "outline";

  // Authors line
  const authorsLine =
    article.authors && article.authors.length > 0
      ? article.authors
          .map((aa) => {
            const nameOrEmail =
              aa.author?.name || aa.author?.email || "Unknown";

            const parts: string[] = [nameOrEmail];

            const isYou =
              currentUserEmail &&
              aa.author?.email?.toLowerCase() === currentUserEmail;

            if (isYou) parts.push("(You)");

            return parts.join(" ");
          })
          .join(", ")
      : null;

  // Private meta: only if user logged in AND the data exists
  const showEditor = isLoggedIn && article.editor;
  const showIssue = isLoggedIn && article.issue;
  const showPayment = isLoggedIn && article.payment;

  return (
    <Link href={`/dashboard/articles/${article.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="flex items-start gap-4">
          {/* Avatar / Cover image / Status */}
          <div className="relative h-35 w-35 shrink-0 overflow-hidden rounded-sm border bg-muted flex items-center justify-center">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <Badge
                variant={statusVariant}
                className="px-3 py-1 text-xs text-center"
              >
                {article.status}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            {/* Title + status */}
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg font-semibold line-clamp-2">
                {article.title}
              </h3>
              <Badge variant={statusVariant}>{article.status}</Badge>
            </div>

            {/* Basic info (always visible) */}
            <p className="text-sm text-muted-foreground">
              Submitted on {created}
            </p>

            {authorsLine && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">Authors:</span> {authorsLine}
              </p>
            )}

            {article.keywords && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">Keywords:</span>{" "}
                {article.keywords}
              </p>
            )}

            {/* Private meta (only when logged in) */}
            {showEditor && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">Editor:</span>{" "}
                {article.editor?.name ?? article.editor?.email}
              </p>
            )}

            {showIssue && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">Issue:</span>{" "}
                {article.issue?.issueNumber}
              </p>
            )}

            {showPayment && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">Payment:</span>{" "}
                {article.payment?.status}
                {article.payment?.amount != null &&
                  article.payment?.currency && (
                    <>
                      {" "}
                      · {article.payment.amount} {article.payment.currency}
                    </>
                  )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
