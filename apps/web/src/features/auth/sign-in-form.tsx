import { z } from "zod";

import { useAppForm } from "@/components/form/app-form";
import { FormAlert } from "@/components/form/form-alert";
import { FieldGroup } from "@/components/ui/field";

import { useAuthClient } from "./auth-client-context";
import { useAuthSubmit } from "./use-auth-submit";

const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const auth = useAuthClient();
  const { formError, submit } = useAuthSubmit(onSuccess);

  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      await submit(() => auth.signIn(value));
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FormAlert message={formError} />
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="current-password" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton label="Sign in" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
