import { AnnonceCard } from "@/components/annonce-card";
import { ButtonLink } from "@/components/button";
import { DemoActions } from "@/components/demo-actions";
import { EmptyState, PageHeader, Segmented } from "@/components/ui";
import { mockAnnonces, mockProfil } from "@/lib/mock-data";

export default async function MesAnnoncesPage({ searchParams }: PageProps<"/compte/annonces">) {
  const params = await searchParams;
  const vue = params.vue === "cloturees" ? "cloturee" : "publiee";
  const mes = mockAnnonces.filter((a) => a.vendeur === mockProfil.entreprise);
  const liste = mes.filter((a) => a.statut === vue);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back="/compte" title="Mes annonces" />

      {params.publiee && (
        <p role="status" className="mb-4 rounded-xl border border-accent/40 bg-mint/10 px-4 py-3 text-sm text-accent">
          Annonce publiée. Elle est visible sur le marché.
        </p>
      )}

      <Segmented
        items={[
          { href: "/compte/annonces", label: "Publiées", active: vue === "publiee", count: mes.filter((a) => a.statut === "publiee").length },
          { href: "/compte/annonces?vue=cloturees", label: "Clôturées", active: vue === "cloturee", count: mes.filter((a) => a.statut === "cloturee").length },
        ]}
      />

      <ul className="mt-5 space-y-4">
        {liste.map((a) => (
          <li key={a.id} className="space-y-2">
            <AnnonceCard annonce={a} />
            {a.statut === "publiee" && (
              <DemoActions
                className="justify-end"
                choix={[
                  { label: "Modifier", fait: "Modification bientôt disponible", variant: "ghost" },
                  { label: "Clôturer la vente", fait: "Annonce clôturée", variant: "secondary" },
                ]}
              />
            )}
          </li>
        ))}
      </ul>
      {liste.length === 0 && (
        <EmptyState
          title={vue === "publiee" ? "Aucune annonce en ligne" : "Aucune annonce clôturée"}
          action={<ButtonLink href="/annonces/nouvelle">Publier une annonce</ButtonLink>}
        />
      )}
    </div>
  );
}
