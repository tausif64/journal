"use client"

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { UserDropdown } from "./UserDropdown";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";

const UserArea = () => {
  const { session: apiSession, setSession } = useUserStore();

  const { data: fetchedSession } = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
  });

  useEffect(() => {
    if (fetchedSession?.data) {
      setSession({
        session: fetchedSession.data.session,
        user: fetchedSession.data.user,
      });
    } else {
      setSession(null);
    }
  }, [fetchedSession, setSession]);

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