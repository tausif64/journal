// app/(author)/submit/page.tsx
import SubmitArticleForm from "../_components/SubmitArticleForm";

export const metadata = {
  title: "Submit Article",
  description: "Submit a new research article for review",
};

export default function SubmitArticlePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Submit Your Article
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Upload your research paper for editorial review. Once accepted, the
            editorial team will handle cover image design and publication.
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <ul className="list-disc pl-5 space-y-1">
            <li>Upload the article as a PDF file from your device.</li>
            <li>Make sure your abstract is clear and well structured.</li>
            <li>Keywords help reviewers find suitable reviewers faster.</li>
            <li>Cover images are added later by the admin team.</li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white shadow-xl border p-6 md:p-8">
          <SubmitArticleForm />
        </div>
      </div>
    </main>
  );
}
