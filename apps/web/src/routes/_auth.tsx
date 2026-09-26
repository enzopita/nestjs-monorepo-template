import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { redirectIfSignedIn } from "@/features/auth/guards";
import { ThemeToggle } from "@/features/theme/theme-toggle";

// Shared by sign-in and sign-up: where to go once authenticated.
const searchSchema = z.object({ redirect: z.string().optional().catch(undefined) });

export const Route = createFileRoute("/_auth")({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => redirectIfSignedIn(context, search.redirect),
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="relative flex min-h-svh items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
