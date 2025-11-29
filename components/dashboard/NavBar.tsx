"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "../ui/sidebar";
import { Create } from "./Create";

export const NavBar = () => {
  const isMobile = useIsMobile();
  return (
    <nav className="h-20 max-md:w-full md:w-[calc(100vw-18rem)] border-b border-b-sidebar-border flex items-center justify-between px-5 fixed top-0 z-50 bg-background">
      <header>
        <h1 className="font-bold text-xl text-secondary-foreground">
          {isMobile && <SidebarTrigger className="mr-2 inline-flex" />}
          ZapLink
        </h1>
        {!isMobile && (
          <p className="text-secondary-foreground/50">
            Manage, view and analyze links
          </p>
        )}
      </header>
      <Create />
    </nav>
  );
};
