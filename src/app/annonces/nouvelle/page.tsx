import { PageHeader } from "@/components/ui";
import { AnnonceForm } from "./annonce-form";

export default function NouvelleAnnoncePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back="/publier" title="Publier une annonce" subtitle="Trois étapes, environ deux minutes." />
      <AnnonceForm />
    </div>
  );
}
