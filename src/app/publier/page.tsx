import Link from "next/link";
import { IconChevron, IconGrinder, IconMarket, IconTruck } from "@/components/icons";
import { PageHeader } from "@/components/ui";

const choix = [
  {
    href: "/annonces/nouvelle",
    Icon: IconMarket,
    titre: "Une annonce de plastique",
    detail: "Vendre un volume disponible ou chercher de la matière.",
  },
  {
    href: "/compte/transporteur",
    Icon: IconTruck,
    titre: "Ma capacité de transport",
    detail: "Zone couverte, type de remorque et tonnage.",
  },
  {
    href: "/compte/broyeur",
    Icon: IconGrinder,
    titre: "Ma fiche broyeur",
    detail: "Apparaître dans l'annuaire des broyeurs.",
  },
];

export default function PublierPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Que voulez-vous publier ?" />
      <ul className="space-y-3">
        {choix.map(({ href, Icon, titre, detail }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-5 transition hover:border-accent active:scale-[0.99]"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-mint/10 text-accent">
                <Icon size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-medium text-foreground">{titre}</span>
                <span className="mt-0.5 block text-sm text-muted">{detail}</span>
              </span>
              <IconChevron className="text-subtle" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
