import React from 'react'
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

const ArticleCardSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="flex gap-4 py-4">
            <Skeleton className="h-35 w-35" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ArticleCardSkeleton