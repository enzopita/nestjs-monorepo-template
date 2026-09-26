import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/auth-card";
import { safeRedirect } from "@/features/auth/safe-redirect";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <AuthCard
      title="Create an account"
      description="It only takes a minute."
      footer={{ text: "Already have an account?", label: "Sign in", to: "/sign-in", redirect }}
    >
      <SignUpForm onSuccess={() => void navigate({ href: safeRedirect(redirect) })} />
    </AuthCard>
  );
}
