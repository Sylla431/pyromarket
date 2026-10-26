import Link from "next/link";
import { EmptyState, Segmented } from "@/components/ui";
import { depuis, exigerAdmin, lireDemandes, nomCompte } from "@/lib/admin";
import { Statut } from "../_components/ui";

const VUES = [
  { valeur: "", label: "Toutes" },
  { valeur: "en_attente", label: "En attente" },
  { valeur: "accepte", label: "Acceptées" },
  { valeur: "termine", label: "Terminées" },
] as const;

// Les « commandes » de la plateforme : demandes de transport liées à une
// annonce (les ventes se négocient hors plateforme au MVP).
export default async function AdminTransport({ searchParams }: PageProps<"/admin/transport">) {
  const params = await searchParams;
  const statut = typeof params.statut === "string" ? params.statut : "";

  const supabase = await exigerAdmin();
  const toutes = await lireDemandes(supabase);
  const liste = statut ? toutes.filter((d) => d.statut === statut) : toutes;

  return (
    <div>
      <Segmented
        items={VUES.map((v) => ({
          href: v.valeur ? `/admin/transport?statut=${v.valeur}` : "/admin/transport",
          label: v.label,
          active: statut === v.valeur,
          count: v.valeur ? toutes.filter((d) => d.statut === v.valeur).length : toutes.length,
        }))}
      />

      <ul className="mt-5 space-y-3">
        {liste.map((d) => (
          <li key={d.id} className="rounded-2xl border border-line bg-surface/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {[d.zone_depart, d.zone_arrivee].filter(Boolean).join(" → ") || "Trajet à préciser"}
                </p>
                {d.annonce ? (
                  <Link href={`/annonces/${d.annonce.id}`} className="text-sm text-muted hover:underline">
                    {d.annonce.type_plastique} · {d.annonce.localisation}
                  </Link>
                ) : (
                  <p className="text-sm text-muted">Annonce supprimée</p>
                )}
              </div>
              <Statut statut={d.statut} />
            </div>
            <p className="mt-3 border-t border-line pt-3 text-sm text-subtle">
              Transporteur : <span className="text-foreground">{nomCompte(d.transporteur)}</span>
              {d.tonnage ? (
                <>
                  {" "}
                  · <span className="font-mono text-foreground">{d.tonnage} t</span>
                </>
              ) : null}{" "}
              · demandée {depuis(d.created_at)}
            </p>
          </li>
        ))}
      </ul>
      {liste.length === 0 && (
        <EmptyState title="Aucune demande de transport">
          Les demandes apparaîtront ici dès que les vendeurs demanderont un transport depuis leurs annonces.
        </EmptyState>
      )}
    </div>
  );
}
