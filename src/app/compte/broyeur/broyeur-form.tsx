"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { ChoiceChip, Field, Input, Select, Textarea } from "@/components/field";
import { FormStatus } from "@/components/form-status";
import { ResinBadge } from "@/components/resin-badge";
import { StickyActions } from "@/components/ui";
import { enregistrerBroyeur, type FormState } from "@/lib/profil-actions";
import { REGIONS, RESINES } from "@/lib/resines";

export function BroyeurForm() {
  const [state, action, pending] = useActionState(enregistrerBroyeur, {} as FormState);
  return (
    <form action={action} className="space-y-6">
      <Field label="Nom affiché">
        <Input name="entreprise" required placeholder="Atelier Broyage Sotuba" />
      </Field>
      <Field label="Type de broyeur">
        <Input name="type_broyeur" required placeholder="Mono-arbre 30 kW, granulateur…" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Capacité (kg/h)">
          <Input name="capacite_kg_h" type="number" min={1} inputMode="numeric" placeholder="600" />
        </Field>
        <Field label="Tarif (F CFA/kg)">
          <Input name="tarif_indicatif" type="number" min={0} step={1} inputMode="numeric" placeholder="26" />
        </Field>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-2">
        <Field label="Ville">
          <Input name="localisation" required />
        </Field>
        <Field label="Région">
          <Select name="region" required defaultValue="">
            <option value="" disabled>
              —
            </option>
            {REGIONS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.nom}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-soft">Matières traitées</legend>
        <div className="mt-1.5 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {RESINES.map((r) => (
            <label key={r.code} className="cursor-pointer">
              <input type="checkbox" name="matieres" value={r.code} className="peer sr-only" />
              <span className="flex justify-center rounded-xl border border-line bg-surface py-2.5 text-subtle transition peer-checked:border-accent peer-checked:bg-mint/10 peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                <ResinBadge code={r.code} size="sm" className="" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Présentation (facultatif)">
        <Textarea name="description" placeholder="Taille de grille, délais, broyage sur site…" />
      </Field>

      <ChoiceChip name="disponible" value="on" defaultChecked>
        Disponible actuellement
      </ChoiceChip>

      <FormStatus state={state} />
      <StickyActions>
        <Button type="submit" disabled={pending} className="flex-1 md:flex-none">
          {pending ? "Enregistrement…" : "Enregistrer ma fiche"}
        </Button>
      </StickyActions>
      <div className="h-16 md:hidden" />
    </form>
  );
}
