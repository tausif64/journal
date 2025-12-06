// app/(author)/submissions/page.tsx
import AuthorDashboardClient from "../_components/AuthorDashboardClient";

export const metadata = { title: "My Submissions" };

export default function SubmissionsPage() {
  // reuse the client component which already loads articles
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">My Submissions</h1>
        <div className="bg-white rounded shadow p-4">
          {/* If you prefer a lighter component that only shows table, import _components/ArticleTable and manage data there.
              Here we re-use the dashboard client for convenience. */}
          <AuthorDashboardClient />
        </div>
      </div>
    </main>
  );
}
