import { PageHeader } from "@/components/ui";
import { SignalerForm } from "./signaler-form";

export default async function SignalerPage({ searchParams }: PageProps<"/signaler">) {
  const params = await searchParams;
  const cible = params.cible === "profil" ? "profil" : "annonce";
  const id = typeof params.id === "string" ? params.id : "";
  const retour = cible === "annonce" ? `/annonces/${id}` : `/broyeurs/${id}`;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        back={id ? retour : "/"}
        title={cible === "annonce" ? "Signaler une annonce" : "Signaler un profil"}
        subtitle="Un modérateur examine chaque signalement."
      />
      <SignalerForm cible={cible} id={id} />
    </div>
  );
}
