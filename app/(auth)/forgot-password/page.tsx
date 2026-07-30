import { RoleForgotPasswordForm } from "@/components/auth/role-forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <RoleForgotPasswordForm
      roleLabel="Author"
      basePath=""
      requiredRole="AUTHOR"
    />
  );
}
