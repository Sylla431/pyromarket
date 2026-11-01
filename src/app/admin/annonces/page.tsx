import { exigerAdmin, lireAnnonces } from "@/lib/admin";
import { VueAnnonces } from "../_components/vue-annonces";

export default async function AdminAnnonces({ searchParams }: PageProps<"/admin/annonces">) {
  const params = await searchParams;
  const statut = typeof params.statut === "string" ? params.statut : "";

  const supabase = await exigerAdmin();
  return <VueAnnonces toutes={await lireAnnonces(supabase)} statut={statut} />;
}
