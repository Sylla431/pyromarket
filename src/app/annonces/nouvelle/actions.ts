"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NON_CONFIGURE, field, getUserId, supabaseConfigure } from "@/lib/supabase/session";
import { annonceSchema } from "@/lib/validation";

export type CreateAnnonceState = { error?: string };

export async function createAnnonce(
  _prevState: CreateAnnonceState,
  formData: FormData,
): Promise<CreateAnnonceState> {
  const parsed = annonceSchema.safeParse({
    sens: field(formData, "sens"),
    resine: field(formData, "resine"),
    typePlastique: field(formData, "typePlastique"),
    quantiteKg: field(formData, "quantiteKg"),
    qualite: field(formData, "qualite"),
    prixXof: field(formData, "prixXof"),
    localisation: field(formData, "localisation"),
    region: field(formData, "region"),
    description: field(formData, "description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  if (!supabaseConfigure()) return { error: NON_CONFIGURE };

  const vendeurId = await getUserId();
  if (!vendeurId) {
    return { error: "Connectez-vous pour publier une annonce." };
  }

  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("annonces").insert({
    vendeur_id: vendeurId,
    sens: d.sens,
    resine: d.resine,
    type_plastique: d.typePlastique,
    quantite_kg: d.quantiteKg,
    qualite: d.qualite,
    prix_xof: d.prixXof,
    localisation: d.localisation,
    region: d.region,
    description: d.description,
  });

  if (error) {
    return { error: "La publication a échoué. Réessayez dans un instant." };
  }

  redirect("/compte/annonces?publiee=1");
}
