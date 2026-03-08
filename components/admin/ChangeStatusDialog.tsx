"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArticleStatus } from "@/lib/generated/prisma/client";
import { useChangeArticleStatus } from "@/hooks/useChangeArticleStatus";

const STATUSES: ArticleStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "REVISION",
  "ACCEPTED",
  "REJECTED",
  "PUBLISHED",
];

export function ChangeStatusDialog({
  articleId,
  currentStatus,
}: {
  articleId: string;
  currentStatus: ArticleStatus;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useChangeArticleStatus(articleId);
  const isPublishedLocked = currentStatus === "PUBLISHED";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        mutation.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Change Status</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Article Status</DialogTitle>
        </DialogHeader>
        <p className="text-xs font-medium text-muted-foreground">
          Select Status <span className="text-destructive">*</span>
        </p>

        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((status) => (
            <Button
              key={status}
              variant={status === currentStatus ? "default" : "outline"}
              disabled={mutation.isPending || isPublishedLocked}
              onClick={() =>
                mutation.mutate(status, {
                  onSuccess: () => {
                    setOpen(false);
                  },
                })
              }
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
        {isPublishedLocked && (
          <p className="text-sm text-muted-foreground">
            This article is published and its status is locked.
          </p>
        )}
        {mutation.isError && (
          <p className="text-sm text-destructive">
            {mutation.error.message || "Failed to update status"}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
