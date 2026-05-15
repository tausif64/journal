import { Badge } from "@/components/ui/badge";
import { ArticleStatus } from "@/types/dto";

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const map: Record<ArticleStatus, string> = {
    SUBMITTED: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    REVISION: "bg-orange-100 text-orange-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
  };

  return <Badge className={map[status]}>{status}</Badge>;
}
