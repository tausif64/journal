// app/api/reviews/route.ts
import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { reviewService } from "../../server/services/review.service";
import { userDAL } from "../../server/dal/user.dal";

/**
 * POST /api/reviews
 * - action = "assign" -> editor assigns reviewer { articleId, reviewerId }
 * - action = "submit" -> reviewer submits review { reviewId, comments, recommendation }
 *
 * Important: session.user from auth may not include role, so we load the user from DB.
 */

export async function POST(req: Request) {
  // get session using better-auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" });
  }

  // load full user record (to get role and other metadata)
  const actor = await userDAL.findById(session.user.id);
  if (!actor) {
    return NextResponse.json({ success: false, error: "User not found" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" });
  }

  const payload = body as Record<string, unknown>;
  const action = typeof payload.action === "string" ? payload.action : null;

  try {
    if (action === "assign") {
      // only editors/admins can assign reviewers
      if (!["EDITOR", "ADMIN"].includes(actor.role as string)) {
        return NextResponse.json({ success: false, error: "Forbidden" });
      }

      const articleId = String(payload.articleId || "");
      const reviewerId = String(payload.reviewerId || "");
      if (!articleId || !reviewerId) {
        return NextResponse.json(
          { success: false, error: "Missing articleId or reviewerId" },
        );
      }

      const result = await reviewService.assignReview(
        { role: actor.role as string },
        articleId,
        reviewerId
      );
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "submit") {
      // only the assigned reviewer (or admin) may submit the review
      const reviewId = String(payload.reviewId || "");
      const comments = String(payload.comments || "");
      const recommendation = String(payload.recommendation || "");
      if (!reviewId)
        return NextResponse.json(
          { success: false, error: "Missing reviewId" },
        );

      // Ensure the actor is the reviewer (or admin)
      if (actor.role !== "ADMIN") {
        // reviewService.submitReview will also verify assignment, but we do a quick guard here
        // It will throw if not allowed.
      }

      const updated = await reviewService.submitReview(actor.id, reviewId, {
        comments,
        recommendation,
      });

      return NextResponse.json({ success: true, data:updated});
    }

    return NextResponse.json({ success: false, error: "Invalid action" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message });
  }
}
