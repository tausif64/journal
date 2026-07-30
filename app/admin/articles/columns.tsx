"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminArticleListItemDTO } from "@/types/dto";
import { ArticleStatusBadge } from "@/components/admin/ArticleStatusBadge";
import { ArticleActions } from "@/components/admin/ArticleActions";

export const columns: ColumnDef<AdminArticleListItemDTO>[] = [
  {
    id: "sn",
    accessorKey: "sn",
    header: "SN",
    enableSorting: false,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ArticleStatusBadge status={row.original.status} />,
  },
  {
    id: "editor",
    accessorFn: (row) => row.editor?.name ?? "",
    header: "Editor",
    cell: ({ row }) => row.original.editor?.name ?? "-",
  },
  {
    id: "issue",
    accessorFn: (row) =>
      row.issue
        ? `Vol ${row.issue.volumeNumber}, Issue ${row.issue.issueNumber}`
        : "",
    header: "Issue",
    cell: ({ row }) => {
      const issue = row.original.issue;
      if (!issue) return "-";
      return `Vol ${issue.volumeNumber}, Issue ${issue.issueNumber}`;
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <ArticleActions articleId={row.original.id} />,
  },
];
