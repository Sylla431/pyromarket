import {
  mockAnnonces,
  mockBroyeurs,
  mockProfil,
  mockTransporteurs,
  type AnnonceMock,
  type BroyeurMock,
  type TransporteurMock,
} from "./mock-data";
import { regionNom } from "./resines";
import { createClient } from "./supabase/server";
import { supabaseConfigure } from "./supabase/session";

// Accès aux données de l'application. Lit Supabase quand il est configuré,
// sinon les données de démonstration (développement local sans clés).

export type Annonce = AnnonceMock;
export type Broyeur = BroyeurMock;
export type Transporteur = TransporteurMock;

export type FiltresAnnonces = {
  sens: "vente" | "achat";
  resine?: number;
  region?: string;
  quantiteMinKg?: number;
  prixMaxXof?: number;
  q?: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const relatif = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

// « il y a 2 heures », « hier », « il y a 3 semaines »…
export function depuis(iso: string, maintenant = Date.now()) {
  const secondes = Math.round((new Date(iso).getTime() - maintenant) / 1000);
  const unites: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unite, duree] of unites) {
    if (Math.abs(secondes) >= duree) return relatif.format(Math.round(secondes / duree), unite);
  }
  return "à l'instant";
}

// --- Annonces -----------------------------------------------------------

type AnnonceRow = {
  id: string;
  sens: "vente" | "achat";
  resine: number | null;
  type_plastique: string;
  quantite_kg: number;
  qualite: string | null;
  prix_xof: number | null;
  localisation: string;
  region: string | null;
  description: string | null;
  photos: string[];
  statut: string;
  created_at: string;
  vendeur: { entreprise: string | null; nom: string; rccm_verifie: boolean } | null;
};

const ANNONCE_COLONNES =
  "id, sens, resine, type_plastique, quantite_kg, qualite, prix_xof, localisation, region, description, photos, statut, created_at, vendeur:profiles(entreprise, nom, rccm_verifie)";

function versAnnonce(r: AnnonceRow): Annonce {
  return {
    id: r.id,
    sens: r.sens,
    resine: (r.resine ?? 7) as Annonce["resine"],
    typePlastique: r.type_plastique,
    quantiteKg: r.quantite_kg,
    qualite: r.qualite ?? "Non précisé",
    prixXof: r.prix_xof === null ? null : Number(r.prix_xof),
    localisation: r.localisation,
    region: r.region ?? "",
    vendeur: r.vendeur?.entreprise || r.vendeur?.nom || "Vendeur",
    vendeurVerifie: r.vendeur?.rccm_verifie ?? false,
    description: r.description ?? "",
    photos: r.photos?.length ?? 0,
    publieLe: depuis(r.created_at),
    statut: r.statut === "cloturee" ? "cloturee" : "publiee",
  };
}

// Retire les caractères qui ont un sens dans la syntaxe de filtre PostgREST.
function nettoyerRecherche(q: string) {
  return q.replace(/[,()*%\\]/g, " ").trim();
}

export async function listerAnnonces(f: FiltresAnnonces): Promise<Annonce[]> {
  if (!supabaseConfigure()) {
    const q = f.q?.toLowerCase() ?? "";
    return mockAnnonces.filter(
      (a) =>
        a.statut === "publiee" &&
        a.sens === f.sens &&
        (!f.resine || a.resine === f.resine) &&
        (!f.region || a.region === f.region) &&
        (!f.quantiteMinKg || a.quantiteKg >= f.quantiteMinKg) &&
        (!f.prixMaxXof || (a.prixXof !== null && a.prixXof <= f.prixMaxXof)) &&
        (!q || a.typePlastique.toLowerCase().includes(q) || a.localisation.toLowerCase().includes(q)),
    );
  }

  const supabase = await createClient();
  let requete = supabase
    .from("annonces")
    .select(ANNONCE_COLONNES)
    .eq("statut", "publiee")
    .eq("sens", f.sens)
    .order("created_at", { ascending: false })
    .limit(100);

  if (f.resine) requete = requete.eq("resine", f.resine);
  if (f.region) requete = requete.eq("region", f.region);
  if (f.quantiteMinKg) requete = requete.gte("quantite_kg", f.quantiteMinKg);
  if (f.prixMaxXof) requete = requete.lte("prix_xof", f.prixMaxXof);
  const q = f.q ? nettoyerRecherche(f.q) : "";
  if (q) requete = requete.or(`type_plastique.ilike.*${q}*,localisation.ilike.*${q}*`);

  const { data, error } = await requete;
  if (error) throw new Error(`Lecture des annonces impossible : ${error.message}`);
  return (data as unknown as AnnonceRow[]).map(versAnnonce);
}

// Toutes les annonces publiées (accueil : volumes par résine, dernières annonces).
export async function annoncesRecentes(limite = 200): Promise<Annonce[]> {
  if (!supabaseConfigure()) return mockAnnonces.filter((a) => a.statut === "publiee");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("annonces")
    .select(ANNONCE_COLONNES)
    .eq("statut", "publiee")
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) throw new Error(`Lecture des annonces impossible : ${error.message}`);
  return (data as unknown as AnnonceRow[]).map(versAnnonce);
}

