import { AppSidebar } from "../ui/app-sidebar";

const SidebarSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppSidebar />
      {children}
    </>
  );
};

export default SidebarSection;
