"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-destructive">Failed to load dashboard data</div>
    );
  }

  const { articlesByStatus } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total Articles" value={data.totalArticles} />
        <Stat title="Total Users" value={data.totalUsers} />
        <Stat title="Volumes" value={data.totalVolumes} />
        <Stat title="Issues" value={data.totalIssues} />
      </div>

      {/* Article status */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat title="Submitted" value={articlesByStatus.SUBMITTED} />
        <Stat title="Under Review" value={articlesByStatus.UNDER_REVIEW} />
        <Stat title="Revision" value={articlesByStatus.REVISION} />
        <Stat title="Accepted" value={articlesByStatus.ACCEPTED} />
        <Stat title="Rejected" value={articlesByStatus.REJECTED} />
        <Stat title="Published" value={articlesByStatus.PUBLISHED} />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
