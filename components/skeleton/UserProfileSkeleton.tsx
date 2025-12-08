"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const UserProfileSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar Skeleton */}
          <div className="relative">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          {/* Text Section */}
          <div className="flex-1 space-y-3 w-full">
            {/* Name */}
            <Skeleton className="h-6 w-48" />

            {/* Role */}
            <Skeleton className="h-4 w-40" />

            {/* Info list */}
            <div className="flex flex-wrap gap-4 text-sm">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Edit Button */}
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
};
