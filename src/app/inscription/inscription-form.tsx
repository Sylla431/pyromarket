"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/button";
import { ChoiceChip, Field, FormError, Input } from "@/components/field";
import { IconGrinder, IconMarket, IconSearch, IconTruck } from "@/components/icons";
import { inscription, type AuthState } from "@/lib/auth-actions";

const ROLES = [
  { value: "vendeur", label: "Je vends du plastique", Icon: IconMarket },
  { value: "acheteur", label: "J'achète (unité de pyrolyse…)", Icon: IconSearch },
  { value: "transporteur", label: "Je transporte", Icon: IconTruck },
  { value: "broyeur", label: "Je possède un broyeur", Icon: IconGrinder },
];

export function InscriptionForm() {
  const [state, action, pending] = useActionState(inscription, {} as AuthState);
  const [vendeur, setVendeur] = useState(false);

  if (state.info) {
    return <p className="rounded-2xl border border-mint/40 bg-mint/10 p-5 text-mint">{state.info}</p>;
  }

  return (
    <form action={action} className="space-y-8">
      <fieldset>
        <legend className="text-sm font-medium text-soft">Votre activité</legend>
        <p className="mb-3 text-xs text-subtle">Plusieurs choix possibles.</p>
        <div
          className="grid gap-2 sm:grid-cols-2"
          onChange={(e) => {
            const t = e.target as HTMLInputElement;
            if (t.value === "vendeur") setVendeur(t.checked);
          }}
        >
          {ROLES.map(({ value, label, Icon }) => (
            <ChoiceChip key={value} name="roles" value={value}>
              <Icon size={20} /> {label}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 text-sm font-medium text-soft">Votre entreprise</legend>
        <Field label="Raison sociale">
          <Input name="entreprise" required autoComplete="organization" />
        </Field>
        <Field label="SIRET" hint="14 chiffres. Nous le vérifions avant d'afficher le badge « Entreprise vérifiée ».">
          <Input name="siret" required inputMode="numeric" placeholder="852 147 963 00018" className="font-mono" />
        </Field>
        <Field label="Zone d'activité">
          <Input name="zone_activite" placeholder="Rhône, Loire…" />
        </Field>
        {vendeur && (
          <Field
            label="N° d'agrément préfectoral (déchets)"
            hint="Requis pour la collecte ou la vente de déchets plastiques. Vous pourrez l'ajouter plus tard."
          >
            <Input name="agrement" />
          </Field>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 text-sm font-medium text-soft">Vos identifiants</legend>
        <Field label="Nom et prénom">
          <Input name="nom" required autoComplete="name" />
        </Field>
        <Field label="E-mail professionnel">
          <Input name="email" type="email" required autoComplete="email" inputMode="email" />
        </Field>
        <Field label="Mot de passe" hint="8 caractères minimum.">
          <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
        </Field>
      </fieldset>

      <FormError message={state.error} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Création du compte…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
