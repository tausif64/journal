import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

type AdminUsersResponse = {
  success: boolean;
  data?: AdminUserRow[];
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

export type { AdminUserRow };
