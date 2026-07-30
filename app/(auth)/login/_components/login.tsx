"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const signIn = await authClient.signIn.email(values);
      if (signIn.error) {
        toast.error(signIn.error.message || "Failed to log in");
        return;
      }

      const session = await authClient.getSession();
      const role = session.data?.user?.role;

      if (role !== "AUTHOR") {
        await authClient.signOut();
        toast.error("Use admin/editor login for this account.");
        return;
      }

      toast.success("Log in successful");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log in");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              MACROJ
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to MACROJ</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Sign in to continue
            </p>
          </div>

          <hr className="my-4 border-dashed" />

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
                      <Link href="/forgot-password" className="text-sm">
                        Forgot your password?
                      </Link>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

        <div className="bg-muted rounded-b-[calc(var(--radius)+.125rem)] border-t p-3">
          <p className="text-center text-sm">
            Don&apos;t have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/signup">Create account</Link>
            </Button>
          </p>
          <div className="mt-1 text-center text-xs text-muted-foreground">
            <Link href="/admin-auth/login" className="underline">
              Admin login
            </Link>
            {" | "}
            <Link href="/editor-auth/login" className="underline">
              Editor login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
