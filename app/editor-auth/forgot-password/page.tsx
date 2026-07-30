import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
import { RoleForgotPasswordForm } from "@/components/auth/role-forgot-password-form";

export default async function EditorForgotPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const actor = await userDAL.findById(session.user.id);
    if (actor?.role === "ADMIN") redirect("/admin/dashboard");
    if (actor?.role === "EDITOR") redirect("/editor");
    redirect("/dashboard");
  }

  return (
    <RoleForgotPasswordForm
      roleLabel="Editor"
      basePath="/editor-auth"
      requiredRole="EDITOR"
    />
  );
}
