import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../_lib/require-admin";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const [
      totalUsers,
      totalArticles,
      totalVolumes,
      totalIssues,
      articleStatusCounts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.volume.count(),
      prisma.issue.count(),

      prisma.article.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    // 4️⃣ Normalize status counts (important for frontend stability)
    const articlesByStatus = {
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      REVISION: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      PUBLISHED: 0,
    };

    for (const row of articleStatusCounts) {
      articlesByStatus[row.status] = row._count.status;
    }

    return NextResponse.json({
      totalUsers,
      totalArticles,
      totalVolumes,
      totalIssues,
      articlesByStatus,
    });
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
