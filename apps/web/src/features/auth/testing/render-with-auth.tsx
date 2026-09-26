import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

import { AuthClientProvider } from "../auth-client-context";
import { FakeAuthClient } from "./fake-auth-client";

export function renderWithAuth(ui: ReactNode, auth = new FakeAuthClient()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <AuthClientProvider client={auth}>{ui}</AuthClientProvider>
    </QueryClientProvider>,
  );

  return { auth, queryClient };
}
