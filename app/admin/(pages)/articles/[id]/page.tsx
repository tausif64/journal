"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1>Article ID</h1>
      <pre>{id}</pre>
    </div>
  );
}
