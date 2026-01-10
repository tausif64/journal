import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { AdminArticleListItemDTO } from "@/types/dto";

export function useAdminArticles() {
  return useQuery<AdminArticleListItemDTO[]>({
    queryKey: ["admin-articles"],
    queryFn: () => apiGet<AdminArticleListItemDTO[]>("/api/admin/articles"),
    staleTime: 5_000,
  });
}
