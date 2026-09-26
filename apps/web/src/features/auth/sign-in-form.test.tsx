import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { sessionQueryKey } from "./session";
import { SignInForm } from "./sign-in-form";
import { FakeAuthClient } from "./testing/fake-auth-client";
import { renderWithAuth } from "./testing/render-with-auth";

async function fillAndSubmit(email: string, password: string) {
  if (email !== "") await userEvent.type(screen.getByLabelText("Email"), email);

  if (password !== "") await userEvent.type(screen.getByLabelText("Password"), password);

  await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
}

describe("SignInForm", () => {
  it("shows validation errors without calling the API", async () => {
    const { auth } = renderWithAuth(<SignInForm onSuccess={vi.fn()} />);

    await fillAndSubmit("not-an-email", "");

    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
    expect(auth.calls).toEqual([]);
  });

  it("signs in, refreshes the session and calls onSuccess", async () => {
    const auth = new FakeAuthClient();
    auth.users.push({ name: "Ada", email: "ada@example.com", password: "correct-horse" });
    const onSuccess = vi.fn();
    const { queryClient } = renderWithAuth(<SignInForm onSuccess={onSuccess} />, auth);

    await fillAndSubmit("ada@example.com", "correct-horse");

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(auth.calls).toEqual(["signIn:ada@example.com"]);
    expect(queryClient.getQueryData(sessionQueryKey)).toEqual(auth.session);
  });
});
