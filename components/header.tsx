"use client";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useUserStore } from "@/hooks/store/use-store";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const logOut = () => {
    useUserStore.setState({ user: null });
    router.push("/auth");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="outline" className="ml-auto" onClick={logOut}>
          Log out
        </Button>
      </div>
    </header>
  );
};

export default Header;
