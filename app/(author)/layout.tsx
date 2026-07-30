
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Reasearch article",
};

const AuthorLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return redirect("/");
    }
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default AuthorLayout