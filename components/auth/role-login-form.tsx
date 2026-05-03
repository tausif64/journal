"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof schema>;
type AuthRole = "ADMIN" | "EDITOR";

interface RoleLoginFormProps {
  role: AuthRole;
  title: string;
  description: string;
  forgotHref: string;
  successRedirect: string;
}

export function RoleLoginForm({
  role,
  title,
  description,
  forgotHref,
  successRedirect,
}: RoleLoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const signInResult = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (signInResult.error) {
        toast.error(signInResult.error.message || "Login failed");
        return;
      }

      const sessionResult = await authClient.getSession();
      const signedRole = sessionResult.data?.user?.role;

      if (signedRole !== role) {
        await authClient.signOut();
        toast.error(
          role === "ADMIN"
            ? "This page only allows admin login."
            : "This page only allows editor login."
        );
        return;
      }

      toast.success("Login successful");
      router.push(successRedirect);
      router.refresh();
    } catch {
      toast.error("Login failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
      >
        <div className="p-8 pb-6">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mb-6 text-sm text-muted-foreground">{description}</p>

          <div className="space-y-6">
            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password *</FormLabel>
                    <Button asChild variant="link" size="sm" type="button">
                      <Link href={forgotHref}>Forgot password?</Link>
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
