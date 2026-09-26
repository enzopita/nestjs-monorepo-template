import { z } from "zod";

import { useAppForm } from "@/components/form/app-form";
import { FormAlert } from "@/components/form/form-alert";
import { FieldGroup } from "@/components/ui/field";

import { useAuthClient } from "./auth-client-context";
import { useAuthSubmit } from "./use-auth-submit";

// Better Auth's default minimum password length is 8.
const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your name"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const auth = useAuthClient();
  const { formError, submit } = useAuthSubmit(onSuccess);

  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      // Validators see raw input; parse again to apply transforms such as trim.
      const { name, email, password } = signUpSchema.parse(value);
      await submit(() => auth.signUp({ name, email, password }));
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
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" autoComplete="name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="new-password" />
          )}
        </form.AppField>
        <form.AppField name="confirm">
          {(field) => (
            <field.TextField label="Confirm password" type="password" autoComplete="new-password" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton label="Create account" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
