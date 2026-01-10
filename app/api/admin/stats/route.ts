import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { Role } from "@/lib/generated/prisma/enums";

export async function GET() {
  try {
    // 1️⃣ Get session via better-auth (cookie-based)
    //    const session = await auth.api.getSession({
    //      headers: await headers(),
    //    });

    //     // 2️⃣ Authorization guard
    //     if (!session) {
    //       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    //     }

    //     if (session.user.role !== Role.ADMIN) {
    //       return NextResponse.json(
    //         { error: "Insufficient permissions" },
    //         { status: 403 }
    //       );
    //     }

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
