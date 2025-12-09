

type PageProps = {
  params: { id: string };
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
    </>
  );
}
