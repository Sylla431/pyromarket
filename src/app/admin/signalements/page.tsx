import Link from "next/link";
import { EmptyState, Pill } from "@/components/ui";
import { Filtres } from "../_components/filtres";
import { traiterSignalement } from "@/lib/admin-actions";
import { depuis, exigerAdmin, lireSignalements, nomCompte } from "@/lib/admin";
import { ActionButton } from "../_components/action-button";
import { Statut } from "../_components/ui";

export default async function AdminSignalements({ searchParams }: PageProps<"/admin/signalements">) {
  const params = await searchParams;
  const vue = params.vue === "traites" ? "traites" : "a_traiter";

  const supabase = await exigerAdmin();
  const tous = await lireSignalements(supabase);
  const aTraiter = tous.filter((s) => s.statut === "a_traiter");
  const liste = vue === "a_traiter" ? aTraiter : tous.filter((s) => s.statut !== "a_traiter");

  return (
    <div className="rounded-2xl border border-line">
      <Filtres
        items={[
          { href: "/admin/signalements", label: "À traiter", active: vue === "a_traiter", count: aTraiter.length },
          {
            href: "/admin/signalements?vue=traites",
            label: "Traités",
            active: vue === "traites",
            count: tous.length - aTraiter.length,
          },
        ]}
      />

      <ul className="divide-y divide-line">
        {liste.map((s) => {
          const cible = s.cible_type === "annonce" ? `/annonces/${s.cible_id}` : `/broyeurs/${s.cible_id}`;
          return (
            <li key={s.id} className="p-4 transition hover:bg-surface/50">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-foreground">{s.motif}</p>
                <div className="flex gap-1.5">
                  <Pill tone={s.cible_type === "annonce" ? "teal" : "muted"}>
                    {s.cible_type === "annonce" ? "Annonce" : "Profil"}
                  </Pill>
                  <Statut statut={s.statut} />
                </div>
              </div>
              {s.detail && <p className="mt-2 text-sm text-soft">« {s.detail} »</p>}
              <p className="mt-2 text-xs text-subtle">
                Par {nomCompte(s.auteur)} · {depuis(s.created_at)} ·{" "}
                <Link href={cible} className="text-accent hover:underline">
                  Voir {s.cible_type === "annonce" ? "l'annonce" : "le profil"}
                </Link>
              </p>

              {s.statut === "a_traiter" && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                  <ActionButton action={traiterSignalement} champs={{ id: s.id, decision: "valide" }}>
                    Classer sans suite
                  </ActionButton>
                  <ActionButton action={traiterSignalement} champs={{ id: s.id, decision: "complement_demande" }}>
                    Demander un complément
                  </ActionButton>
                  <ActionButton
                    action={traiterSignalement}
                    champs={{ id: s.id, decision: "suspendu", cible_type: s.cible_type, cible_id: s.cible_id }}
                    variant="danger"
                    confirmer={
                      s.cible_type === "annonce"
                        ? "Suspendre cette annonce ? Elle disparaîtra du marché."
                        : "Retenir ce signalement ? (La suspension de comptes n'existe pas encore : le profil reste visible.)"
                    }
                  >
                    {s.cible_type === "annonce" ? "Suspendre l'annonce" : "Retenir le signalement"}
                  </ActionButton>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {liste.length === 0 && (
        <div className="p-4">
        <EmptyState title={vue === "a_traiter" ? "Aucun signalement à traiter" : "Aucun signalement traité"}>
          {vue === "a_traiter" ? "Les signalements des utilisateurs arrivent ici." : undefined}
        </EmptyState>
        </div>
      )}
    </div>
  );
}
