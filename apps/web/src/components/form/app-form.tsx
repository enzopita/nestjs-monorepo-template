import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

// Field errors are untyped in shared components; validators here are Standard Schemas, which produce issues.
const issuesSchema = z.array(z.object({ message: z.string() })).catch([]);

type TextFieldProps = { label: string } & Pick<ComponentProps<"input">, "type" | "autoComplete">;

function TextField({ label, type = "text", autoComplete }: TextFieldProps) {
  const field = useFieldContext<string>();
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        autoComplete={autoComplete}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
      />
      {invalid && <FieldError errors={issuesSchema.parse(field.state.meta.errors)} />}
    </Field>
  );
}

function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

// App-wide form hook: fields and buttons bound to TanStack Form with the shadcn primitives.
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
});
