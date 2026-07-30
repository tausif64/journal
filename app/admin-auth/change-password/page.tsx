import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
import { RoleChangePasswordForm } from "@/components/auth/role-change-password-form";

export default async function AdminChangePasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin-auth/login");
  }

  const actor = await userDAL.findById(session.user.id);
  if (!actor) {
    redirect("/admin-auth/login");
  }

  if (actor.role !== "ADMIN") {
    if (actor.role === "EDITOR") redirect("/editor");
    redirect("/dashboard");
  }

  return (
    <RoleChangePasswordForm
      title="Change Admin Password"
      description="Update your current password."
    />
  );
}
