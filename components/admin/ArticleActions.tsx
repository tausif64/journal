"use client";

import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function ArticleActions({ articleId }: { articleId: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/admin/articles/${articleId}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </TooltipTrigger>

      <TooltipContent side="left">Edit</TooltipContent>
    </Tooltip>
  );
}
