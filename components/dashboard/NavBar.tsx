import { Create } from "./Create";

export const NavBar = () => {
  return (
    <nav className="h-20 w-full border-b border-b-sidebar-border flex items-center justify-between px-5 sticky top-0 z-50 bg-background">
      <header>
        <h1 className="font-bold text-xl text-secondary-foreground">
          ZapLinks
        </h1>
        <p className="text-secondary-foreground/50">
          Manage, view and analyze links
        </p>
      </header>
      <Create />
    </nav>
  );
};
