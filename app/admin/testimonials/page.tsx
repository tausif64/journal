"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TestimonialStatus = "PENDING" | "APPROVED" | "REJECTED";

type AdminTestimonialRow = {
  id: string;
  quote: string;
  designation: string | null;
  imageUrl: string | null;
  status: TestimonialStatus;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

type AdminTestimonialsResponse = {
  success: boolean;
  data?: AdminTestimonialRow[];
  error?: string;
};

function TestimonialTable({
  rows,
  onApprove,
  onReject,
  onDelete,
  busyId,
}: {
  rows: AdminTestimonialRow[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  busyId: string | null;
}) {
  const columns = useMemo<ColumnDef<AdminTestimonialRow>[]>(
    () => [
      {
        header: "Author",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.user.name ?? "Unnamed"}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.user.email}
            </p>
          </div>
        ),
      },
      {
        header: "Quote",
        cell: ({ row }) => (
          <p className="max-w-md whitespace-normal">{row.original.quote}</p>
        ),
      },
      {
        header: "Designation",
        cell: ({ row }) => row.original.designation ?? "-",
      },
      {
        header: "Status",
        cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
      },
      {
        header: "Submitted",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-IN"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busyId === row.original.id || row.original.status === "APPROVED"}
              onClick={() => onApprove(row.original.id)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyId === row.original.id || row.original.status === "REJECTED"}
              onClick={() => onReject(row.original.id)}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={busyId === row.original.id}
              onClick={() => onDelete(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [busyId, onApprove, onDelete, onReject]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-3">
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
            {table.getRowModel().rows.length > 0 ? (
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
                  No testimonials.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
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
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data = [], isLoading, isError } = useQuery<AdminTestimonialRow[]>({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await apiGet<AdminTestimonialsResponse>("/api/admin/testimonials");
      return res.data ?? [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: TestimonialStatus;
    }) => {
      setBusyId(id);
      return apiPut(`/api/admin/testimonials/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Testimonial status updated");
      void qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Update failed");
    },
    onSettled: () => setBusyId(null),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setBusyId(id);
      return apiDelete(`/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      toast.success("Testimonial deleted");
      void qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    },
    onSettled: () => setBusyId(null),
  });

  const pending = useMemo(
    () => data.filter((item) => item.status === "PENDING"),
    [data]
  );
  const approved = useMemo(
    () => data.filter((item) => item.status === "APPROVED"),
    [data]
  );
  const rejected = useMemo(
    () => data.filter((item) => item.status === "REJECTED"),
    [data]
  );

  if (isLoading) {
    return <div className="rounded-lg border p-6">Loading testimonials...</div>;
  }

  if (isError) {
    return <div className="text-destructive">Failed to load testimonials</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve author testimonials for homepage display.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approved.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejected.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <TestimonialTable
                rows={pending}
                busyId={busyId}
                onApprove={(id) =>
                  updateMutation.mutate({ id, status: "APPROVED" })
                }
                onReject={(id) =>
                  updateMutation.mutate({ id, status: "REJECTED" })
                }
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              <TestimonialTable
                rows={approved}
                busyId={busyId}
                onApprove={(id) =>
                  updateMutation.mutate({ id, status: "APPROVED" })
                }
                onReject={(id) =>
                  updateMutation.mutate({ id, status: "REJECTED" })
                }
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              <TestimonialTable
                rows={rejected}
                busyId={busyId}
                onApprove={(id) =>
                  updateMutation.mutate({ id, status: "APPROVED" })
                }
                onReject={(id) =>
                  updateMutation.mutate({ id, status: "REJECTED" })
                }
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
