import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/app/Provider";

type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: AdminUserRole;
  createdAt: string;
};

type AdminUserRole = "AUTHOR" | "REVIEWER" | "EDITOR" | "ADMIN";

type AdminUsersResponse = {
  success: boolean;
  data?: AdminUserRow[];
  error?: string;
};

type ChangeUserRoleResponse = {
  success: boolean;
  data?: {
    id: string;
    role: AdminUserRole;
  };
  error?: string;
};

export function useAdminUsers() {
  return useQuery<AdminUserRow[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await apiGet<AdminUsersResponse>("/api/admin/users");
      return res.data ?? [];
    },
    staleTime: 10_000,
  });
}

export function useChangeUserRole() {
  return useMutation<
    { id: string; role: AdminUserRole },
    Error,
    { userId: string; role: AdminUserRole }
  >({
    mutationFn: async ({ userId, role }) => {
      const res = await apiPut<
        ChangeUserRoleResponse,
        { userId: string; role: AdminUserRole }
      >("/api/admin/users", { userId, role });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to update role");
      }

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Role updated to ${data.role}`);
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update role");
    },
  });
}

export type { AdminUserRole, AdminUserRow };
