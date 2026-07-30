import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPut } from "@/lib/api";

export function useAssignEditor(articleId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (editorId: string) =>
      apiPut(`/api/admin/articles/${articleId}/editor`, {
        editorId,
      }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-article", articleId],
      });
      qc.invalidateQueries({
        queryKey: ["admin-articles"],
      });
    },
  });
}
