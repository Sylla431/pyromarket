import Link from "next/link";
import { ResinBadge } from "@/components/resin-badge";
import { EmptyState } from "@/components/ui";
import { changerStatutAnnonce } from "@/lib/admin-actions";
import { dateCourte, depuis, nomCompte, type AnnonceAdmin } from "@/lib/admin";
import { formatKg, formatXof, regionNom } from "@/lib/resines";
import { ActionButton } from "./action-button";
import { Statut } from "./ui";

const VUES = [
  { valeur: "", label: "Toutes" },
  { valeur: "publiee", label: "En ligne" },
  { valeur: "cloturee", label: "Vendues" },
  { valeur: "suspendue", label: "Suspendues" },
] as const;

function Action({ a }: { a: AnnonceAdmin }) {
  if (a.statut === "publiee")
    return (
      <ActionButton
        action={changerStatutAnnonce}
        champs={{ id: a.id, statut: "suspendue" }}
        variant="danger"
        confirmer={`Suspendre « ${a.type_plastique} » ? L'annonce disparaîtra du marché.`}
      >
        Suspendre
      </ActionButton>
    );
  if (a.statut === "suspendue")
    return (
      <ActionButton action={changerStatutAnnonce} champs={{ id: a.id, statut: "publiee" }} titre="Remettre en ligne">
        Rétablir
      </ActionButton>
    );
  return null;
}

// Ville, plus la région seulement si elle n'y figure pas déjà.
function lieu(a: AnnonceAdmin) {
  const region = a.region ? regionNom(a.region) : "";
  return region && !a.localisation.includes(region.replace("District de ", "")) ? `${a.localisation} · ${region}` : a.localisation;
}

function Prix({ a }: { a: AnnonceAdmin }) {
  return a.prix_xof !== null ? <>{formatXof(a.prix_xof)}/t</> : <span className="text-subtle">À discuter</span>;
}

export function VueAnnonces({ toutes, statut }: { toutes: AnnonceAdmin[]; statut: string }) {
  const liste = statut ? toutes.filter((a) => a.statut === statut) : toutes;

  return (
    <div className="rounded-2xl border border-line">
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-line p-4">
        {VUES.map((v) => {
          const n = v.valeur ? toutes.filter((a) => a.statut === v.valeur).length : toutes.length;
          const on = statut === v.valeur;
          return (
            <Link
              key={v.valeur}
              href={v.valeur ? `/admin/annonces?statut=${v.valeur}` : "/admin/annonces"}
              aria-current={on ? "page" : undefined}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm transition ${
                on ? "border-accent bg-mint/15 text-accent" : "border-line text-soft hover:border-teal"
              }`}
            >
              {v.label}
              <span className="font-mono text-xs opacity-70">{n}</span>
            </Link>
          );
        })}
      </div>

      {liste.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Aucune annonce dans cette catégorie" />
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/60 text-xs text-subtle">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Annonce</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Vendeur</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Quantité</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Prix</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Statut</th>
                <th scope="col" className="px-4 py-2.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {liste.map((a) => (
                <tr key={a.id} className="align-middle transition hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ResinBadge code={a.resine ?? 7} size="sm" />
                      <div className="max-w-xs min-w-0">
                        <Link href={`/annonces/${a.id}`} className="block truncate font-medium text-foreground hover:underline">
                          {a.type_plastique}
                        </Link>
                        <p className="truncate text-xs text-subtle" title={`Publiée ${depuis(a.created_at)}`}>
                          {a.sens === "achat" ? "Recherche" : "Vente"} · {lieu(a)} · {dateCourte(a.created_at)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-40 truncate px-4 py-3 whitespace-nowrap text-soft">{nomCompte(a.vendeur)}</td>
                  <td className="px-4 py-3 text-right font-mono whitespace-nowrap text-foreground">{formatKg(a.quantite_kg)}</td>
                  <td className="px-4 py-3 text-right font-mono whitespace-nowrap text-accent">
                    <Prix a={a} />
                  </td>
                  <td className="px-4 py-3">
                    <Statut statut={a.statut} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Action a={a} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <ul className="divide-y divide-line lg:hidden">
            {liste.map((a) => (
              <li key={a.id} className="p-4">
                <div className="flex gap-3">
                  <ResinBadge code={a.resine ?? 7} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/annonces/${a.id}`} className="font-medium text-foreground hover:underline">
                        {a.type_plastique}
                      </Link>
                      <Statut statut={a.statut} />
                    </div>
                    <p className="mt-0.5 text-xs text-subtle">
                      {nomCompte(a.vendeur)} · {a.localisation} · {depuis(a.created_at)}
                    </p>
                    <p className="mt-2 font-mono text-sm whitespace-nowrap text-foreground">
                      {formatKg(a.quantite_kg)}
                      <span className="mx-2 text-line">|</span>
                      <span className="text-accent">
                        <Prix a={a} />
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Action a={a} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
