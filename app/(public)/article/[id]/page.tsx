import ArticleDetailClient from "./ArticleDetailClient";

type PageProps = {
  params: { id: string };
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ArticleDetailClient articleId={id} />;
}
