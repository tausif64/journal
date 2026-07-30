import BackButton from "@/components/back-button"
import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    const actor = await userDAL.findById(session.user.id);
    if (actor?.role === "ADMIN") return redirect("/admin/dashboard");
    if (actor?.role === "EDITOR") return redirect("/editor");
    return redirect("/");
  }
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
