"use client"

import { Button } from "./ui/button";
import { UserDropdown } from "./UserDropdown";
import { useEffect } from "react";
import { useSession } from "@/hooks/use-user";
import { usePathname, useRouter } from "next/navigation";

const UserArea = () => {
  const { session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const role = session?.user?.role;
    if (!role) return;

    if (role === "ADMIN" && !pathname.startsWith("/admin")) {
      router.replace("/admin/dashboard");
      return;
    }
    if (role === "EDITOR" && !pathname.startsWith("/editor")) {
      router.replace("/editor");
    }
  }, [pathname, router, session?.user?.role]);

  return session?.user ? (
    <UserDropdown
      email={session.user.email}
      name={
        session.user.name && session.user.name.length > 0
          ? session.user.name
          : session.user.email.split("@")[0]
      }
      image={session.user.image ?? ""}
      role={session.user.role}
    />
  ) : (
    <Button asChild className="rounded-full">
      <a href="/login">Publish with us</a>
    </Button>
  );
};

export default UserArea
