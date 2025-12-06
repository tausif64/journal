// app/(author)/submissions/[id]/page.tsx
export const metadata = { title: "Submission" };

export default async function SubmissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Optionally fetch server-side details here using prisma or your service:
  // const article = await prisma.article.findUnique({ where: { id: params.id }, include: { author: true, reviews: true } });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Submission</h1>
        <div className="bg-white rounded shadow p-4">
          <p className="mb-4">
            <strong>Article ID:</strong> {params.id}
          </p>
          <p>Replace with server-side fetched article details if desired.</p>
        </div>
      </div>
    </main>
  );
}
