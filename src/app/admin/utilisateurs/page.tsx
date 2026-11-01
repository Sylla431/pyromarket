import { exigerAdmin, lireUtilisateurs } from "@/lib/admin";
import { VueUtilisateurs } from "../_components/vue-utilisateurs";

export default async function AdminUtilisateurs({ searchParams }: PageProps<"/admin/utilisateurs">) {
  const params = await searchParams;
  const filtre = typeof params.filtre === "string" ? params.filtre : "";
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";

  const supabase = await exigerAdmin();
  return <VueUtilisateurs tous={await lireUtilisateurs(supabase)} filtre={filtre} q={q} />;
}
