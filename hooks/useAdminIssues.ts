import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

type AdminIssueDTO = {
  id: string;
  issueNumber: number;
  volume: {
    id: string;
    volumeNumber: number;
  };
};

type AdminIssuesApiResponse = {
  success: boolean;
  data?: AdminIssueDTO[];
  error?: string;
};

export function useAdminIssues() {
  return useQuery<AdminIssueDTO[]>({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      const res = await apiGet<AdminIssueDTO[] | AdminIssuesApiResponse>(
        "/api/admin/issues"
      );

      if (Array.isArray(res)) return res;
      return res.data ?? [];
    },
  });
}
