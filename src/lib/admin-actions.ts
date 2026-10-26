"use server";

import { revalidatePath } from "next/cache";
import { exigerAdmin } from "./admin";

// Les fonctions SQL appelées vérifient elles-mêmes is_admin() : ces actions
// échouent pour tout autre utilisateur, même appelées directement.

function texte(formData: FormData, nom: string) {
  const v = formData.get(nom);
  if (typeof v !== "string" || !v) throw new Error(`Champ manquant : ${nom}`);
  return v;
}

export async function verifierRccm(formData: FormData) {
  const supabase = await exigerAdmin();
  const { error } = await supabase.rpc("admin_verifier_rccm", {
    profil_id: texte(formData, "id"),
    verifie: formData.get("verifie") === "true",
  });
  if (error) throw new Error(`Vérification impossible : ${error.message}`);
  revalidatePath("/admin", "layout");
}

const STATUTS_ANNONCE = ["publiee", "suspendue", "cloturee"] as const;

export async function changerStatutAnnonce(formData: FormData) {
  const statut = texte(formData, "statut");
  if (!STATUTS_ANNONCE.includes(statut as (typeof STATUTS_ANNONCE)[number])) throw new Error("Statut invalide");
  const supabase = await exigerAdmin();
  const { error } = await supabase.rpc("admin_statut_annonce", {
    annonce_id: texte(formData, "id"),
    nouveau_statut: statut,
  });
  if (error) throw new Error(`Changement de statut impossible : ${error.message}`);
  revalidatePath("/admin", "layout");
  revalidatePath("/annonces");
  revalidatePath("/");
}

const DECISIONS = ["valide", "suspendu", "complement_demande"] as const;

export async function traiterSignalement(formData: FormData) {
  const decision = texte(formData, "decision");
  if (!DECISIONS.includes(decision as (typeof DECISIONS)[number])) throw new Error("Décision invalide");
  const supabase = await exigerAdmin();

  const { error } = await supabase.rpc("admin_traiter_signalement", {
    signalement_id: texte(formData, "id"),
    nouveau_statut: decision,
  });
  if (error) throw new Error(`Traitement impossible : ${error.message}`);

  // Suspendre un signalement d'annonce retire aussi l'annonce du marché.
  if (decision === "suspendu" && formData.get("cible_type") === "annonce") {
    const { error: e2 } = await supabase.rpc("admin_statut_annonce", {
      annonce_id: texte(formData, "cible_id"),
      nouveau_statut: "suspendue",
    });
    if (e2) throw new Error(`Suspension de l'annonce impossible : ${e2.message}`);
    revalidatePath("/annonces");
  }
  revalidatePath("/admin", "layout");
}
