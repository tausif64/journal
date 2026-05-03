import ArticleDetails from "../../_components/ArticleDetails";

type PageProps = {
  params: { id: string };
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <ArticleDetails id={id} />
    </div>
  );
}