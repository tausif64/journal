"use client"

import { Button } from "./ui/button";
import { UserDropdown } from "./UserDropdown";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useSession } from "@/hooks/use-user";

const UserArea = () => {
  const { session: apiSession, setSession } = useUserStore();

  const { session } = useSession();

  useEffect(() => {
    if (session) {
      setSession(session);
    } else {
      setSession(null);
    }
  }, [session, setSession]);

  return apiSession?.user ? (
    <UserDropdown
      email={apiSession.user.email}
      name={
        apiSession.user.name && apiSession.user.name.length > 0
          ? apiSession.user.name
          : apiSession.user.email.split("@")[0]
      }
      image={apiSession.user.image ?? ""}
    />
  ) : (
    <Button asChild className="rounded-full">
      <a href="/login">Publish with us</a>
    </Button>
  );
};

export default UserArea