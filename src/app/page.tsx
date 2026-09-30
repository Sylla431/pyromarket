import Link from "next/link";
import { AnnonceCard } from "@/components/annonce-card";
import { ButtonLink } from "@/components/button";
import { IconChevron, IconGrinder, IconTruck } from "@/components/icons";
import { ResinBadge } from "@/components/resin-badge";
import { SectionTitle } from "@/components/ui";
import { mockAnnonces } from "@/lib/mock-data";
import { RESINES, formatKg } from "@/lib/resines";

export default function Home() {
  const publiees = mockAnnonces.filter((a) => a.statut === "publiee");
  const volumeParResine = RESINES.map((r) => ({
    ...r,
    kg: publiees
      .filter((a) => a.resine === r.code && a.sens === "vente")
      .reduce((sum, a) => sum + a.quantiteKg, 0),
  }));

  return (
    <div className="space-y-10">
      <section>
        <p className="text-xs font-semibold tracking-[0.12em] text-teal uppercase">
          Auvergne-Rhône-Alpes
        </p>
        <h1 className="font-wide mt-2 text-[28px] leading-[1.1] font-bold text-foreground sm:text-4xl">
          Quel plastique cherchez-vous&nbsp;?
        </h1>
        <p className="mt-2 max-w-md text-muted">
          Choisissez une résine pour voir les volumes disponibles près de chez
          vous.
        </p>

        <ul className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {volumeParResine.map((r) => (
            <li key={r.code}>
              <Link
                href={`/annonces?resine=${r.code}`}
                className="flex h-full flex-col items-center gap-2 rounded-2xl border border-line bg-surface/60 px-1 pt-3 pb-2.5 transition hover:border-mint active:scale-95"
              >
                <ResinBadge code={r.code} />
                <span className="font-mono text-[11px] text-subtle">
                  {r.kg > 0 ? formatKg(r.kg) : "—"}
                </span>
              </Link>
            </li>
          ))}
          <li className="sm:hidden">
            <Link
              href="/annonces"
              className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-line text-xs text-muted hover:border-mint hover:text-mint"
            >
              Tout voir
              <IconChevron size={16} />
            </Link>
          </li>
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/transport"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition hover:border-teal"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-teal/15 text-teal">
            <IconTruck />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-foreground">Trouver un transporteur</span>
            <span className="block text-sm text-muted">Remorques disponibles sur votre zone</span>
          </span>
          <IconChevron className="text-subtle" />
        </Link>
        <Link
          href="/broyeurs"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition hover:border-teal"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-teal/15 text-teal">
            <IconGrinder />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-foreground">Faire broyer la matière</span>
            <span className="block text-sm text-muted">Broyeurs proches, tarifs indicatifs</span>
          </span>
          <IconChevron className="text-subtle" />
        </Link>
      </section>

      <section>
        <SectionTitle
          action={
            <Link href="/annonces" className="text-sm text-mint hover:underline">
              Tout voir
            </Link>
          }
        >
          Dernières annonces
        </SectionTitle>
        <div className="space-y-3">
          {publiees.slice(0, 4).map((a) => (
            <AnnonceCard key={a.id} annonce={a} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-mint p-5 text-ink">
        <h2 className="font-wide text-xl font-bold">Vous avez du plastique à écouler ?</h2>
        <p className="mt-1 text-sm text-ink/75">
          Publiez votre annonce en deux minutes, elle est visible tout de suite.
        </p>
        <ButtonLink
          href="/annonces/nouvelle"
          variant="inverse"
          className="mt-4 w-full sm:w-auto"
        >
          Publier une annonce
        </ButtonLink>
      </section>
    </div>
  );
}
