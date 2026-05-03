"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const emailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

const resetSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

interface RoleForgotPasswordFormProps {
  roleLabel: string;
  basePath: string;
  requiredRole?: "AUTHOR" | "EDITOR" | "ADMIN";
}

export function RoleForgotPasswordForm({
  roleLabel,
  basePath,
  requiredRole,
}: RoleForgotPasswordFormProps) {
  const params = useSearchParams();
  const token = params.get("token");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSendReset = async (values: EmailFormValues) => {
    try {
      if (requiredRole) {
        const roleCheck = await fetch("/api/auth/role-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, role: requiredRole }),
        });
        const roleCheckJson = (await roleCheck.json()) as {
          success?: boolean;
          allowed?: boolean;
          error?: string;
        };
        if (!roleCheckJson.success || roleCheckJson.allowed !== true) {
          toast.error(
            roleCheckJson.error ||
              `This section only supports ${requiredRole.toLowerCase()} accounts.`
          );
          return;
        }
      }

      const resetLink =
        typeof window === "undefined"
          ? ""
          : `${window.location.origin}${basePath}/forgot-password`;

      const response = await authClient.forgetPassword({
        email: values.email,
        redirectTo: resetLink,
      });

      if (response.error) {
        toast.error(response.error.message || "Could not send reset link");
        return;
      }

      toast.success("Reset link sent to your email");
      emailForm.reset();
    } catch {
      toast.error("Could not send reset link");
    }
  };

  const onResetPassword = async (values: ResetFormValues) => {
    if (!token) {
      toast.error("Missing reset token");
      return;
    }

    try {
      if (requiredRole) {
        const roleCheck = await fetch("/api/auth/reset-role-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, role: requiredRole }),
        });
        const roleCheckJson = (await roleCheck.json()) as {
          success?: boolean;
          allowed?: boolean;
          error?: string;
        };
        if (!roleCheckJson.success || roleCheckJson.allowed !== true) {
          toast.error(
            roleCheckJson.error || "This reset link is not valid for this section."
          );
          return;
        }
      }

      const response = await authClient.resetPassword({
        token,
        newPassword: values.password,
      });

      if (response.error) {
        toast.error(response.error.message || "Could not reset password");
        return;
      }

      toast.success("Password reset successful");
      resetForm.reset();
    } catch {
      toast.error("Could not reset password");
    }
  };

  return token ? (
    <Form {...resetForm}>
      <form
        onSubmit={resetForm.handleSubmit(onResetPassword)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
      >
        <div className="p-8 pb-6">
          <h1 className="text-xl font-semibold">Reset {roleLabel} Password</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Set your new password.
          </p>

          <div className="space-y-6">
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={resetForm.formState.isSubmitting}
            >
              {resetForm.formState.isSubmitting ? "Saving..." : "Reset Password"}
            </Button>
          </div>

          <p className="mt-4 text-center text-sm">
            <Link href={`${basePath}/login`} className="underline">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  ) : (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onSendReset)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
      >
        <div className="p-8 pb-6">
          <h1 className="text-xl font-semibold">Forgot {roleLabel} Password</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your email to receive a reset link.
          </p>

          <div className="space-y-6">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={emailForm.formState.isSubmitting}
            >
              {emailForm.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <p className="mt-4 text-center text-sm">
            <Link href={`${basePath}/login`} className="underline">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
