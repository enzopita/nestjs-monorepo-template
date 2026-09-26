import type { AuthClient, AuthResult, Session } from "../auth-client";

type Credentials = { name: string; email: string; password: string };

// In-memory stand-in for the Better Auth client, used through AuthClientProvider.
export class FakeAuthClient implements AuthClient {
  session: Session | null = null;
  readonly users: Credentials[] = [];
  readonly calls: string[] = [];

  async getSession() {
    return this.session;
  }

  async signIn(input: { email: string; password: string }) {
    this.calls.push(`signIn:${input.email}`);

    const user = this.users.find((u) => u.email === input.email && u.password === input.password);

    return user === undefined
      ? { session: null, error: "Invalid email or password" }
      : this.start(user);
  }

  async signUp(input: Credentials) {
    this.calls.push(`signUp:${input.email}`);
    this.users.push(input);

    return this.start(input);
  }

  async signOut() {
    this.session = null;
  }

  private start(user: Credentials): AuthResult {
    this.session = { user: { id: user.email, name: user.name, email: user.email } };

    return { session: this.session, error: null };
  }
}
