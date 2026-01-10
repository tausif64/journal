
import { Skeleton } from './ui/skeleton'
import { Card, CardContent } from './ui/card'

const ArticleDetailSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
            <header>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </header>
    
            <Card>
              <CardContent className="flex gap-4 py-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
    
            <Skeleton className="h-72 w-full" />
          </div>
  )
}

export default ArticleDetailSkeleton