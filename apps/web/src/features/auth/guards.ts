import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

import type { AuthClient } from "./auth-client";
import { safeRedirect } from "./safe-redirect";
import { sessionQueryOptions } from "./session";

type GuardContext = { auth: AuthClient; queryClient: QueryClient };

// Uses the cached session when present; sign-in, sign-up, and sign-out keep it current.
function getSession({ auth, queryClient }: GuardContext) {
  return queryClient.query({ ...sessionQueryOptions(auth), staleTime: "static" });
}

export async function requireSession(context: GuardContext, location: string) {
  const session = await getSession(context);

  if (session === null) {
    throw redirect({ to: "/sign-in", search: { redirect: location } });
  }

  return session;
}

export async function redirectIfSignedIn(context: GuardContext, target: string | undefined) {
  if ((await getSession(context)) !== null) {
    throw redirect({ href: safeRedirect(target) });
  }
}
