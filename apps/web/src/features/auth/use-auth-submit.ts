import { useState } from "react";

import { fallbackError, type AuthResult } from "./auth-client";
import { useSetSession } from "./session";

// Shared submit flow for auth forms: store the session on success, expose the error otherwise.
export function useAuthSubmit(onSuccess: () => void) {
  const setSession = useSetSession();
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(action: () => Promise<AuthResult>) {
    setFormError(null);

    let result: AuthResult;

    try {
      result = await action();
    } catch {
      // Network failures (API down, CORS) reject instead of returning an error.
      return setFormError(fallbackError);
    }

    const { session, error } = result;

    if (session === null) return setFormError(error);

    setSession(session);
    onSuccess();
  }

  return { formError, submit };
}
