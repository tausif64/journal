import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { AdminDashboardStatsDTO } from "@/types/dto";

export function useAdminStats() {
  return useQuery<AdminDashboardStatsDTO>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => apiGet<AdminDashboardStatsDTO>("/api/admin/stats"),
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}
