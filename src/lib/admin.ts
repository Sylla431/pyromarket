import { notFound, redirect } from "next/navigation";
import { depuis } from "./data";
import { createClient } from "./supabase/server";
import { getUserId, supabaseConfigure } from "./supabase/session";

// Données du tableau de bord d'administration. Toutes les lectures passent
// par la session de l'administrateur : la RLS (is_admin()) décide de ce qui
// est visible, aucune clé secrète n'est utilisée.

// Bloque l'accès : connexion requise, puis 404 pour un non-administrateur
// (la page n'a pas à révéler son existence).
export async function exigerAdmin() {
  if (!supabaseConfigure()) notFound();
  const userId = await getUserId();
  if (!userId) redirect("/connexion");

  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  if (!data?.is_admin) notFound();
  return supabase;
}

export async function estAdmin(userId: string | null) {
  if (!userId || !supabaseConfigure()) return false;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  return Boolean(data?.is_admin);
}

type Client = Awaited<ReturnType<typeof exigerAdmin>>;

export type Utilisateur = {
  id: string;
  email: string;
  nom: string;
  entreprise: string | null;
  rccm: string | null;
  rccm_verifie: boolean;
  roles: string[];
  zone_activite: string | null;
  agrement: string | null;
  is_admin: boolean;
  inscrit_le: string;
  derniere_connexion: string | null;
};

export type AnnonceAdmin = {
  id: string;
  sens: "vente" | "achat";
  resine: number | null;
  type_plastique: string;
  quantite_kg: number;
  prix_xof: number | null;
  localisation: string;
  region: string | null;
  statut: "publiee" | "en_moderation" | "suspendue" | "cloturee";
  created_at: string;
  updated_at: string;
  vendeur: { entreprise: string | null; nom: string } | null;
};

export type DemandeTransport = {
  id: string;
  statut: "en_attente" | "accepte" | "termine";
  zone_depart: string | null;
  zone_arrivee: string | null;
  tonnage: number | null;
  created_at: string;
  annonce: { id: string; type_plastique: string; localisation: string } | null;
  transporteur: { entreprise: string | null; nom: string } | null;
};

export type Signalement = {
  id: string;
  cible_type: "annonce" | "profil";
  cible_id: string;
  motif: string;
  detail: string | null;
  statut: "a_traiter" | "valide" | "suspendu" | "complement_demande";
  created_at: string;
  auteur: { entreprise: string | null; nom: string } | null;
};

function verifier<T>(res: { data: T | null; error: { message: string } | null }, quoi: string): T {
  if (res.error) throw new Error(`Lecture ${quoi} impossible : ${res.error.message}`);
  return res.data as T;
}

export async function lireUtilisateurs(supabase: Client) {
  return verifier<Utilisateur[]>(await supabase.rpc("admin_utilisateurs"), "des utilisateurs") ?? [];
}

export async function lireAnnonces(supabase: Client) {
  const res = await supabase
    .from("annonces")
    .select(
      "id, sens, resine, type_plastique, quantite_kg, prix_xof, localisation, region, statut, created_at, updated_at, vendeur:profiles(entreprise, nom)",
    )
    .order("created_at", { ascending: false })
    .limit(1000);
  return (verifier(res, "des annonces") as unknown as AnnonceAdmin[]) ?? [];
}

export async function lireDemandes(supabase: Client) {
  const res = await supabase
    .from("demandes_transport")
    .select(
      "id, statut, zone_depart, zone_arrivee, tonnage, created_at, annonce:annonces(id, type_plastique, localisation), transporteur:profiles(entreprise, nom)",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  return (verifier(res, "des demandes de transport") as unknown as DemandeTransport[]) ?? [];
}

export async function lireSignalements(supabase: Client) {
  const res = await supabase
    .from("signalements")
    .select("id, cible_type, cible_id, motif, detail, statut, created_at, auteur:profiles(entreprise, nom)")
    .order("created_at", { ascending: false })
    .limit(500);
  return (verifier(res, "des signalements") as unknown as Signalement[]) ?? [];
}

export async function compterProfils(supabase: Client) {
  const [broyeurs, transporteurs, messages] = await Promise.all([
    supabase.from("profils_broyeur").select("id, disponible"),
    supabase.from("profils_transporteur").select("id, disponible"),
    supabase.from("messages").select("id", { count: "exact", head: true }),
  ]);
  const b = verifier(broyeurs, "des broyeurs") ?? [];
  const t = verifier(transporteurs, "des transporteurs") ?? [];
  if (messages.error) throw new Error(`Lecture des messages impossible : ${messages.error.message}`);
  return {
    broyeurs: b.length,
    broyeursDisponibles: b.filter((x) => x.disponible).length,
    transporteurs: t.length,
    transporteursDisponibles: t.filter((x) => x.disponible).length,
    messages: messages.count ?? 0,
  };
}

export function nomCompte(p: { entreprise: string | null; nom: string } | null | undefined) {
  return p?.entreprise || p?.nom || "—";
}

export { depuis };

// Vrai si la date est plus récente que le nombre de jours donné.
export function depuisMoinsDe(iso: string, jours: number) {
  return Date.now() - new Date(iso).getTime() < jours * 24 * 3600 * 1000;
}

// Nombre d'évènements par semaine sur les dernières semaines (la plus
// ancienne en premier), pour les mini-graphiques d'évolution.
export function serieHebdo(dates: string[], semaines = 8) {
  const semaineMs = 7 * 24 * 3600 * 1000;
  const fin = Date.now();
  const valeurs = Array.from({ length: semaines }, () => 0);
  for (const iso of dates) {
    const age = fin - new Date(iso).getTime();
    const i = Math.floor(age / semaineMs);
    if (i >= 0 && i < semaines) valeurs[semaines - 1 - i] += 1;
  }
  return valeurs.map((valeur, i) => ({
    label: i === semaines - 1 ? "Cette semaine" : `Il y a ${semaines - 1 - i} sem.`,
    valeur,
  }));
}

// Regroupe une date dans une période lisible pour le fil d'activité.
export function periode(iso: string) {
  const jour = 24 * 3600 * 1000;
  const debutAujourdhui = new Date();
  debutAujourdhui.setHours(0, 0, 0, 0);
  const t = new Date(iso).getTime();
  if (t >= debutAujourdhui.getTime()) return "Aujourd'hui";
  if (t >= debutAujourdhui.getTime() - jour) return "Hier";
  if (t >= debutAujourdhui.getTime() - 6 * jour) return "Cette semaine";
  return "Plus ancien";
}

// Date courte pour les tableaux : « 3 oct. 2026 ».
export function dateCourte(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

// Compteurs du menu, en requêtes de comptage (sans charger les lignes).
export async function compteursNav(supabase: Client) {
  const compte = (r: { count: number | null; error: { message: string } | null }) => {
    if (r.error) throw new Error(`Comptage impossible : ${r.error.message}`);
    return r.count ?? 0;
  };
  const [signalements, annonces, utilisateurs, demandes] = await Promise.all([
    supabase.from("signalements").select("id", { count: "exact", head: true }).eq("statut", "a_traiter"),
    supabase.from("annonces").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("demandes_transport").select("id", { count: "exact", head: true }).eq("statut", "en_attente"),
  ]);
  return {
    signalements: compte(signalements),
    annonces: compte(annonces),
    utilisateurs: compte(utilisateurs),
    demandes: compte(demandes),
  };
}

export function dateDuJour() {
  return new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}
