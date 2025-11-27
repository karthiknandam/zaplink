import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarSection from "@/components/dashboard/SideBarSection";
import { Providers } from "@/components/provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={"min-h-screen bg-background font-sans antialiased"}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <Providers>
                <SidebarSection>
                  {children}
                  <Toaster />
                </SidebarSection>
              </Providers>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
