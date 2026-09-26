import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import type { AuthClient } from "@/features/auth/auth-client";

type RouterContext = {
  queryClient: QueryClient;
  auth: AuthClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});
