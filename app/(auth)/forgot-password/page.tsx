"use client";

import { useState, useEffect } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

// Step 1: Email Schema
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
type EmailFormValues = z.infer<typeof emailSchema>;

// Step 2: OTP Schema
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must be numeric" }),
});
type OTPFormValues = z.infer<typeof otpSchema>;

// Step 3: Reset Password Schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const steps = [
    { key: "email", label: "Email" },
    { key: "otp", label: "Verify OTP" },
    { key: "reset", label: "Reset Password" },
  ];

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onEmailSubmit = (values: EmailFormValues) => {
    setEmail(values.email);
    console.log("Send OTP to:", values.email);
    setStep("otp");
    startResendTimer();
  };

  // OTP form
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onOTPSubmit = (values: OTPFormValues) => {
    console.log("Verify OTP:", values.otp, "for email:", email);
    // TODO: Verify OTP via Better Auth
    alert("OTP verified successfully!");
    setStep("reset");
  };

  // Reset Password form
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onResetSubmit = (values: ResetPasswordFormValues) => {
    console.log("Set new password for:", email, values.password);
    // TODO: Call Better Auth to update password
    alert("Password changed successfully!");
    setStep("email");
  };

  // Resend Timer
  const startResendTimer = () => {
    setCanResend(false);
    setTimer(30);
  };

  useEffect(() => {
    if (step === "otp" && !canResend) {
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, canResend]);

  const handleResendOTP = () => {
    console.log("Resending OTP to:", email);
    startResendTimer();
  };

  // Step Indicator
  const renderSteps = () => {
    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;

          return (
            <div key={s.key} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium ${
                  isCompleted
                    ? "bg-green-600 text-white border-green-600"
                    : isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <div className="ml-2 text-sm font-medium text-muted-foreground">
                {s.label}
              </div>

              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? "bg-green-600" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="flex p-4 dark:bg-transparent min-h-screen">
      <div className="m-auto w-full max-w-sm">
        {/* Step Progress */}
        {renderSteps()}

        {/* Step 1: Email */}
        {step === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="bg-card rounded-[calc(var(--radius)+.125rem)] border p-8 shadow-md"
            >
              <h1 className="text-xl font-semibold mb-2">Recover Password</h1>
              <p className="text-sm mb-6">
                Enter your email to receive a reset OTP
              </p>

              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full mt-4" type="submit">
                Send OTP
              </Button>

              <p className="text-center text-sm mt-4">
                Remembered your password?{" "}
                <Button asChild variant="link" className="px-2">
                  <Link href="/login">Log in</Link>
                </Button>
              </p>
            </form>
          </Form>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOTPSubmit)}
              className="bg-card rounded-[calc(var(--radius)+.125rem)] border p-8 shadow-md"
            >
              <h1 className="text-xl font-semibold mb-2">Verify OTP</h1>
              <p className="text-sm mb-6">
                Enter the 6-digit OTP sent to <b>{email}</b>
              </p>

              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <div className="flex justify-center w-full">
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full flex justify-center gap-2"
                        >
                          <InputOTPGroup className="flex flex-1 justify-evenly gap-2">
                            {[0, 1, 2].map((i) => (
                              <InputOTPSlot key={i} index={i} />
                            ))}
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup className="flex flex-1 justify-evenly gap-2">
                            {[3, 4, 5].map((i) => (
                              <InputOTPSlot key={i} index={i} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full mt-6" type="submit">
                Verify OTP
              </Button>

              <p className="text-center text-sm mt-4">
                Didn&apos;t receive OTP?{" "}
                {canResend ? (
                  <Button
                    variant="link"
                    className="px-2"
                    type="button"
                    onClick={handleResendOTP}
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <span className="text-muted-foreground">
                    Resend in {timer}s
                  </span>
                )}
              </p>
            </form>
          </Form>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="bg-card rounded-[calc(var(--radius)+.125rem)] border p-8 shadow-md"
            >
              <h1 className="text-xl font-semibold mb-2">Set New Password</h1>
              <p className="text-sm mb-6">
                Create a strong password for your account.
              </p>

              {/* New Password */}
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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

              {/* Confirm Password */}
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirm ? (
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

              <Button className="w-full mt-6" type="submit">
                Reset Password
              </Button>

              <p className="text-center text-sm mt-4">
                <Button asChild variant="link" className="px-2">
                  <Link href="/login">Back to Login</Link>
                </Button>
              </p>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}
