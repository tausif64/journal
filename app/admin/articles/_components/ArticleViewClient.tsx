"use client";

import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminArticle } from "@/hooks/useAdminArticle";
import { ArticleStatusBadge } from "@/components/admin/ArticleStatusBadge";
import { ArticleStatus } from "@/types/dto";
import { ChangeStatusDialog } from "@/components/admin/ChangeStatusDialog";
import { AssignEditorDialog } from "@/components/admin/AssignEditorDialog";
import { AssignIssueDialog } from "@/components/admin/AssignIssueDialog";

type Props = {
  id: string;
};

type ReviewRow = {
  id: string;
  comments: string;
  recommendation: string;
  reviewer: {
    id: string;
    name: string | null;
  };
  createdAt: Date;
};

export default function ArticleViewClient({ id }: Props) {
  const { data, isLoading, error } = useAdminArticle(id);

  const reviewColumns = useMemo<ColumnDef<ReviewRow>[]>(
    () => [
      {
        id: "reviewer",
        header: "Reviewer",
        cell: ({ row }) => row.original.reviewer.name ?? "Reviewer",
      },
      {
        accessorKey: "comments",
        header: "Comments",
      },
      {
        accessorKey: "recommendation",
        header: "Recommendation",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.recommendation}</Badge>
        ),
      },
      {
        id: "createdAt",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-IN"),
      },
    ],
    []
  );

  const reviewsTable = useReactTable({
    data: (data?.reviews as ReviewRow[] | undefined) ?? [],
    columns: reviewColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !data) {
    return <div className="text-destructive">Failed to load article</div>;
  }

  /* ---------- Page ---------- */
  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold leading-tight">{data.title}</h1>
          <ArticleStatusBadge status={data.status as ArticleStatus} />
        </div>

        <div className="flex gap-2">
          <ChangeStatusDialog
            articleId={id}
            currentStatus={data.status as ArticleStatus}
          />
          <AssignEditorDialog articleId={id} currentEditor={data.editor} />

          <AssignIssueDialog articleId={id} currentIssue={data.issue} />
        </div>
      </div>

      {/* ===== Article Details ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {/* Abstract */}
          <div>
            <p className="font-medium mb-1">Abstract</p>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {data.abstract}
            </p>
          </div>

          <Separator />

          {/* Authors */}
          <div>
            <p className="font-medium mb-1">Authors</p>
            <ul className="list-disc pl-5 space-y-1">
              {data.authors
                .slice()
                .sort((a, b) => a.authorOrder - b.authorOrder)
                .map((a) => (
                  <li key={a.author.id}>
                    {a.author.name ?? a.author.email}
                    {a.isCorresponding && (
                      <Badge variant="secondary" className="ml-2">
                        Corresponding
                      </Badge>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          <Separator />

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="font-medium">Editor</p>
              <p className="text-muted-foreground">
                {data.editor?.name ?? "Not assigned"}
              </p>
            </div>

            <div>
              <p className="font-medium">Issue</p>
              <p className="text-muted-foreground">
                {data.issue
                  ? `Issue ${data.issue.issueNumber}`
                  : "Not assigned"}
              </p>
            </div>
          </div>

          <Separator />

          {/* PDF */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Article PDF</h2>
              <a
                href={data.fileUrl}
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
        </CardContent>
      </Card>

      {/* ===== Reviews ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                {reviewsTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {reviewsTable.getRowModel().rows.length > 0 ? (
                  reviewsTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3 py-2.5">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={reviewColumns.length}
                      className="h-20 text-center text-muted-foreground"
                    >
                      No reviews yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => reviewsTable.previousPage()}
              disabled={!reviewsTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {reviewsTable.getState().pagination.pageIndex + 1} /{" "}
              {reviewsTable.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => reviewsTable.nextPage()}
              disabled={!reviewsTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== Payment (Admin only) ===== */}
      {data.payment && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>
              Amount: {data.payment.amount} {data.payment.currency}
            </p>
            <p>Status: {data.payment.status}</p>
            <p>Razorpay Order ID: {data.payment.razorpayOrderId}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
