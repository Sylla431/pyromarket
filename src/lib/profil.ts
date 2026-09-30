import { mockProfil } from "./mock-data";
import { createClient } from "./supabase/server";
import { getUserId, supabaseConfigure } from "./supabase/session";

export type ProfilVue = {
  nom: string;
  entreprise: string;
  siret: string;
  zoneActivite: string;
  roles: string[];
  siretVerifie: boolean;
  agrement: string;
};

// Profil affiché dans l'espace compte : réel si connecté, démo si Supabase
// n'est pas configuré, null si l'utilisateur doit se connecter.
export async function getProfil(): Promise<{ mode: "demo" | "connecte"; profil: ProfilVue } | null> {
  if (!supabaseConfigure()) return { mode: "demo", profil: mockProfil };

  const id = await getUserId();
  if (!id) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("nom, entreprise, siret, zone_activite, roles, siret_verifie, agrement")
    .eq("id", id)
    .single();

  return {
    mode: "connecte",
    profil: {
      nom: data?.nom ?? "",
      entreprise: data?.entreprise ?? "",
      siret: data?.siret ?? "",
      zoneActivite: data?.zone_activite ?? "",
      roles: data?.roles ?? [],
      siretVerifie: data?.siret_verifie ?? false,
      agrement: data?.agrement ?? "Non renseigné",
    },
  };
}
