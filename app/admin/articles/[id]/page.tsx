import ArticleViewClient from "../_components/ArticleViewClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ArticleViewClient id={id} />;
}
