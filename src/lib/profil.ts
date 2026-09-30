import { mockProfil } from "./mock-data";
import { createClient } from "./supabase/server";
import { getUserId, supabaseConfigure } from "./supabase/session";

export type ProfilVue = {
  nom: string;
  entreprise: string;
  rccm: string;
  zoneActivite: string;
  roles: string[];
  rccmVerifie: boolean;
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
    .select("nom, entreprise, rccm, zone_activite, roles, rccm_verifie, agrement")
    .eq("id", id)
    .single();

  return {
    mode: "connecte",
    profil: {
      nom: data?.nom ?? "",
      entreprise: data?.entreprise ?? "",
      rccm: data?.rccm ?? "",
      zoneActivite: data?.zone_activite ?? "",
      roles: data?.roles ?? [],
      rccmVerifie: data?.rccm_verifie ?? false,
      agrement: data?.agrement ?? "Non renseigné",
    },
  };
}
