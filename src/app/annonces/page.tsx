import Link from "next/link";
import { AnnonceCard } from "@/components/annonce-card";
import { ButtonLink, buttonClass } from "@/components/button";
import { Field, Input, Select } from "@/components/field";
import { IconSearch, IconSliders } from "@/components/icons";
import { EmptyState, PageHeader, Segmented } from "@/components/ui";
import { mockAnnonces } from "@/lib/mock-data";
import { REGIONS, RESINES } from "@/lib/resines";

function str(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

export default async function AnnoncesPage({ searchParams }: PageProps<"/annonces">) {
  const params = await searchParams;
  const q = str(params.q).toLowerCase();
  const resine = Number(str(params.resine)) || 0;
  const sens = str(params.sens) === "achat" ? "achat" : "vente";
  const region = str(params.region);
  const qmin = Number(str(params.qmin)) || 0;
  const pmax = Number(str(params.pmax)) || 0;

  const annonces = mockAnnonces.filter(
    (a) =>
      a.statut === "publiee" &&
      a.sens === sens &&
      (!resine || a.resine === resine) &&
      (!region || a.region === region) &&
      (!qmin || a.quantiteKg >= qmin * 1000) &&
      (!pmax || (a.prixXof !== null && a.prixXof <= pmax)) &&
      (!q ||
        a.typePlastique.toLowerCase().includes(q) ||
        a.localisation.toLowerCase().includes(q)),
  );

  // Construit une URL en conservant les autres filtres.
  const href = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams();
    const merged = { q: str(params.q), resine: resine || "", sens, region, qmin: qmin || "", pmax: pmax || "", ...patch };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== "" && v !== undefined && v !== 0) next.set(k, String(v));
    }
    const s = next.toString();
    return s ? `/annonces?${s}` : "/annonces";
  };

  const filtresActifs = [region, qmin, pmax].filter(Boolean).length;

  return (
    <div>
      <PageHeader
        title="Marché du plastique"
        subtitle="Toutes catégories de plastique acceptées."
        action={
          <div className="hidden sm:block">
            <ButtonLink href="/annonces/nouvelle" size="sm">
              Publier une annonce
            </ButtonLink>
          </div>
        }
      />

      <Segmented
        items={[
          { href: href({ sens: "vente" }), label: "À vendre", active: sens === "vente" },
          { href: href({ sens: "achat" }), label: "Recherchés", active: sens === "achat" },
        ]}
      />

      <form action="/annonces" className="mt-4 flex gap-2">
        <input type="hidden" name="sens" value={sens} />
        {resine > 0 && <input type="hidden" name="resine" value={resine} />}
        <label className="relative flex-1">
          <span className="sr-only">Rechercher</span>
          <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            name="q"
            defaultValue={str(params.q)}
            placeholder="Matière, ville…"
            className="h-12 w-full rounded-xl border border-line bg-surface pr-4 pl-11 text-[16px] text-foreground placeholder:text-subtle focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          aria-label="Rechercher"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface text-soft transition hover:border-teal active:scale-95"
        >
          <IconSearch size={20} />
        </button>
      </form>

      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link
          href={href({ resine: "" })}
          className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-sm transition ${
            !resine ? "border-accent bg-mint/10 text-accent" : "border-line text-soft hover:border-teal"
          }`}
        >
          Toutes
        </Link>
        {RESINES.map((r) => (
          <Link
            key={r.code}
            href={href({ resine: r.code })}
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition ${
              resine === r.code ? "border-accent bg-mint/10 text-accent" : "border-line text-soft hover:border-teal"
            }`}
          >
            <span className="font-mono text-xs opacity-70">{r.code}</span>
            {r.sigle}
          </Link>
        ))}
      </div>

      <details className="group mt-4 rounded-2xl border border-line bg-surface/60" open={filtresActifs > 0}>
        <summary className="flex h-12 cursor-pointer list-none items-center gap-2 px-4 text-sm font-medium text-soft">
          <IconSliders size={18} />
          Filtres
          {filtresActifs > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-mint font-mono text-[11px] text-ink">
              {filtresActifs}
            </span>
          )}
          <span className="ml-auto text-subtle transition group-open:rotate-180">▾</span>
        </summary>
        <form action="/annonces" className="grid gap-4 border-t border-line p-4 sm:grid-cols-3">
          <input type="hidden" name="sens" value={sens} />
          {resine > 0 && <input type="hidden" name="resine" value={resine} />}
          {params.q && <input type="hidden" name="q" value={str(params.q)} />}
          <Field label="Région">
            <Select name="region" defaultValue={region}>
              <option value="">Tout le Mali</option>
              {REGIONS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.nom}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Quantité minimum (t)">
            <Input type="number" name="qmin" min={0} inputMode="numeric" defaultValue={qmin || ""} placeholder="0" />
          </Field>
          <Field label="Prix maximum (F CFA/t)">
            <Input type="number" name="pmax" min={0} inputMode="numeric" defaultValue={pmax || ""} placeholder="Sans limite" />
          </Field>
          <div className="flex gap-3 sm:col-span-3">
            <button type="submit" className={buttonClass("primary", "md", "flex-1 sm:flex-none")}>
              Appliquer
            </button>
            <Link href={href({ region: "", qmin: "", pmax: "" })} className={buttonClass("ghost", "md")}>
              Effacer
            </Link>
          </div>
        </form>
      </details>

      <p className="mt-6 mb-3 text-sm text-subtle">
        <span className="font-mono text-foreground">{annonces.length}</span>{" "}
        annonce{annonces.length > 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {annonces.map((a) => (
          <AnnonceCard key={a.id} annonce={a} />
        ))}
        {annonces.length === 0 && (
          <EmptyState
            title="Aucune annonce pour ces critères"
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <ButtonLink href="/compte/alertes" variant="secondary">
                  Créer une alerte
                </ButtonLink>
                <ButtonLink href="/annonces" variant="ghost">
                  Effacer les filtres
                </ButtonLink>
              </div>
            }
          >
            Créez une alerte pour être prévenu dès qu&apos;une annonce correspond.
          </EmptyState>
        )}
      </div>
    </div>
  );
}
