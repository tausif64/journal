import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

type AdminUsersResponse = {
  success: boolean;
  data?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
  }[];
  error?: string;
};

export type AdminEditorOption = {
  id: string;
  name: string | null;
  email: string;
};

export function useAdminEditors() {
  return useQuery<AdminEditorOption[]>({
    queryKey: ["admin-editors"],
    queryFn: async () => {
      const res = await apiGet<AdminUsersResponse>("/api/admin/users");
      const users = res.data ?? [];
      return users
        .filter((u) => u.role === "EDITOR")
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
        }));
    },
    staleTime: 60_000,
  });
}
