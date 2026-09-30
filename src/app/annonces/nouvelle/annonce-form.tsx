"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { ChoiceChip, Field, FormError, Input, Select, Textarea } from "@/components/field";
import { ResinBadge } from "@/components/resin-badge";
import { StickyActions } from "@/components/ui";
import { DEPARTEMENTS, RESINES } from "@/lib/resines";
import { createAnnonce, type CreateAnnonceState } from "./actions";

const initialState: CreateAnnonceState = {};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full border border-teal font-mono text-xs text-teal">
          {n}
        </span>
        <span className="font-wide text-lg font-semibold text-foreground">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export function AnnonceForm() {
  const [state, formAction, pending] = useActionState(createAnnonce, initialState);

  return (
    <form action={formAction} className="space-y-10">
      <Step n={1} title="La matière">
        <div className="grid grid-cols-2 gap-2">
          <ChoiceChip type="radio" name="sens" value="vente" defaultChecked>
            Je vends
          </ChoiceChip>
          <ChoiceChip type="radio" name="sens" value="achat">
            Je recherche
          </ChoiceChip>
        </div>

        <div>
          <p className="text-sm font-medium text-soft">Résine</p>
          <div className="mt-1.5 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {RESINES.map((r) => (
              <label key={r.code} className="cursor-pointer">
                <input type="radio" name="resine" value={r.code} required className="peer sr-only" />
                <span className="flex justify-center rounded-xl border border-line bg-surface py-2.5 text-subtle transition peer-checked:border-mint peer-checked:bg-mint/10 peer-checked:text-mint peer-focus-visible:outline-2 peer-focus-visible:outline-mint">
                  <ResinBadge code={r.code} size="sm" className="" />
                </span>
              </label>
            ))}
          </div>
        </div>

        <Field label="Désignation" hint="Ex. : bouteilles PET broyées, films agricoles, rebuts d'injection…">
          <Input name="typePlastique" required placeholder="Ce que vous proposez" />
        </Field>
        <Field label="Qualité / niveau de tri">
          <Input name="qualite" placeholder="Trié, non trié, broyé, lavé…" />
        </Field>
      </Step>

      <Step n={2} title="Volume et prix">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantité (kg)">
            <Input name="quantiteKg" type="number" min={1} inputMode="numeric" required placeholder="8000" />
          </Field>
          <Field label="Prix (F CFA/t)" hint="Vide = à discuter">
            <Input name="prixXof" type="number" min={0} step={1} inputMode="numeric" placeholder="210000" />
          </Field>
        </div>
      </Step>

      <Step n={3} title="Lieu d'enlèvement">
        <div className="grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-2">
          <Field label="Ville">
            <Input name="localisation" required placeholder="Lyon" autoComplete="address-level2" />
          </Field>
          <Field label="Département">
            <Select name="departement" required defaultValue="">
              <option value="" disabled>
                —
              </option>
              {DEPARTEMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} · {d.nom}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Précisions (facultatif)">
          <Textarea name="description" placeholder="Conditionnement, stockage, régularité de production…" />
        </Field>
      </Step>

      <p className="text-sm text-subtle">
        Votre annonce est publiée tout de suite. Un modérateur la relit ensuite.
      </p>

      <FormError message={state.error} />

      <StickyActions>
        <Button type="submit" disabled={pending} className="flex-1 md:flex-none">
          {pending ? "Publication…" : "Publier l'annonce"}
        </Button>
      </StickyActions>
      <div className="h-16 md:hidden" />
    </form>
  );
}
