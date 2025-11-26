"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../ui/app-sidebar";

const SidebarSection = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <>
      <AppSidebar />
      {isMobile && <SidebarTrigger />}
      {children}
    </>
  );
};

export default SidebarSection;
