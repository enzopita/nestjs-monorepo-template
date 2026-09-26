import { createContext, use, type ReactNode } from "react";

import type { AuthClient } from "./auth-client";

const AuthClientContext = createContext<AuthClient | null>(null);

export function AuthClientProvider({
  client,
  children,
}: {
  client: AuthClient;
  children: ReactNode;
}) {
  return <AuthClientContext value={client}>{children}</AuthClientContext>;
}

export function useAuthClient() {
  const client = use(AuthClientContext);

  if (client === null) throw new Error("useAuthClient must be used inside AuthClientProvider");

  return client;
}
