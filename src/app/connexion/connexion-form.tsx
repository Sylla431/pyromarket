"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { Field, FormError, Input } from "@/components/field";
import { connexion, type AuthState } from "@/lib/auth-actions";

export function ConnexionForm() {
  const [state, action, pending] = useActionState(connexion, {} as AuthState);
  return (
    <form action={action} className="space-y-4">
      <Field label="E-mail">
        <Input name="email" type="email" autoComplete="email" required inputMode="email" />
      </Field>
      <Field label="Mot de passe">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <FormError message={state.error} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
