import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPut } from "@/lib/api";

export function useAssignIssue(articleId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { volumeId: string; issueId: string }) =>
      apiPut(`/api/admin/articles/${articleId}/issue`, {
        issueId: payload.issueId,
        volumeId: payload.volumeId,
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
