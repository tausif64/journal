"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { useSignOut } from "@/hooks/use-signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const handleSignOut = useSignOut();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          type="button"
          className="cursor-default pr-10 hover:bg-sidebar-accent/70"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
        <SidebarMenuAction
          onClick={handleSignOut}
          aria-label="Log out"
          title="Log out"
        >
          <IconDotsVertical />
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
