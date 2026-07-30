"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EditorArticle = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  authors: Array<{
    author: { id: string; name: string | null; email: string };
  }>;
  issue: null | {
    issueNumber: number;
    volume: { volumeNumber: number; year: number };
  };
};

type EditorArticlesResponse = {
  success: boolean;
  data?: EditorArticle[];
  error?: string;
};

export default function EditorHomePage() {
  const [query, setQuery] = useState("");
  const { data = [], isLoading, isError } = useQuery<EditorArticle[]>({
    queryKey: ["editor-assigned-articles"],
    queryFn: async () => {
      const res = await apiGet<EditorArticlesResponse>("/api/editor/articles");
      return res.data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.authors.some(
          (a) =>
            (a.author.name ?? "").toLowerCase().includes(q) ||
            a.author.email.toLowerCase().includes(q)
        )
    );
  }, [data, query]);

  const columns = useMemo<ColumnDef<EditorArticle>[]>(
    () => [
      {
        header: "Title",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.authors
                .map((a) => a.author.name ?? a.author.email)
                .join(", ")}
            </p>
          </div>
        ),
      },
      {
        header: "Status",
        cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
      },
      {
        header: "Volume/Issue",
        cell: ({ row }) =>
          row.original.issue
            ? `Vol ${row.original.issue.volume.volumeNumber} (${row.original.issue.volume.year}) / Issue ${row.original.issue.issueNumber}`
            : "-",
      },
      {
        header: "Updated",
        cell: ({ row }) =>
          new Date(row.original.updatedAt).toLocaleDateString("en-IN"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button asChild size="sm">
            <Link href={`/editor/articles/${row.original.id}`}>Open</Link>
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editor Area</h1>
          <p className="text-sm text-muted-foreground">
            Review assigned articles and submit editorial feedback.
          </p>
        </div>

        <Input
          placeholder="Search by title, author, or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />

        {isLoading ? (
          <div className="rounded-lg border p-6">Loading assigned articles...</div>
        ) : isError ? (
          <div className="text-destructive">Failed to load assigned articles</div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-20 text-center">
                      No assigned articles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}
