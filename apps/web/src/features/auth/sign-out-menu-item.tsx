import { useNavigate } from "@tanstack/react-router";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useAuthClient } from "./auth-client-context";
import { useSetSession } from "./session";

export function SignOutMenuItem() {
  const auth = useAuthClient();
  const setSession = useSetSession();
  const navigate = useNavigate();

  async function signOut() {
    await auth.signOut();
    setSession(null);
    await navigate({ to: "/sign-in" });
  }

  return <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>;
}
