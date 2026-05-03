import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
import { EditorShell } from "@/components/editor/editor-shell";

export const metadata: Metadata = {
  title: "Editor Area",
  description: "Assigned articles and editorial reviews",
};

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/editor-auth/login");

  const actor = await userDAL.findById(session.user.id);
  if (!actor) return redirect("/editor-auth/login");
  if (actor.role === "ADMIN") return redirect("/admin/dashboard");
  if (actor.role !== "EDITOR") return redirect("/dashboard");

  return <EditorShell>{children}</EditorShell>;
}
