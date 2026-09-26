import { createFileRoute, Link, Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { CircleUserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { requireSession } from "@/features/auth/guards";
import { useSession } from "@/features/auth/session";
import { SignOutMenuItem } from "@/features/auth/sign-out-menu-item";
import { ThemeToggle } from "@/features/theme/theme-toggle";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context, location }) => requireSession(context, location.href),
  component: AppLayout,
});

function AppLayout() {
  const session = useSession();
  const location = useLocation();

  // The guard only runs on navigation; a refetch can find the session expired or revoked meanwhile.
  if (session === null) {
    return <Navigate to="/sign-in" search={{ redirect: location.href }} replace />;
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-heading font-semibold">
            App
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

function UserMenu() {
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Account" />}>
        <CircleUserIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{session?.user.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
