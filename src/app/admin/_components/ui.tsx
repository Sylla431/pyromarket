import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevron } from "@/components/icons";
import { Pill } from "@/components/ui";

// Encadré de section du tableau de bord.
export function Panneau({
  titre,
  action,
  children,
  className = "",
}: {
  titre: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-background ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">{titre}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

// Mini-histogramme d'évolution (une série, couleur unique) ; chaque barre
// porte sa valeur en infobulle.
export function Tendance({ serie, label }: { serie: { label: string; valeur: number }[]; label: string }) {
  const max = Math.max(1, ...serie.map((s) => s.valeur));
  return (
    <div className="flex h-9 items-end gap-[3px]" role="img" aria-label={`${label} : ${serie.map((s) => s.valeur).join(", ")} par semaine`}>
      {serie.map((s, i) => (
        <span
          key={i}
          title={`${s.label} : ${s.valeur}`}
          className={`w-full rounded-t-[3px] ${i === serie.length - 1 ? "bg-accent" : "bg-accent/35"}`}
          style={{ height: `${Math.max(8, (s.valeur / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

// Indicateur : icône, libellé, valeur, détail, tendance facultative.
export function Kpi({
  icone,
  label,
  valeur,
  detail,
  href,
  tendance,
}: {
  icone: ReactNode;
  label: string;
  valeur: ReactNode;
  detail?: ReactNode;
  href?: string;
  tendance?: { label: string; valeur: number }[];
}) {
  const contenu = (
    <>
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="grid size-8 place-items-center rounded-lg bg-mint/20 text-accent">{icone}</span>
        {label}
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="font-wide min-w-0 truncate text-[30px] leading-none text-foreground">{valeur}</p>
        {tendance && (
          <div className="w-24 shrink-0">
            <Tendance serie={tendance} label={label} />
          </div>
        )}
      </div>
      {detail && <p className="mt-3 text-xs text-subtle">{detail}</p>}
    </>
  );
  const classe = "group block rounded-2xl border border-line bg-background p-5";
  return href ? (
    <Link href={href} className={`${classe} transition hover:border-teal hover:shadow-sm`}>
      {contenu}
    </Link>
  ) : (
    <div className={classe}>{contenu}</div>
  );
}

// Carte « à traiter » : un compteur actionnable.
export function ATraiter({
  icone,
  label,
  nombre,
  href,
  action,
}: {
  icone: ReactNode;
  label: string;
  nombre: number;
  href: string;
  action: string;
}) {
  const urgent = nombre > 0;
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
        urgent ? "border-coral/30 bg-coral/5 hover:border-coral/60" : "border-line bg-background hover:border-teal"
      }`}
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${urgent ? "bg-coral/10 text-coral" : "bg-surface text-subtle"}`}>
        {icone}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`font-wide block text-2xl leading-none ${urgent ? "text-coral" : "text-foreground"}`}>{nombre}</span>
        <span className="mt-1 block truncate text-sm text-muted">{label}</span>
      </span>
      <span className={`hidden shrink-0 items-center gap-1 text-sm font-medium sm:flex ${urgent ? "text-coral" : "text-subtle"}`}>
        {urgent ? action : "À jour"} <IconChevron size={16} />
      </span>
    </Link>
  );
}

// Barres horizontales à une seule série ; la valeur est écrite en clair.
export function Barres({
  lignes,
  format = (n: number) => n.toLocaleString("fr-FR"),
  vide = "Aucune donnée pour l'instant.",
}: {
  lignes: { label: string; valeur: number; prefixe?: ReactNode }[];
  format?: (n: number) => string;
  vide?: string;
}) {
  const max = Math.max(0, ...lignes.map((l) => l.valeur));
  if (max === 0) return <p className="px-5 py-6 text-sm text-subtle">{vide}</p>;
  return (
    <ul className="space-y-3.5 px-5 py-4">
      {lignes.map((l) => (
        <li key={l.label} title={`${l.label} : ${format(l.valeur)}`} className="flex items-center gap-3">
          {l.prefixe}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex justify-between gap-3 text-sm">
              <span className="truncate text-soft">{l.label}</span>
              <span className="shrink-0 font-mono text-foreground">{format(l.valeur)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface">
              <div
                className="h-1.5 rounded-full bg-accent"
                style={{ width: `${l.valeur > 0 ? Math.max(2, (l.valeur / max) * 100) : 0}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
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
