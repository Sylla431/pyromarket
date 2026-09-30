import Link from "next/link";
import type { AnnonceMock } from "@/lib/mock-data";
import { formatKg, formatXof } from "@/lib/resines";
import { ResinBadge } from "./resin-badge";
import { IconPin, IconShield } from "./icons";
import { Pill } from "./ui";

export function AnnonceCard({ annonce: a }: { annonce: AnnonceMock }) {
  return (
    <Link
      href={`/annonces/${a.id}`}
      className="flex gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition hover:border-teal active:scale-[0.99]"
    >
      <ResinBadge code={a.resine} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium leading-snug text-foreground">{a.typePlastique}</h3>
          {a.sens === "achat" && <Pill tone="teal">Recherche</Pill>}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <IconPin size={14} /> {a.localisation} · {a.qualite}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <p className="font-mono text-[15px] whitespace-nowrap text-foreground">
            {formatKg(a.quantiteKg)}
            <span className="mx-2 text-line">|</span>
            <span className="text-accent">
              {a.prixXof !== null ? `${formatXof(a.prixXof)}/t` : "Prix à discuter"}
            </span>
          </p>
          <span className="flex shrink-0 items-center gap-1 text-xs text-subtle">
            {a.vendeurVerifie && <IconShield size={14} className="text-teal" />}
            {a.publieLe}
          </span>
        </div>
      </div>
    </Link>
  );
}
