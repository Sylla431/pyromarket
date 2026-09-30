import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button";
import { IconChat, IconFlag, IconPin } from "@/components/icons";
import { ResinBadge } from "@/components/resin-badge";
import { Card, PageHeader, Pill, SectionTitle, Stat, StickyActions } from "@/components/ui";
import { mockBroyeurs } from "@/lib/mock-data";
import { formatXof } from "@/lib/resines";

export default async function BroyeurPage({ params }: PageProps<"/broyeurs/[id]">) {
  const { id } = await params;
  const b = mockBroyeurs.find((x) => x.id === id);
  if (!b) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back="/broyeurs" title={b.entreprise} subtitle={b.typeBroyeur} />

      <div className="flex flex-wrap gap-2">
        {b.disponible ? <Pill tone="mint">Disponible</Pill> : <Pill>Complet pour le moment</Pill>}
        <Pill>
          <IconPin size={12} /> {b.localisation} ({b.departement})
        </Pill>
      </div>

      <Card className="mt-4 p-4">
        <dl className="grid grid-cols-2 gap-4">
          <Stat label="Capacité" value={`${b.capaciteKgH.toLocaleString("fr-FR")} kg/h`} />
          <Stat label="Tarif indicatif" value={<span className="text-accent">{formatXof(b.tarifXofKg)}/kg</span>} />
        </dl>
      </Card>

      <section className="mt-6">
        <SectionTitle>Matières traitées</SectionTitle>
        <div className="flex flex-wrap gap-4">
          {b.matieres.map((m) => (
            <ResinBadge key={m} code={m} />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>Présentation</SectionTitle>
        <p className="leading-relaxed text-soft">{b.description}</p>
      </section>

      <p className="mt-6 text-sm text-subtle">
        Pas de réservation en ligne : convenez directement d&apos;un créneau par message.
      </p>

      <Link
        href={`/signaler?cible=profil&id=${b.id}`}
        className="mt-6 inline-flex items-center gap-2 text-sm text-subtle hover:text-coral"
      >
        <IconFlag size={16} /> Signaler ce profil
      </Link>

      <StickyActions>
        <ButtonLink
          href={`/messages/nouveau?a=${encodeURIComponent(b.entreprise)}&sujet=${encodeURIComponent("Demande de broyage")}`}
          className="flex-1"
        >
          <IconChat size={20} /> Contacter {b.entreprise}
        </ButtonLink>
      </StickyActions>
      <div className="h-20 md:hidden" />
    </div>
  );
}
