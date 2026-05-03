import ArticleDetailClient from "./ArticleDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ArticleDetailClient articleSlug={slug} />;
}
