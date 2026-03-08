"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut } from "@/lib/api";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type Journal = {
  id: string;
  name: string;
  issn: string;
  status: "ACTIVE" | "INACTIVE";
};

type VolumeRow = {
  id: string;
  volumeNumber: number;
  year: number;
  journal: {
    id: string;
    name: string;
    issn: string;
  };
  _count: {
    issues: number;
  };
};

export default function AdminIssueVolumePage() {
  const qc = useQueryClient();

  const [journalName, setJournalName] = useState("");
  const [journalIssn, setJournalIssn] = useState("");
  const [journalStatus, setJournalStatus] = useState<"ACTIVE" | "INACTIVE">(
    "ACTIVE"
  );
  const [volumeJournalId, setVolumeJournalId] = useState("");
  const [volumeDate, setVolumeDate] = useState("");
  const [editJournal, setEditJournal] = useState<Journal | null>(null);
  const [editName, setEditName] = useState("");
  const [editIssn, setEditIssn] = useState("");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const journalsQuery = useQuery<Journal[]>({
    queryKey: ["admin-journals"],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<Journal[]>>("/api/admin/journals");
      return res.data ?? [];
    },
  });

  const volumesQuery = useQuery<VolumeRow[]>({
    queryKey: ["admin-volumes"],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<VolumeRow[]>>("/api/admin/volumes");
      return res.data ?? [];
    },
  });

  const selectedYear = useMemo(() => {
    if (!volumeDate) return NaN;
    const parsed = new Date(volumeDate);
    return Number.isNaN(parsed.getTime()) ? NaN : parsed.getFullYear();
  }, [volumeDate]);

  const suggestedVolumeNumber = useMemo(() => {
    if (!Number.isInteger(selectedYear)) return 1;
    const volsForYear = (volumesQuery.data ?? []).filter(
      (v) => v.year === selectedYear
    );
    const maxForYear = volsForYear.reduce(
      (max, v) => Math.max(max, v.volumeNumber),
      0
    );
    return maxForYear + 1;
  }, [selectedYear, volumesQuery.data]);

  useEffect(() => {
    if (volumeDate || !volumesQuery.data) return;
    const latestYear =
      volumesQuery.data.length > 0
        ? Math.max(...volumesQuery.data.map((v) => v.year))
        : new Date().getFullYear();
    setVolumeDate(`${latestYear}-01-01`);
  }, [volumeDate, volumesQuery.data]);

  const createJournal = useMutation({
    mutationFn: () =>
      apiPost<
        ApiResponse<Journal>,
        { name: string; issn: string; status: "ACTIVE" | "INACTIVE" }
      >(
        "/api/admin/journals",
        {
          name: journalName.trim(),
          issn: journalIssn.trim(),
          status: journalStatus,
        }
      ),
    onSuccess: async () => {
      setJournalName("");
      setJournalIssn("");
      setJournalStatus("ACTIVE");
      toast.success("Journal created");
      await qc.invalidateQueries({ queryKey: ["admin-journals"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create journal");
    },
  });

  const updateJournal = useMutation({
    mutationFn: () => {
      if (!editJournal?.id) {
        throw new Error("No journal selected");
      }
      return (
      apiPut<
        ApiResponse<Journal>,
        { name: string; issn: string; status: "ACTIVE" | "INACTIVE" }
      >(`/api/admin/journals/${editJournal.id}`, {
        name: editName.trim(),
        issn: editIssn.trim(),
        status: editStatus,
      })
      );
    },
    onSuccess: async () => {
      toast.success("Journal updated");
      setEditJournal(null);
      await qc.invalidateQueries({ queryKey: ["admin-journals"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update journal");
    },
  });

  const createVolume = useMutation({
    mutationFn: () =>
      apiPost<
        ApiResponse<VolumeRow>,
        { journalId: string; volumeNumber: number; year: number }
      >("/api/admin/volumes", {
        journalId: volumeJournalId,
        volumeNumber: suggestedVolumeNumber,
        year: selectedYear,
      }),
    onSuccess: async () => {
      toast.success("Volume created");
      await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create volume");
    },
  });

  const columns = useMemo<ColumnDef<VolumeRow>[]>(
    () => [
      {
        id: "volume",
        header: "Volume",
        cell: ({ row }) => (
          <span className="font-medium">Vol {row.original.volumeNumber}</span>
        ),
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        id: "journal",
        header: "Journal",
        cell: ({ row }) => row.original.journal.name,
      },
      {
        id: "issues",
        header: "Issues",
        cell: ({ row }) => row.original._count.issues,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/volumes/${row.original.id}`}>Edit</Link>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: volumesQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Volume Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create journals/volumes and manage each volume with related issues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Journal Name <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="Journal name"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
            />
            <p className="text-xs font-medium text-muted-foreground">
              ISSN <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="ISSN"
              value={journalIssn}
              onChange={(e) => setJournalIssn(e.target.value)}
            />
            <p className="text-xs font-medium text-muted-foreground">
              Status <span className="text-destructive">*</span>
            </p>
            <Select
              value={journalStatus}
              onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                setJournalStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={
                createJournal.isPending ||
                !journalName.trim() ||
                !journalIssn.trim()
              }
              onClick={() => createJournal.mutate()}
            >
              {createJournal.isPending ? "Creating..." : "Create Journal"}
            </Button>

            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Existing Journals
              </p>
              <div className="space-y-2">
                {(journalsQuery.data ?? []).map((journal) => (
                  <div
                    key={journal.id}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{journal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {journal.issn} • {journal.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditJournal(journal);
                        setEditName(journal.name);
                        setEditIssn(journal.issn);
                        setEditStatus(journal.status);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
                {(journalsQuery.data ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No journals found.
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Volume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Journal <span className="text-destructive">*</span>
            </p>
            <Select
              value={volumeJournalId || undefined}
              onValueChange={setVolumeJournalId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select journal" />
              </SelectTrigger>
              <SelectContent>
                {(journalsQuery.data ?? []).map((journal) => (
                  <SelectItem key={journal.id} value={journal.id}>
                    {journal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs font-medium text-muted-foreground">
              Year <span className="text-destructive">*</span>
            </p>
            <Input
              type="date"
              value={volumeDate}
              onChange={(e) => setVolumeDate(e.target.value)}
            />
            <p className="text-xs font-medium text-muted-foreground">
              Selected Year <span className="text-destructive">*</span>
            </p>
            <Input
              value={
                Number.isInteger(selectedYear)
                  ? String(selectedYear)
                  : "Select year first"
              }
              readOnly
              placeholder="Year"
            />
            <p className="text-xs font-medium text-muted-foreground">
              Next Volume Number <span className="text-destructive">*</span>
            </p>
            <Input
              value={String(suggestedVolumeNumber)}
              readOnly
              placeholder="Next volume number"
            />
            <Button
              className="w-full"
              disabled={
                createVolume.isPending ||
                !volumeJournalId ||
                !Number.isInteger(selectedYear)
              }
              onClick={() => createVolume.mutate()}
            >
              {createVolume.isPending ? "Creating..." : "Create Volume"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Next volume for {Number.isInteger(selectedYear) ? selectedYear : "selected year"} is{" "}
              {suggestedVolumeNumber}. Change year to backfill old years.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volumes Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
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
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
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
                      colSpan={columns.length}
                      className="h-20 text-center text-muted-foreground"
                    >
                      No volumes found.
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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editJournal)}
        onOpenChange={(open) => {
          if (!open) setEditJournal(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Journal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Journal Name <span className="text-destructive">*</span>
            </p>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            <p className="text-xs font-medium text-muted-foreground">
              ISSN <span className="text-destructive">*</span>
            </p>
            <Input value={editIssn} onChange={(e) => setEditIssn(e.target.value)} />
            <p className="text-xs font-medium text-muted-foreground">
              Status <span className="text-destructive">*</span>
            </p>
            <Select
              value={editStatus}
              onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                setEditStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={updateJournal.isPending || !editName.trim() || !editIssn.trim()}
              onClick={() => updateJournal.mutate()}
            >
              {updateJournal.isPending ? "Updating..." : "Update Journal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