export async function lireAnnonce(id: string): Promise<Annonce | null> {
  if (!supabaseConfigure()) return mockAnnonces.find((a) => a.id === id) ?? null;
  if (!UUID.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("annonces").select(ANNONCE_COLONNES).eq("id", id).maybeSingle();
  if (error) throw new Error(`Lecture de l'annonce impossible : ${error.message}`);
  return data ? versAnnonce(data as unknown as AnnonceRow) : null;
}

export async function mesAnnonces(userId: string | null): Promise<Annonce[]> {
  if (!supabaseConfigure()) return mockAnnonces.filter((a) => a.vendeur === mockProfil.entreprise);
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("annonces")
    .select(ANNONCE_COLONNES)
    .eq("vendeur_id", userId)
    .in("statut", ["publiee", "cloturee"])
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Lecture de vos annonces impossible : ${error.message}`);
  return (data as unknown as AnnonceRow[]).map(versAnnonce);
}

// --- Broyeurs -----------------------------------------------------------

type BroyeurRow = {
  id: string;
  entreprise: string | null;
  type_broyeur: string;
  capacite_kg_h: number | null;
  localisation: string;
  region: string | null;
  tarif_indicatif: number | null;
  matieres: number[];
  disponible: boolean;
  description: string | null;
  proprietaire: { entreprise: string | null; nom: string } | null;
};

const BROYEUR_COLONNES =
  "id, entreprise, type_broyeur, capacite_kg_h, localisation, region, tarif_indicatif, matieres, disponible, description, proprietaire:profiles(entreprise, nom)";

function versBroyeur(r: BroyeurRow): Broyeur {
  return {
    id: r.id,
    entreprise: r.entreprise || r.proprietaire?.entreprise || r.proprietaire?.nom || "Broyeur",
    typeBroyeur: r.type_broyeur,
    capaciteKgH: r.capacite_kg_h ?? 0,
    localisation: r.localisation,
    region: r.region ?? "",
    tarifXofKg: r.tarif_indicatif === null ? 0 : Number(r.tarif_indicatif),
    matieres: (r.matieres ?? []) as Broyeur["matieres"],
    disponible: r.disponible,
    description: r.description ?? "",
  };
}

export async function listerBroyeurs(f: { region?: string; resine?: number }): Promise<Broyeur[]> {
  if (!supabaseConfigure()) {
    return mockBroyeurs.filter(
      (b) => (!f.region || b.region === f.region) && (!f.resine || b.matieres.includes(f.resine as never)),
    );
  }

  const supabase = await createClient();
  let requete = supabase
    .from("profils_broyeur")
    .select(BROYEUR_COLONNES)
    .order("disponible", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);
  if (f.region) requete = requete.eq("region", f.region);
  if (f.resine) requete = requete.contains("matieres", [f.resine]);

  const { data, error } = await requete;
  if (error) throw new Error(`Lecture des broyeurs impossible : ${error.message}`);
  return (data as unknown as BroyeurRow[]).map(versBroyeur);
}

export async function lireBroyeur(id: string): Promise<Broyeur | null> {
  if (!supabaseConfigure()) return mockBroyeurs.find((b) => b.id === id) ?? null;
  if (!UUID.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("profils_broyeur").select(BROYEUR_COLONNES).eq("id", id).maybeSingle();
  if (error) throw new Error(`Lecture du broyeur impossible : ${error.message}`);
  return data ? versBroyeur(data as unknown as BroyeurRow) : null;
}

// --- Transporteurs ------------------------------------------------------

type TransporteurRow = {
  id: string;
  regions: string[];
  type_remorque: string;
  capacite_m3: number | null;
  tonnage_t: number | null;
  disponible: boolean;
  transporteur: { entreprise: string | null; nom: string } | null;
};

export async function listerTransporteurs(region?: string): Promise<Transporteur[]> {
  if (!supabaseConfigure()) {
    return mockTransporteurs
      .filter((t) => !region || t.regions.includes(region))
      .sort((a, b) => Number(b.disponible) - Number(a.disponible));
  }

  const supabase = await createClient();
  let requete = supabase
    .from("profils_transporteur")
    .select("id, regions, type_remorque, capacite_m3, tonnage_t, disponible, transporteur:profiles(entreprise, nom)")
    .order("disponible", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);
  if (region) requete = requete.contains("regions", [region]);

  const { data, error } = await requete;
  if (error) throw new Error(`Lecture des transporteurs impossible : ${error.message}`);
  return (data as unknown as TransporteurRow[]).map((r) => ({
    id: r.id,
    entreprise: r.transporteur?.entreprise || r.transporteur?.nom || "Transporteur",
    zone: r.regions.map(regionNom).join(", "),
    regions: r.regions,
    remorque: r.type_remorque,
    capaciteM3: r.capacite_m3 ?? 0,
    tonnageT: r.tonnage_t === null ? 0 : Number(r.tonnage_t),
    disponible: r.disponible,
  }));
}
