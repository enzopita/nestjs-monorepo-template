import { createAuthClient } from "better-auth/client";

export type Session = {
  user: { id: string; name: string; email: string };
};

export type AuthResult = { session: Session; error: null } | { session: null; error: string };

// The slice of Better Auth the app depends on, so tests can inject a fake.
export interface AuthClient {
  getSession(): Promise<Session | null>;
  signIn(input: { email: string; password: string }): Promise<AuthResult>;
  signUp(input: { name: string; email: string; password: string }): Promise<AuthResult>;
  signOut(): Promise<void>;
}

const fallbackError = "Something went wrong. Please try again.";

type BetterAuthResponse = {
  data: { user: Session["user"] } | null;
  error: { message?: string | undefined } | null;
};

// Sign-in and sign-up return the user, so the session is known without another request.
function toResult({ data, error }: BetterAuthResponse): AuthResult {
  if (data === null) return { session: null, error: error?.message ?? fallbackError };

  return { session: { user: data.user }, error: null };
}

export function createBetterAuthClient(baseURL: string): AuthClient {
  // The API lives on another origin, so session cookies must be sent explicitly.
  const client = createAuthClient({ baseURL, fetchOptions: { credentials: "include" } });

  return {
    async getSession() {
      const { data } = await client.getSession();

      return data === null ? null : { user: data.user };
    },
    async signIn(input) {
      return toResult(await client.signIn.email(input));
    },
    async signUp(input) {
      return toResult(await client.signUp.email(input));
    },
    async signOut() {
      await client.signOut();
    },
  };
}
