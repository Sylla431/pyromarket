"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { ChoiceChip, Field, Input } from "@/components/field";
import { FormStatus } from "@/components/form-status";
import { StickyActions } from "@/components/ui";
import { enregistrerTransporteur, type FormState } from "@/lib/profil-actions";
import { DEPARTEMENTS } from "@/lib/resines";

const REMORQUES = ["Fond mouvant", "Benne", "Plateau bâché", "Fourgon", "Porte-caissons"];

export function TransporteurForm() {
  const [state, action, pending] = useActionState(enregistrerTransporteur, {} as FormState);
  return (
    <form action={action} className="space-y-8">
      <fieldset>
        <legend className="text-sm font-medium text-soft">Départements couverts</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DEPARTEMENTS.map((d) => (
            <ChoiceChip key={d.code} name="departements" value={d.code}>
              <span className="font-mono text-xs text-subtle">{d.code}</span> {d.nom}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-soft">Type de remorque</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {REMORQUES.map((r, i) => (
            <ChoiceChip key={r} type="radio" name="type_remorque" value={r} defaultChecked={i === 0}>
              {r}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Volume (m³)">
          <Input name="capacite_m3" type="number" min={1} inputMode="numeric" placeholder="90" />
        </Field>
        <Field label="Charge utile (t)">
          <Input name="tonnage_t" type="number" min={1} step="0.5" inputMode="decimal" placeholder="24" />
        </Field>
      </div>

      <ChoiceChip name="disponible" value="on" defaultChecked>
        Disponible pour de nouvelles courses
      </ChoiceChip>

      <FormStatus state={state} />
      <StickyActions>
        <Button type="submit" disabled={pending} className="flex-1 md:flex-none">
          {pending ? "Enregistrement…" : "Enregistrer mon profil"}
        </Button>
      </StickyActions>
      <div className="h-16 md:hidden" />
    </form>
  );
}
