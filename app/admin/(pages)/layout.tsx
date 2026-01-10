import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { headers } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   if (!session) {
//     return redirect("/");
//   }
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col p-2">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default layout;
