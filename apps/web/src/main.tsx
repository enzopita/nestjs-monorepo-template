import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { env } from "./env";
import { createBetterAuthClient } from "./features/auth/auth-client";
import { AuthClientProvider } from "./features/auth/auth-client-context";
import { ThemeProvider } from "./features/theme/theme-provider";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const auth = createBetterAuthClient(env.VITE_API_URL);

const router = createRouter({
  routeTree,
  context: { queryClient, auth },
  defaultPreload: "intent",
  // Loaders read from React Query, which owns caching.
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthClientProvider client={auth}>
          <RouterProvider router={router} />
        </AuthClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
