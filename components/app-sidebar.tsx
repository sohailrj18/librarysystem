"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/hooks/store/use-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user);
  const path = usePathname();

  const navMainWithoutFilter = [
    {
      title: "My Books",
      isActive: true,
      url: "/my-books",
      role: ["ADMIN", "READER"],
    },
    {
      title: "All Books",
      url: "/all-books",
      role: ["ADMIN", "READER"],
    },
    {
      title: "Users",
      url: "/users",
      role: ["ADMIN"],
    },
  ];

  const navMain = navMainWithoutFilter.filter((item) =>
    item.role.includes(user?.role || "READER")
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center text-xl font-bold">
          Library
        </div>
        <div className="flex flex-col items-center justify-center">
          <span>
            {user?.username
              ? `Welcome ${user?.fullName}`
              : "Please login to access your account"}
          </span>
          <span>{user?.role}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={path === item.url}>
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
