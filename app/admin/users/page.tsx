"use client";

import { useMemo, useState } from "react";
import {
  ColumnFiltersState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminUsers,
  useChangeUserRole,
  type AdminUserRole,
  type AdminUserRow,
} from "@/hooks/useAdminUsers";

function UserDataTable({ rows }: { rows: AdminUserRow[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const changeRole = useChangeUserRole();

  const columns = useMemo<ColumnDef<AdminUserRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name ?? "Unnamed"}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
      },
      {
        id: "createdAt",
        header: "Joined",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-IN"),
      },
      {
        id: "actions",
        header: "Update Role",
        cell: ({ row }) => {
          const currentRole = row.original.role as AdminUserRole;
          const isUpdating =
            changeRole.isPending && changeRole.variables?.userId === row.original.id;

          return (
            <Select
              value={currentRole}
              onValueChange={(value: string) => {
                if (value === currentRole) return;
                changeRole.mutate({
                  userId: row.original.id,
                  role: value as AdminUserRole,
                });
              }}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-9 w-[148px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTHOR">AUTHOR</SelectItem>
                <SelectItem value="REVIEWER">REVIEWER</SelectItem>
                <SelectItem value="EDITOR">EDITOR</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
    ],
    [changeRole]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search by name or email..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          const value = event.target.value;
          table.getColumn("name")?.setFilterValue(value);
          table.getColumn("email")?.setFilterValue(value);
        }}
        className="max-w-sm"
      />
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  No data found.
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

export default function AdminUsersPage() {
  const { data = [], isLoading, error } = useAdminUsers();

  const admins = useMemo(
    () => data.filter((u) => u.role === "ADMIN"),
    [data]
  );
  const editors = useMemo(
    () => data.filter((u) => u.role === "EDITOR"),
    [data]
  );
  const users = useMemo(
    () => data.filter((u) => !["ADMIN", "EDITOR"].includes(u.role)),
    [data]
  );

  if (isLoading) {
    return <div className="rounded-lg border p-6">Loading users...</div>;
  }

  if (error) {
    return <div className="text-destructive">Failed to load users</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Browse users by role category.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="editors">
                Editors ({editors.length})
              </TabsTrigger>
              <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              <UserDataTable rows={users} />
            </TabsContent>
            <TabsContent value="editors" className="mt-4">
              <UserDataTable rows={editors} />
            </TabsContent>
            <TabsContent value="admins" className="mt-4">
              <UserDataTable rows={admins} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
