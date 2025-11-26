"use client";
import Main from "@/components/dashboard/Main";
import SidebarSection from "@/components/dashboard/SideBarSection";
import { Toaster } from "sonner";

import { Providers } from "../../components/provider";
export default function App() {
  return (
    <>
      <Main />
      <Toaster />
    </>
  );
}
