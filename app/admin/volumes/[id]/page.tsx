"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type Issue = {
  id: string;
  issueNumber: number;
  publicationDate: string | null;
  status: "DRAFT" | "PUBLISHED";
};

type VolumeDetail = {
  id: string;
  volumeNumber: number;
  year: number;
  coverImage: string | null;
  journal: {
    id: string;
    name: string;
    issn: string;
  };
  issues: Issue[];
};

type IssueEdit = {
  issueNumber: string;
  publicationDate: string;
  status: "DRAFT" | "PUBLISHED";
};

function toDateInputValue(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function VolumeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const volumeId = params.id;

  const [, setVolumeNumber] = useState("");
  const [, setVolumeYear] = useState("");
  const [newIssueDate, setNewIssueDate] = useState("");
  const [newIssueStatus, setNewIssueStatus] = useState<"DRAFT" | "PUBLISHED">(
    "DRAFT"
  );
  const [issueEdits, setIssueEdits] = useState<Record<string, IssueEdit>>({});

  const detailQuery = useQuery<VolumeDetail>({
    queryKey: ["admin-volume", volumeId],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<VolumeDetail>>(
        `/api/admin/volumes/${volumeId}`
      );
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Failed to load volume");
      }
      return res.data;
    },
    enabled: Boolean(volumeId),
  });

  useEffect(() => {
    if (!detailQuery.data) return;
    setVolumeNumber(String(detailQuery.data.volumeNumber));
    setVolumeYear(String(detailQuery.data.year));

    const nextEdits: Record<string, IssueEdit> = {};
    for (const issue of detailQuery.data.issues) {
      nextEdits[issue.id] = {
        issueNumber: String(issue.issueNumber),
        publicationDate: toDateInputValue(issue.publicationDate),
        status: issue.status,
      };
    }
    setIssueEdits(nextEdits);
  }, [detailQuery.data]);

  // const updateVolume = useMutation({
  //   mutationFn: () =>
  //     apiPut<ApiResponse<VolumeDetail>, { volumeNumber: number; year: number }>(
  //       `/api/admin/volumes/${volumeId}`,
  //       { volumeNumber: Number(volumeNumber), year: Number(volumeYear) }
  //     ),
  //   onSuccess: async () => {
  //     toast.success("Volume updated");
  //     await qc.invalidateQueries({ queryKey: ["admin-volume", volumeId] });
  //     await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
  //   },
  //   onError: (error) => {
  //     toast.error(error instanceof Error ? error.message : "Failed to update volume");
  //   },
  // });

  // const deleteVolume = useMutation({
  //   mutationFn: () => apiDelete<ApiResponse<null>>(`/api/admin/volumes/${volumeId}`),
  //   onSuccess: async () => {
  //     toast.success("Volume deleted");
  //     await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
  //     router.push("/admin/issues");
  //   },
  //   onError: (error) => {
  //     toast.error(error instanceof Error ? error.message : "Failed to delete volume");
  //   },
  // });

  const createIssue = useMutation({
    mutationFn: () =>
      apiPost<
        ApiResponse<Issue>,
        {
          issueNumber: number;
          volumeId: string;
          publicationDate: string | null;
          status: "DRAFT" | "PUBLISHED";
        }
      >("/api/admin/issues", {
        issueNumber: nextIssueNumber,
        volumeId,
        publicationDate: newIssueDate || null,
        status: newIssueStatus,
      }),
    onSuccess: async () => {
      setNewIssueDate("");
      setNewIssueStatus("DRAFT");
      toast.success("Issue created");
      await qc.invalidateQueries({ queryKey: ["admin-volume", volumeId] });
      await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create issue");
    },
  });

  const updateIssue = useCallback(async (issueId: string) => {
    const edit = issueEdits[issueId];
    if (!edit) return;

    try {
      await apiPut<ApiResponse<Issue>>(`/api/admin/issues/${issueId}`, {
        issueNumber: Number(edit.issueNumber),
        publicationDate: edit.publicationDate || null,
        status: edit.status,
      });
      toast.success("Issue updated");
      await qc.invalidateQueries({ queryKey: ["admin-volume", volumeId] });
      await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update issue");
    }
  }, [issueEdits, qc, volumeId]);

  const removeIssue = useCallback(async (issueId: string) => {
    try {
      await apiDelete<ApiResponse<null>>(`/api/admin/issues/${issueId}`);
      toast.success("Issue deleted");
      await qc.invalidateQueries({ queryKey: ["admin-volume", volumeId] });
      await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete issue");
    }
  }, [qc, volumeId]);

  const issues = useMemo(() => detailQuery.data?.issues ?? [], [detailQuery.data]);
  const nextIssueNumber = useMemo(() => {
    if (!issues.length) return 1;
    return Math.max(...issues.map((issue) => issue.issueNumber)) + 1;
  }, [issues]);

  const issueColumns = useMemo<ColumnDef<Issue>[]>(
    () => [
      {
        id: "issueNumber",
        header: "Issue No",
        cell: ({ row }) => {
          const edit = issueEdits[row.original.id];
          if (!edit) return null;
          return (
            <Input
              type="number"
              value={edit.issueNumber}
              onChange={(e) =>
                setIssueEdits((prev) => ({
                  ...prev,
                  [row.original.id]: {
                    ...prev[row.original.id],
                    issueNumber: e.target.value,
                  },
                }))
              }
            />
          );
        },
      },
      {
        id: "publicationDate",
        header: "Publication Date",
        cell: ({ row }) => {
          const edit = issueEdits[row.original.id];
          if (!edit) return null;
          return (
            <Input
              type="date"
              value={edit.publicationDate}
              onChange={(e) =>
                setIssueEdits((prev) => ({
                  ...prev,
                  [row.original.id]: {
                    ...prev[row.original.id],
                    publicationDate: e.target.value,
                  },
                }))
              }
            />
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const edit = issueEdits[row.original.id];
          if (!edit) return null;
          return (
            <Select
              value={edit.status}
              onValueChange={(value: string) =>
                setIssueEdits((prev) => ({
                  ...prev,
                  [row.original.id]: {
                    ...prev[row.original.id],
                    status: value as "DRAFT" | "PUBLISHED",
                  },
                }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => void updateIssue(row.original.id)}
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (window.confirm("Delete this issue?")) {
                  void removeIssue(row.original.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [issueEdits, removeIssue, updateIssue]
  );

  const issueTable = useReactTable({
    data: issues,
    columns: issueColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (detailQuery.isLoading) {
    return <div className="rounded-lg border p-6">Loading volume details...</div>;
  }

  if (!detailQuery.data) {
    return <div className="text-destructive">Failed to load volume</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Volume {detailQuery.data.volumeNumber}
          </h1>
          <p className="text-sm text-muted-foreground">
            {detailQuery.data.journal.name} ({detailQuery.data.journal.issn})
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/issues")}>
          Back
        </Button>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Volume</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-baseline">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Volume Number <span className="text-destructive">*</span>
            </p>
          <Input
            type="number"
            value={volumeNumber}
            onChange={(e) => setVolumeNumber(e.target.value)}
            placeholder="Volume number"
          />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Year <span className="text-destructive">*</span>
            </p>
          <Input
            type="number"
            value={volumeYear}
            onChange={(e) => setVolumeYear(e.target.value)}
            placeholder="Year"
          />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!volumeNumber || !volumeYear || updateVolume.isPending}
              onClick={() => updateVolume.mutate()}
            >
              {updateVolume.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteVolume.isPending}
              onClick={() => {
                if (window.confirm("Delete this volume?")) {
                  deleteVolume.mutate();
                }
              }}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create Issue in This Volume</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Issue Number <span className="text-destructive">*</span>
            </p>
          <Input
            value={String(nextIssueNumber)}
            readOnly
            placeholder="Issue number"
          />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Publication Date
            </p>
          <Input
            type="date"
            value={newIssueDate}
            onChange={(e) => setNewIssueDate(e.target.value)}
          />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Status <span className="text-destructive">*</span>
            </p>
          <Select
            value={newIssueStatus}
            onValueChange={(value: string) =>
              setNewIssueStatus(value as "DRAFT" | "PUBLISHED")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
              <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
            </SelectContent>
          </Select>
          </div>
          <Button disabled={createIssue.isPending} onClick={() => createIssue.mutate()}>
            {createIssue.isPending ? "Creating..." : "Create Issue"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Related Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                {issueTable.getHeaderGroups().map((headerGroup) => (
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
                {issueTable.getRowModel().rows.length > 0 ? (
                  issueTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3">
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
                      colSpan={issueColumns.length}
                      className="h-20 text-center text-muted-foreground"
                    >
                      No issues in this volume.
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
              onClick={() => issueTable.previousPage()}
              disabled={!issueTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {issueTable.getState().pagination.pageIndex + 1} /{" "}
              {issueTable.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => issueTable.nextPage()}
              disabled={!issueTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
