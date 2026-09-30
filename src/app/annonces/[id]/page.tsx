import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { IconCamera, IconChat, IconFlag, IconGrinder, IconPin, IconShield, IconTruck } from "@/components/icons";
import { ResinBadge } from "@/components/resin-badge";
import { Card, PageHeader, Pill, SectionTitle, Stat, StickyActions } from "@/components/ui";
import { mockAnnonces } from "@/lib/mock-data";
import { formatKg, formatXof, resine } from "@/lib/resines";

export default async function AnnoncePage({ params }: PageProps<"/annonces/[id]">) {
  const { id } = await params;
  const a = mockAnnonces.find((x) => x.id === id);
  if (!a) notFound();
  const r = resine(a.resine);

  const contact = `/messages/nouveau?a=${encodeURIComponent(a.vendeur)}&sujet=${encodeURIComponent(
    `${a.typePlastique} · ${formatKg(a.quantiteKg)}`,
  )}`;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back="/annonces" title={a.typePlastique} subtitle={`${r.sigle} — ${r.nom}`} />

      <div className="scrollbar-none -mx-4 flex snap-x gap-2 overflow-x-auto px-4">
        {a.photos > 0 ? (
          Array.from({ length: a.photos }).map((_, i) => (
            <div
              key={i}
              className="grid aspect-[4/3] w-[82%] shrink-0 snap-start place-items-center rounded-2xl border border-line bg-[repeating-linear-gradient(135deg,var(--color-surface)_0_12px,var(--color-line)_12px_24px)] text-subtle sm:w-72"
            >
              <span className="flex items-center gap-2 text-sm">
                <IconCamera size={18} /> Photo {i + 1}/{a.photos}
              </span>
            </div>
          ))
        ) : (
          <div className="grid aspect-[3/1] w-full place-items-center rounded-2xl border border-dashed border-line">
            <ResinBadge code={a.resine} size="lg" />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill tone={a.sens === "vente" ? "mint" : "teal"}>{a.sens === "vente" ? "À vendre" : "Recherché"}</Pill>
        <Pill>Publiée {a.publieLe}</Pill>
      </div>

      <Card className="mt-4 p-4">
        <dl className="grid grid-cols-2 gap-4">
          <Stat label="Quantité" value={formatKg(a.quantiteKg)} />
          <Stat label="Prix" value={a.prixXof !== null ? `${formatXof(a.prixXof)}/t` : "À discuter"} />
          <Stat label="Qualité / tri" value={<span className="font-sans">{a.qualite}</span>} />
          <Stat
            label="Localisation"
            value={
              <span className="flex items-center gap-1 font-sans">
                <IconPin size={14} /> {a.localisation} ({a.departement})
              </span>
            }
          />
        </dl>
      </Card>

      <section className="mt-6">
        <SectionTitle>Description</SectionTitle>
        <p className="leading-relaxed text-soft">{a.description}</p>
      </section>

      <section className="mt-6">
        <SectionTitle>{a.sens === "vente" ? "Vendeur" : "Acheteur"}</SectionTitle>
        <Card className="flex items-center gap-3 p-4">
          <span className="font-wide grid size-12 shrink-0 place-items-center rounded-xl bg-teal/15 font-bold text-teal">
            {a.vendeur.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{a.vendeur}</p>
            {a.vendeurVerifie ? (
              <p className="flex items-center gap-1 text-sm text-teal">
                <IconShield size={14} /> Entreprise vérifiée
              </p>
            ) : (
              <p className="text-sm text-subtle">Vérification en cours</p>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Besoin d&apos;un coup de main ?</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <ButtonLink href={`/transport?annonce=${a.id}`} variant="secondary">
            <IconTruck size={20} className="text-teal" /> Demander un transport
          </ButtonLink>
          <ButtonLink href={`/broyeurs?resine=${a.resine}`} variant="secondary">
            <IconGrinder size={20} className="text-teal" /> Trouver un broyeur
          </ButtonLink>
        </div>
      </section>

      <Link
        href={`/signaler?cible=annonce&id=${a.id}`}
        className="mt-8 inline-flex items-center gap-2 text-sm text-subtle hover:text-coral"
      >
        <IconFlag size={16} /> Signaler cette annonce
      </Link>

      <StickyActions>
        <ButtonLink href={contact} className="flex-1">
          <IconChat size={20} /> Contacter {a.sens === "vente" ? "le vendeur" : "l'acheteur"}
        </ButtonLink>
      </StickyActions>
      <div className="h-20 md:hidden" />
    </div>
  );
}
