import Link from "next/link";
import { ResinBadge } from "@/components/resin-badge";
import { EmptyState, Segmented } from "@/components/ui";
import { changerStatutAnnonce } from "@/lib/admin-actions";
import { depuis, exigerAdmin, lireAnnonces, nomCompte } from "@/lib/admin";
import { formatKg, formatXof, regionNom } from "@/lib/resines";
import { ActionButton } from "../_components/action-button";
import { Statut } from "../_components/ui";

const VUES = [
  { valeur: "", label: "Toutes" },
  { valeur: "publiee", label: "En ligne" },
  { valeur: "cloturee", label: "Vendues" },
  { valeur: "suspendue", label: "Suspendues" },
] as const;

export default async function AdminAnnonces({ searchParams }: PageProps<"/admin/annonces">) {
  const params = await searchParams;
  const statut = typeof params.statut === "string" ? params.statut : "";

  const supabase = await exigerAdmin();
  const toutes = await lireAnnonces(supabase);
  const liste = statut ? toutes.filter((a) => a.statut === statut) : toutes;

  return (
    <div>
      <Segmented
        items={VUES.map((v) => ({
          href: v.valeur ? `/admin/annonces?statut=${v.valeur}` : "/admin/annonces",
          label: v.label,
          active: statut === v.valeur,
          count: v.valeur ? toutes.filter((a) => a.statut === v.valeur).length : toutes.length,
        }))}
      />

      <ul className="mt-5 space-y-3">
        {liste.map((a) => (
          <li key={a.id} className="rounded-2xl border border-line bg-surface/60 p-4">
            <div className="flex gap-3">
              <ResinBadge code={a.resine ?? 7} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link href={`/annonces/${a.id}`} className="font-medium text-foreground hover:underline">
                    {a.type_plastique}
                  </Link>
                  <Statut statut={a.statut} />
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {a.sens === "achat" ? "Recherche" : "Vente"} · {nomCompte(a.vendeur)} · {a.localisation}
                  {a.region ? ` (${regionNom(a.region)})` : ""}
                </p>
                <p className="mt-2 font-mono text-sm whitespace-nowrap text-foreground">
                  {formatKg(a.quantite_kg)}
                  <span className="mx-2 text-line">|</span>
                  <span className="text-accent">{a.prix_xof !== null ? `${formatXof(a.prix_xof)}/t` : "Prix à discuter"}</span>
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              <span className="text-xs text-subtle">
                Publiée {depuis(a.created_at)}
                {a.updated_at !== a.created_at && ` · modifiée ${depuis(a.updated_at)}`}
              </span>
              {a.statut === "publiee" && (
                <ActionButton
                  action={changerStatutAnnonce}
                  champs={{ id: a.id, statut: "suspendue" }}
                  variant="danger"
                  confirmer={`Suspendre « ${a.type_plastique} » ? L'annonce disparaîtra du marché.`}
                >
                  Suspendre
                </ActionButton>
              )}
              {a.statut === "suspendue" && (
                <ActionButton action={changerStatutAnnonce} champs={{ id: a.id, statut: "publiee" }}>
                  Remettre en ligne
                </ActionButton>
              )}
            </div>
          </li>
        ))}
      </ul>
      {liste.length === 0 && <EmptyState title="Aucune annonce dans cette catégorie" />}
    </div>
  );
}
