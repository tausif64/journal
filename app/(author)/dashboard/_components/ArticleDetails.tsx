"use client"
import { useArticleById } from '@/hooks/use-user';
import AutherArticleCard from './AuthorArticleCard';
import { Card, CardContent } from '@/components/ui/card';
// import PaymentClient from './PaymentClient';
import ArticleDetailSkeleton from '@/components/article-detail-skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

const ArticleDetails = ({id}:{id:string}) => {
  const router = useRouter()
  const { article, isLoading, isError, error } = useArticleById(id);

  if(isLoading) {
    return <ArticleDetailSkeleton />
  }
  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? "We couldn’t load this article."}
        </p>
        <Button onClick={() => router.push("/articles")}>
          Back to articles
        </Button>
      </div>
    );
  }


  return (
    <>
      <AutherArticleCard article={article} />
      <Card className='mt-4'>
        <CardContent className="py-6 space-y-4 ">
          <div>
            <h2 className="text-lg font-semibold mb-2">Abstract</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {article.abstract}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Authors</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {(article.authors || [])
                .slice()
                .sort((a, b) => a.authorOrder - b.authorOrder)
                .map((aa) => (
                  <li key={aa.id}>
                    <span className="font-medium">
                      {aa.author?.name ?? aa.author?.email}
                    </span>
                    {" — "}
                    <span className="text-xs text-muted-foreground">
                      {aa.author?.email}
                    </span>
                    {aa.isCorresponding ? (
                      <span className="ml-2 text-xs">(Corresponding)</span>
                    ) : null}
                  </li>
                ))}
            </ul>
          </div>

          {article.editor && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Editor</h3>
              <p className="text-xs text-muted-foreground">
                {article.editor.name ?? article.editor.email}
              </p>
            </div>
          )}

          {article.reviews && article.reviews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Reviews</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  article.reviews.map((r: any) => (
                    <div key={r.id} className="border rounded p-2">
                      <div className="text-xs font-medium">
                        {r.reviewer?.name ?? r.reviewer?.email} ·{" "}
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm">{r.comments}</div>
                      <div className="text-xs text-muted-foreground">
                        Recommendation: {r.recommendation}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* <div>
            <h3 className="text-sm font-semibold mb-2">Payment</h3>
            <PaymentClient
              articleId={article.id}
              existingPayment={article.payment ?? null}
              articleStatus={article.status}
            />
          </div> */}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Article PDF</h2>
          <a
            href={article.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            Open in new tab
          </a>
        </div>

        <div className="border rounded-lg overflow-hidden bg-muted">
          <object
            // data={article.fileUrl}
            data={"/sample.pdf"}
            type="application/pdf"
            className="w-full h-[520px] md:h-[850px]"
          />
        </div>
      </div>
    </>
  );
}

export default ArticleDetails;