import { PageHeader } from "@/components/ui";
import { BroyeurForm } from "./broyeur-form";

export default function ProfilBroyeurPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back="/compte" title="Ma fiche broyeur" subtitle="Apparaissez dans les recherches par zone et par matière." />
      <BroyeurForm />
    </div>
  );
}
