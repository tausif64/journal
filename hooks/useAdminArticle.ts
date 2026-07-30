import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { ArticleDetailDTO } from "@/types/dto";

export function useAdminArticle(id: string) {
  return useQuery<ArticleDetailDTO>({
    queryKey: ["admin-article", id],
    queryFn: () => apiGet<ArticleDetailDTO>(`/api/admin/articles/${id}`),
    enabled: !!id,
  });
}
