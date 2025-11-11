import BackButton from "@/components/back-button"
import Link from "next/link";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-svh flex-col justify-center items-center">
      <div className="absolute top-5 left-5">
        <BackButton />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary hover:underline">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
};


export default AuthLayout