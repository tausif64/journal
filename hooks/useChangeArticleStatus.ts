import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiPut } from "@/lib/api";
import { ArticleStatus } from "@/lib/generated/prisma/client";

export function useChangeArticleStatus(articleId: string) {
  const qc = useQueryClient();

  return useMutation<unknown, ApiError, ArticleStatus>({
    mutationFn: (status) =>
      apiPut(`/api/admin/articles/${articleId}/status`, {
        status,
      }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-article", articleId],
      });
    },
  });
}
