"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignIssue } from "@/hooks/useAssignIssue";
import { useAdminIssues } from "@/hooks/useAdminIssues";

type CurrentIssue = {
  id: string;
  issueNumber: number;
  volumeId: string;
};

type Props = {
  articleId: string;
  currentIssue?: CurrentIssue | null;
};

export function AssignIssueDialog({ articleId, currentIssue }: Props) {
  const [open, setOpen] = useState(false);
  const [volumeId, setVolumeId] = useState<string>(currentIssue?.volumeId ?? "");
  const [issueId, setIssueId] = useState<string>(currentIssue?.id ?? "");

  const { data: issues = [], isLoading } = useAdminIssues();
  const assignMutation = useAssignIssue(articleId);

  const volumes = useMemo(() => {
    const seen = new Map<string, number>();
    for (const issue of issues) {
      if (!seen.has(issue.volume.id)) {
        seen.set(issue.volume.id, issue.volume.volumeNumber);
      }
    }
    return Array.from(seen.entries())
      .map(([id, volumeNumber]) => ({ id, volumeNumber }))
      .sort((a, b) => b.volumeNumber - a.volumeNumber);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (!volumeId) return [];
    return issues
      .filter((issue) => issue.volume.id === volumeId)
      .sort((a, b) => b.issueNumber - a.issueNumber);
  }, [issues, volumeId]);

  const selectedIssue = issues.find((issue) => issue.id === issueId) ?? null;

  const handleAssign = () => {
    if (!volumeId || !issueId) return;
    assignMutation.mutate(
      { volumeId, issueId },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setVolumeId(currentIssue?.volumeId ?? "");
          setIssueId(currentIssue?.id ?? "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          {currentIssue ? "Change Volume & Issue" : "Assign Volume & Issue"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentIssue ? "Change Volume & Issue" : "Assign Volume & Issue"}
          </DialogTitle>
          <DialogDescription>
            Choose a volume first, then choose an issue from that volume.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading issues...</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Volume <span className="text-destructive">*</span>
              </p>
              <Select
                value={volumeId || undefined}
                onValueChange={(value: string) => {
                  setVolumeId(value);
                  setIssueId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  {volumes.map((volume) => (
                    <SelectItem key={volume.id} value={volume.id}>
                      Volume {volume.volumeNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Issue <span className="text-destructive">*</span>
              </p>
              <Select
                value={issueId || undefined}
                onValueChange={setIssueId}
                disabled={!volumeId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      volumeId ? "Select issue" : "Select volume first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredIssues.map((issue) => (
                    <SelectItem key={issue.id} value={issue.id}>
                      Issue {issue.issueNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAssign}
              disabled={
                !volumeId ||
                !issueId ||
                assignMutation.isPending ||
                (currentIssue?.id === issueId &&
                  currentIssue?.volumeId === volumeId)
              }
              className="w-full"
            >
              {assignMutation.isPending
                ? "Saving..."
                : currentIssue
                ? "Update Volume & Issue"
                : "Assign Volume & Issue"}
            </Button>
          </div>
        )}

        {selectedIssue && (
          <DialogFooter>
            <p className="text-xs text-muted-foreground">
              Selected: Volume {selectedIssue.volume.volumeNumber}, Issue{" "}
              {selectedIssue.issueNumber}
            </p>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
