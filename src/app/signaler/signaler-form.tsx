"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { ChoiceChip, Field, Textarea } from "@/components/field";
import { FormStatus } from "@/components/form-status";
import { signaler, type FormState } from "@/lib/profil-actions";

const MOTIFS = [
  "Annonce frauduleuse ou arnaque",
  "Photos sans rapport avec la matière",
  "Prix ou quantité incohérents",
  "Autorisation ou RCCM douteux",
  "Autre",
];

export function SignalerForm({ cible, id }: { cible: "annonce" | "profil"; id: string }) {
  const [state, action, pending] = useActionState(signaler, {} as FormState);
  if (state.ok) return <FormStatus state={state} />;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="cible_type" value={cible} />
      <input type="hidden" name="cible_id" value={id} />
      <fieldset>
        <legend className="text-sm font-medium text-soft">Motif</legend>
        <div className="mt-2 space-y-2">
          {MOTIFS.map((m) => (
            <ChoiceChip key={m} type="radio" name="motif" value={m}>
              {m}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>
      <Field label="Précisions (facultatif)">
        <Textarea name="detail" />
      </Field>
      <FormStatus state={state} />
      <Button type="submit" variant="danger" disabled={pending} className="w-full">
        {pending ? "Envoi…" : "Envoyer le signalement"}
      </Button>
    </form>
  );
}
