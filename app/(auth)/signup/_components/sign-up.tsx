"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

// 🧩 Validation schema
const signUpSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {

  const router = useRouter()
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const name = values.firstname + " " + values.lastname;
    try {
      await authClient.signUp.email({
        name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successful");
            router.push('/')
          },
          onError: () => {
            toast.success("Failed to Sign in");
          },
        },
      });
    } catch {
      toast.error("Sign up failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          {/* Header */}
          <div>
            <Link href="/" aria-label="go home">
              MACROJ
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create a MACROJ Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome! Create an account to get started
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Firstname & Lastname */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lastname</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating Account..." : "Continue"}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted rounded-b-[var(--radius)] border-t p-3">
          <p className="text-center text-sm">
            Have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
