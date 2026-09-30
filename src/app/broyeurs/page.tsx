import Link from "next/link";
import { buttonClass } from "@/components/button";
import { Select } from "@/components/field";
import { IconChevron, IconPin } from "@/components/icons";
import { ResinBadge } from "@/components/resin-badge";
import { EmptyState, PageHeader, Pill } from "@/components/ui";
import { mockBroyeurs } from "@/lib/mock-data";
import { DEPARTEMENTS, RESINES, formatXof } from "@/lib/resines";

function str(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

export default async function BroyeursPage({ searchParams }: PageProps<"/broyeurs">) {
  const params = await searchParams;
  const dep = str(params.dep);
  const resine = Number(str(params.resine)) || 0;

  const broyeurs = mockBroyeurs.filter(
    (b) => (!dep || b.departement === dep) && (!resine || b.matieres.includes(resine as never)),
  );

  return (
    <div>
      <PageHeader title="Annuaire des broyeurs" subtitle="Pour préparer la matière avant pyrolyse." />

      <form action="/broyeurs" className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <label>
          <span className="sr-only">Département</span>
          <Select name="dep" defaultValue={dep} className="mt-0">
            <option value="">Toute la région</option>
            {DEPARTEMENTS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} · {d.nom}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Matière traitée</span>
          <Select name="resine" defaultValue={resine || ""} className="mt-0">
            <option value="">Toutes matières</option>
            {RESINES.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code} · {r.sigle}
              </option>
            ))}
          </Select>
        </label>
        <button type="submit" className={buttonClass("secondary", "md", "col-span-2 sm:col-span-1")}>
          Rechercher
        </button>
      </form>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {broyeurs.map((b) => (
          <li key={b.id}>
            <Link
              href={`/broyeurs/${b.id}`}
              className="block rounded-2xl border border-line bg-surface/60 p-4 transition hover:border-teal active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-medium text-foreground">{b.entreprise}</h2>
                  <p className="text-sm text-muted">{b.typeBroyeur}</p>
                </div>
                {b.disponible ? <Pill tone="mint">Disponible</Pill> : <Pill>Complet</Pill>}
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm text-soft">
                <IconPin size={14} /> {b.localisation} ({b.departement})
              </p>
              <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
                <div className="flex gap-2">
                  {b.matieres.map((m) => (
                    <ResinBadge key={m} code={m} size="sm" className={m === resine ? "text-mint" : "text-subtle"} />
                  ))}
                </div>
                <span className="flex items-center gap-1 font-mono text-sm text-mint">
                  {formatXof(b.tarifXofKg)}/kg
                  <IconChevron size={16} className="text-subtle" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {broyeurs.length === 0 && (
        <EmptyState title="Aucun broyeur ne correspond">Essayez un département voisin ou toutes matières.</EmptyState>
      )}
    </div>
  );
}
