import {
  compterProfils,
  exigerAdmin,
  lireAnnonces,
  lireDemandes,
  lireSignalements,
  lireUtilisateurs,
} from "@/lib/admin";
import { VueApercu } from "./_components/vue-apercu";

export default async function AdminAccueil() {
  const supabase = await exigerAdmin();
  const [utilisateurs, annonces, demandes, signalements, profils] = await Promise.all([
    lireUtilisateurs(supabase),
    lireAnnonces(supabase),
    lireDemandes(supabase),
    lireSignalements(supabase),
    compterProfils(supabase),
  ]);

  return (
    <VueApercu
      utilisateurs={utilisateurs}
      annonces={annonces}
      demandes={demandes}
      signalements={signalements}
      profils={profils}
    />
  );
}
