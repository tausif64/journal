"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, FileText, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/use-signout";

interface EditorShellProps {
  children: React.ReactNode;
}

const links = [
  { href: "/editor", label: "Assigned Articles", icon: FileText },
  { href: "/editor-auth/change-password", label: "Change Password", icon: KeyRound },
];

export function EditorShell({ children }: EditorShellProps) {
  const pathname = usePathname();
  const handleSignOut = useSignOut();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-background p-3 md:sticky md:top-4 md:h-[calc(100vh-2rem)]">
          <div className="mb-4 border-b pb-3">
            <p className="text-sm text-muted-foreground">Editorial Workspace</p>
            <h2 className="text-lg font-semibold">Editor Area</h2>
          </div>

          <nav className="space-y-1">
            {links.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t pt-3">
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <section className="rounded-xl border bg-background p-4 md:p-6">
          {children}
        </section>
      </div>
    </div>
  );
}
