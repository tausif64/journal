// app/(author)/submit/page.tsx
import SubmitArticleForm from "../_components/SubmitArticleForm";

export const metadata = { title: "Submit Article" };

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Submit Article</h1>
        <div className="bg-white rounded shadow p-6">
          <SubmitArticleForm
            onSuccess={() => {
              /* optionally navigate or refresh */
            }}
          />
        </div>
      </div>
    </main>
  );
}
