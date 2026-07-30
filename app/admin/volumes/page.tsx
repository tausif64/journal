"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function AdminVolumesPage() {
  const qc = useQueryClient();
  const [journalSearch, setJournalSearch] = useState("");
  const [volumeSearch, setVolumeSearch] = useState("");
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

  const updateJournal = useMutation({
    mutationFn: () => {
      if (!editJournal?.id) throw new Error("No journal selected");
      return apiPut<
        ApiResponse<Journal>,
        { name: string; issn: string; status: "ACTIVE" | "INACTIVE" }
      >(`/api/admin/journals/${editJournal.id}`, {
        name: editName.trim(),
        issn: editIssn.trim(),
        status: editStatus,
      });
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

  const journalColumns = useMemo<ColumnDef<Journal>[]>(
    () => [
      { accessorKey: "name", header: "Journal Name" },
      { accessorKey: "issn", header: "ISSN" },
      { accessorKey: "status", header: "Status" },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditJournal(row.original);
              setEditName(row.original.name);
              setEditIssn(row.original.issn);
              setEditStatus(row.original.status);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  const volumeColumns = useMemo<ColumnDef<VolumeRow>[]>(
    () => [
      {
        id: "volume",
        header: "Volume",
        cell: ({ row }) => `Vol ${row.original.volumeNumber}`,
      },
      { accessorKey: "year", header: "Year" },
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
        header: "Action",
        cell: ({ row }) => (
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/volumes/${row.original.id}`}>Edit</Link>
          </Button>
        ),
      },
    ],
    []
  );

  const journalsTable = useReactTable({
    data: journalsQuery.data ?? [],
    columns: journalColumns,
    state: {
      globalFilter: journalSearch,
    },
    onGlobalFilterChange: setJournalSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const value = String(filterValue).toLowerCase();
      const j = row.original;
      return (
        j.name.toLowerCase().includes(value) ||
        j.issn.toLowerCase().includes(value) ||
        j.status.toLowerCase().includes(value)
      );
    },
    initialState: { pagination: { pageSize: 10 } },
  });

  const volumesTable = useReactTable({
    data: volumesQuery.data ?? [],
    columns: volumeColumns,
    state: {
      globalFilter: volumeSearch,
    },
    onGlobalFilterChange: setVolumeSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const value = String(filterValue).toLowerCase();
      const v = row.original;
      return (
        String(v.year).includes(value) ||
        String(v.volumeNumber).includes(value) ||
        v.journal.name.toLowerCase().includes(value) ||
        v.journal.issn.toLowerCase().includes(value)
      );
    },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Volumes & Journals
          </h1>
          <p className="text-sm text-muted-foreground">
            Search and manage journal details and volume records.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/issues">Go to Create Forms</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Journals Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search journals by name, ISSN, status..."
            value={journalSearch}
            onChange={(e) => setJournalSearch(e.target.value)}
            className="max-w-md"
          />
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                {journalsTable.getHeaderGroups().map((headerGroup) => (
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
                {journalsTable.getRowModel().rows.length ? (
                  journalsTable.getRowModel().rows.map((row) => (
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
                    <TableCell colSpan={journalColumns.length} className="h-20 text-center">
                      No journals found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volumes Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search volumes by year, volume no, journal..."
            value={volumeSearch}
            onChange={(e) => setVolumeSearch(e.target.value)}
            className="max-w-md"
          />
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                {volumesTable.getHeaderGroups().map((headerGroup) => (
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
                {volumesTable.getRowModel().rows.length ? (
                  volumesTable.getRowModel().rows.map((row) => (
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
                    <TableCell colSpan={volumeColumns.length} className="h-20 text-center">
                      No volumes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
