"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NON_CONFIGURE, field, getUserId, supabaseConfigure } from "@/lib/supabase/session";
import { profilBroyeurSchema, profilTransporteurSchema, signalementSchema } from "@/lib/validation";

export type FormState = { error?: string; ok?: string };

async function utilisateur(): Promise<{ id: string } | { error: string }> {
  if (!supabaseConfigure()) return { error: NON_CONFIGURE };
  const id = await getUserId();
  return id ? { id } : { error: "Connectez-vous pour continuer." };
}

export async function enregistrerBroyeur(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = profilBroyeurSchema.safeParse({
    entreprise: field(formData, "entreprise"),
    type_broyeur: field(formData, "type_broyeur"),
    capacite_kg_h: field(formData, "capacite_kg_h"),
    localisation: field(formData, "localisation"),
    region: field(formData, "region"),
    tarif_indicatif: field(formData, "tarif_indicatif"),
    matieres: formData.getAll("matieres"),
    disponible: formData.get("disponible") === "on",
    description: field(formData, "description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const user = await utilisateur();
  if ("error" in user) return user;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profils_broyeur")
    .upsert({ ...parsed.data, user_id: user.id }, { onConflict: "user_id" });
  if (error) return { error: "L'enregistrement a échoué. Réessayez dans un instant." };

  revalidatePath("/broyeurs");
  return { ok: "Fiche enregistrée. Elle apparaît dans l'annuaire." };
}

export async function enregistrerTransporteur(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = profilTransporteurSchema.safeParse({
    regions: formData.getAll("regions"),
    type_remorque: field(formData, "type_remorque"),
    capacite_m3: field(formData, "capacite_m3"),
    tonnage_t: field(formData, "tonnage_t"),
    disponible: formData.get("disponible") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const user = await utilisateur();
  if ("error" in user) return user;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profils_transporteur")
    .upsert({ ...parsed.data, user_id: user.id }, { onConflict: "user_id" });
  if (error) return { error: "L'enregistrement a échoué. Réessayez dans un instant." };

  revalidatePath("/transport");
  return { ok: "Profil transporteur enregistré." };
}

export async function signaler(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signalementSchema.safeParse({
    cible_type: field(formData, "cible_type"),
    cible_id: field(formData, "cible_id"),
    motif: field(formData, "motif"),
    detail: field(formData, "detail"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const user = await utilisateur();
  if ("error" in user) return user;

  const supabase = await createClient();
  const { error } = await supabase.from("signalements").insert({ ...parsed.data, auteur_id: user.id });
  if (error) return { error: "L'envoi a échoué. Réessayez dans un instant." };

  return { ok: "Signalement envoyé. Un modérateur va l'examiner." };
}
