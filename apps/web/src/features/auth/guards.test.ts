import { QueryClient } from "@tanstack/react-query";
import { isRedirect } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { redirectIfSignedIn, requireSession } from "./guards";
import { FakeAuthClient } from "./testing/fake-auth-client";

const session = { user: { id: "1", name: "Ada", email: "ada@example.com" } };

function setup(signedIn: boolean) {
  const auth = new FakeAuthClient();
  auth.session = signedIn ? session : null;

  return { auth, queryClient: new QueryClient() };
}

async function thrown(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error;
  }

  return undefined;
}

describe("requireSession", () => {
  it("redirects to sign-in, keeping the requested location", async () => {
    const context = setup(false);

    const error = await thrown(requireSession(context, "/settings?tab=1"));

    expect(isRedirect(error)).toBe(true);
    expect(error).toMatchObject({
      options: { to: "/sign-in", search: { redirect: "/settings?tab=1" } },
    });
  });

  it("returns the session when signed in", async () => {
    await expect(requireSession(setup(true), "/")).resolves.toEqual(session);
  });
});

describe("redirectIfSignedIn", () => {
  it("sends signed-in users to the safe redirect target", async () => {
    const error = await thrown(redirectIfSignedIn(setup(true), "https://evil.com"));

    expect(isRedirect(error)).toBe(true);
    expect(error).toMatchObject({ options: { href: "/" } });
  });

  it("lets signed-out users through", async () => {
    await expect(redirectIfSignedIn(setup(false), undefined)).resolves.toBeUndefined();
  });
});
