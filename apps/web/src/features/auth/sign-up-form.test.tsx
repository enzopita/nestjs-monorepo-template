import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { sessionQueryKey } from "./session";
import { SignUpForm } from "./sign-up-form";
import { renderWithAuth } from "./testing/render-with-auth";

type Values = { name: string; email: string; password: string; confirm: string };

async function fillAndSubmit(values: Values) {
  await userEvent.type(screen.getByLabelText("Name"), values.name);
  await userEvent.type(screen.getByLabelText("Email"), values.email);
  await userEvent.type(screen.getByLabelText("Password"), values.password);
  await userEvent.type(screen.getByLabelText("Confirm password"), values.confirm);
  await userEvent.click(screen.getByRole("button", { name: "Create account" }));
}

const valid: Values = {
  name: "Ada",
  email: "ada@example.com",
  password: "correct-horse",
  confirm: "correct-horse",
};

describe("SignUpForm", () => {
  it("rejects short and mismatched passwords", async () => {
    const { auth } = renderWithAuth(<SignUpForm onSuccess={vi.fn()} />);

    await fillAndSubmit({ ...valid, password: "short", confirm: "other" });

    expect(await screen.findByText("Use at least 8 characters")).toBeInTheDocument();
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(auth.calls).toEqual([]);
  });

  it("creates the account and calls onSuccess", async () => {
    const onSuccess = vi.fn();
    const { auth, queryClient } = renderWithAuth(<SignUpForm onSuccess={onSuccess} />);

    await fillAndSubmit(valid);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(auth.calls).toEqual(["signUp:ada@example.com"]);
    expect(queryClient.getQueryData(sessionQueryKey)).toEqual(auth.session);
  });
});
