"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminArticleListItemDTO } from "@/types/dto";
import { ArticleStatusBadge } from "@/components/admin/ArticleStatusBadge";
import { ArticleActions } from "@/components/admin/ArticleActions";

export const columns: ColumnDef<AdminArticleListItemDTO>[] = [
  {
    accessorKey: "sn",
    header: "SN",
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
    header: "Editor",
    cell: ({ row }) => row.original.editor?.name ?? "—",
  },
  {
    header: "Issue",
    cell: ({ row }) => {
      const issue = row.original.issue;
      if (!issue) return "—";
      return `Vol ${issue.volumeNumber}, Issue ${issue.issueNumber}`;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ArticleActions articleId={row.original.id} />,
  },
];
