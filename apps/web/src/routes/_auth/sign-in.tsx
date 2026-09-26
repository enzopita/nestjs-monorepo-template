import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/auth-card";
import { safeRedirect } from "@/features/auth/safe-redirect";
import { SignInForm } from "@/features/auth/sign-in-form";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <AuthCard
      title="Sign in"
      description="Enter your email and password."
      footer={{ text: "No account?", label: "Sign up", to: "/sign-up", redirect }}
    >
      <SignInForm onSuccess={() => void navigate({ href: safeRedirect(redirect) })} />
    </AuthCard>
  );
}
