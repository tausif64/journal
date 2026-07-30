import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
import { RoleChangePasswordForm } from "@/components/auth/role-change-password-form";

export default async function EditorChangePasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/editor-auth/login");
  }

  const actor = await userDAL.findById(session.user.id);
  if (!actor) {
    redirect("/editor-auth/login");
  }

  if (actor.role !== "EDITOR") {
    if (actor.role === "ADMIN") redirect("/admin/dashboard");
    redirect("/dashboard");
  }

  return (
    <RoleChangePasswordForm
      title="Change Editor Password"
      description="Update your current password."
    />
  );
}
