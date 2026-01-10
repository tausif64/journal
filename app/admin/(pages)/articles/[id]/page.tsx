"use client";

import { useParams } from "next/navigation";

export default function DebugArticlePage() {
  const params = useParams();

  return (
    <div className="p-6">
      <h1>Article page works</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
