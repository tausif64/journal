import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const actor = await userDAL.findById(session.user.id);
    if (actor?.role === "ADMIN") redirect("/admin/dashboard");
    if (actor?.role === "EDITOR") redirect("/editor");
    redirect("/dashboard");
  }

  return (
    <RoleLoginForm
      role="ADMIN"
      title="Admin Login"
      description="Sign in to access the admin panel."
      forgotHref="/admin-auth/forgot-password"
      successRedirect="/admin/dashboard"
    />
  );
}
