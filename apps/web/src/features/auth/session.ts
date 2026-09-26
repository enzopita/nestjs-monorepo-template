import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { AuthClient, Session } from "./auth-client";
import { useAuthClient } from "./auth-client-context";

export const sessionQueryKey = ["session"] as const;

export function sessionQueryOptions(auth: AuthClient) {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: () => auth.getSession(),
    staleTime: 60_000,
  });
}

export function useSession() {
  return useSuspenseQuery(sessionQueryOptions(useAuthClient())).data;
}

// Writes the known session after sign-in, sign-up, or sign-out so guards see it without a refetch.
export function useSetSession() {
  const queryClient = useQueryClient();

  return (session: Session | null) => queryClient.setQueryData(sessionQueryKey, session);
}
