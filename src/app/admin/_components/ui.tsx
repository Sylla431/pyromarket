import Link from "next/link";
import type { ReactNode } from "react";
import { Pill } from "@/components/ui";

// Indicateur : un chiffre, son libellé, un détail facultatif.
export function Kpi({
  label,
  valeur,
  detail,
  href,
  alerte = false,
}: {
  label: string;
  valeur: ReactNode;
  detail?: ReactNode;
  href?: string;
  alerte?: boolean;
}) {
  const contenu = (
    <>
      <p className="text-sm text-muted">{label}</p>
      <p className={`font-wide mt-1 text-[28px] leading-none ${alerte ? "text-coral" : "text-foreground"}`}>{valeur}</p>
      {detail && <p className="mt-2 text-xs text-subtle">{detail}</p>}
    </>
  );
  const classe = "block rounded-2xl border border-line bg-surface/60 p-4";
  return href ? (
    <Link href={href} className={`${classe} transition hover:border-teal`}>
      {contenu}
    </Link>
  ) : (
    <div className={classe}>{contenu}</div>
  );
}

// Barres horizontales à une seule série : la valeur est écrite en clair,
// la couleur ne porte pas d'information à elle seule.
export function Barres({
  titre,
  lignes,
  format = (n: number) => n.toLocaleString("fr-FR"),
  vide = "Aucune donnée pour l'instant.",
}: {
  titre: string;
  lignes: { label: string; valeur: number }[];
  format?: (n: number) => string;
  vide?: string;
}) {
  const max = Math.max(0, ...lignes.map((l) => l.valeur));
  return (
    <section className="rounded-2xl border border-line p-4">
      <h2 className="mb-4 text-sm font-medium text-foreground">{titre}</h2>
      {max === 0 ? (
        <p className="text-sm text-subtle">{vide}</p>
      ) : (
        <ul className="space-y-3">
          {lignes.map((l) => (
            <li key={l.label} title={`${l.label} : ${format(l.valeur)}`}>
              <div className="mb-1 flex justify-between gap-3 text-sm">
                <span className="truncate text-soft">{l.label}</span>
                <span className="shrink-0 font-mono text-foreground">{format(l.valeur)}</span>
              </div>
              <div className="h-2 rounded-full bg-line/50">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${l.valeur > 0 ? Math.max(2, (l.valeur / max) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const STATUTS = {
  publiee: { label: "En ligne", tone: "mint" },
  cloturee: { label: "Vendue", tone: "muted" },
  suspendue: { label: "Suspendue", tone: "coral" },
  en_moderation: { label: "En modération", tone: "teal" },
  en_attente: { label: "En attente", tone: "coral" },
  accepte: { label: "Acceptée", tone: "teal" },
  termine: { label: "Terminée", tone: "muted" },
  a_traiter: { label: "À traiter", tone: "coral" },
  valide: { label: "Classé", tone: "muted" },
  suspendu: { label: "Retenu", tone: "teal" },
  complement_demande: { label: "Complément demandé", tone: "teal" },
} as const;

export function Statut({ statut }: { statut: keyof typeof STATUTS }) {
  const s = STATUTS[statut];
  return <Pill tone={s.tone}>{s.label}</Pill>;
}

export const ROLE_LABELS: Record<string, string> = {
  vendeur: "Vendeur",
  acheteur: "Acheteur",
  transporteur: "Transporteur",
  broyeur: "Broyeur",
};
