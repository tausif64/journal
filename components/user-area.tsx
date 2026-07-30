"use client";

import { Button } from "./ui/button";
import { UserDropdown } from "./UserDropdown";
import { useSession } from "@/hooks/use-user";

const UserArea = () => {
  const { session } = useSession();

  if (!session?.user || session?.user.role !== "AUTHOR") {
    return (
      <Button asChild className="rounded-full">
        <a href="/login">Publish with us</a>
      </Button>
    );
  }

  return (
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
  );
};

export default UserArea;
