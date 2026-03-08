"use client";

import {
  BookOpen,
  ChartNoAxesColumn,
  CircleCheck,
  Clock3,
  FileText,
  FolderOpen,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/useAdminStats";

type MetricCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "blue" | "emerald" | "amber" | "violet";
};

const toneClasses: Record<MetricCardProps["tone"], string> = {
  blue: "border-blue-200/60 bg-blue-50/60",
  emerald: "border-emerald-200/60 bg-emerald-50/60",
  amber: "border-amber-200/60 bg-amber-50/60",
  violet: "border-violet-200/60 bg-violet-50/60",
};

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
        Failed to load dashboard data
      </div>
    );
  }

  const { articlesByStatus } = data;
  const statusRows = [
    {
      key: "SUBMITTED",
      label: "Submitted",
      value: articlesByStatus.SUBMITTED,
      icon: FileText,
      color: "bg-slate-600",
    },
    {
      key: "UNDER_REVIEW",
      label: "Under Review",
      value: articlesByStatus.UNDER_REVIEW,
      icon: Clock3,
      color: "bg-blue-600",
    },
    {
      key: "REVISION",
      label: "Revision",
      value: articlesByStatus.REVISION,
      icon: FolderOpen,
      color: "bg-amber-600",
    },
    {
      key: "ACCEPTED",
      label: "Accepted",
      value: articlesByStatus.ACCEPTED,
      icon: CircleCheck,
      color: "bg-emerald-600",
    },
    {
      key: "REJECTED",
      label: "Rejected",
      value: articlesByStatus.REJECTED,
      icon: ShieldAlert,
      color: "bg-rose-600",
    },
    {
      key: "PUBLISHED",
      label: "Published",
      value: articlesByStatus.PUBLISHED,
      icon: BookOpen,
      color: "bg-violet-600",
    },
  ];

  const totalByStatus = statusRows.reduce((acc, row) => acc + row.value, 0);
  const progressBase = Math.max(1, totalByStatus);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Admin Panel
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Snapshot of submissions, users, and publication pipeline health.
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-4 py-3 text-right backdrop-blur">
            <p className="text-xs text-slate-300">Total Articles</p>
            <p className="text-3xl font-bold">{data.totalArticles}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data.totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          tone="blue"
        />
        <MetricCard
          title="Total Articles"
          value={data.totalArticles}
          subtitle="All submissions"
          icon={FileText}
          tone="emerald"
        />
        <MetricCard
          title="Volumes"
          value={data.totalVolumes}
          subtitle="Configured volumes"
          icon={BookOpen}
          tone="amber"
        />
        <MetricCard
          title="Issues"
          value={data.totalIssues}
          subtitle="Created issues"
          icon={ChartNoAxesColumn}
          tone="violet"
        />
      </div>

      <Card className="border-slate-200/70 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Article Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusRows.map((row) => {
            const Icon = row.icon;
            const percent = Math.round((row.value / progressBase) * 100);

            return (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{percent}%</span>
                    <span className="w-9 text-right text-sm font-semibold">
                      {row.value}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card className={`border shadow-sm ${toneClasses[tone]}`}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-sm font-medium text-slate-700">{title}</p>
          <span className="rounded-md border bg-white/80 p-2">
            <Icon className="h-4 w-4 text-slate-700" />
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
