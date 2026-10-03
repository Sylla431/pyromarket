import Link from "next/link";
import { ButtonLink, buttonClass } from "@/components/button";
import { IconBell, IconChevron, IconFlag, IconGrinder, IconMarket, IconShield, IconTruck } from "@/components/icons";
import { Card, Pill, SectionTitle } from "@/components/ui";
import { InstallButton } from "@/components/install-app";
import { deconnexion } from "@/lib/auth-actions";
import { getProfil } from "@/lib/profil";

const ROLE_LABELS: Record<string, string> = {
  vendeur: "Vendeur",
  acheteur: "Acheteur",
  transporteur: "Transporteur",
  broyeur: "Broyeur",
};

export default async function ComptePage() {
  const session = await getProfil();

  if (!session) {
    return (
      <div className="mx-auto max-w-sm pt-10 text-center">
        <h1 className="font-wide text-2xl font-bold text-foreground">Votre espace</h1>
        <p className="mt-2 text-muted">Connectez-vous pour gérer vos annonces, messages et transports.</p>
        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href="/connexion">Se connecter</ButtonLink>
          <ButtonLink href="/inscription" variant="secondary">
            Créer un compte
          </ButtonLink>
        </div>
        <div className="mt-10 border-t border-line pt-6">
          <InstallButton />
        </div>
      </div>
    );
  }

  const { mode, profil } = session;
  const menu = [
    { href: "/compte/annonces", label: "Mes annonces", detail: "Publiées et clôturées", Icon: IconMarket, show: true },
    { href: "/compte/alertes", label: "Mes alertes", detail: "Soyez prévenu des nouvelles annonces", Icon: IconBell, show: true },
    {
      href: "/compte/transporteur",
      label: "Ma capacité de transport",
      detail: "Zone, remorque, tonnage",
      Icon: IconTruck,
      show: profil.roles.includes("transporteur") || mode === "demo",
    },
    {
      href: "/compte/broyeur",
      label: "Ma fiche broyeur",
      detail: "Visible dans l'annuaire",
      Icon: IconGrinder,
      show: profil.roles.includes("broyeur"),
    },
    { href: "/admin/moderation", label: "Modération", detail: "Signalements et vérifications", Icon: IconFlag, show: mode === "demo" },
  ].filter((m) => m.show);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {mode === "demo" && (
        <p className="rounded-xl border border-teal/40 bg-teal/10 px-4 py-3 text-sm text-teal">
          Mode démo : ce profil est fictif tant que Supabase n&apos;est pas configuré.
        </p>
      )}

      <section className="flex items-center gap-4">
        <span className="font-wide grid size-16 shrink-0 place-items-center rounded-2xl bg-mint text-2xl font-bold text-ink">
          {(profil.entreprise || profil.nom || "?").charAt(0)}
        </span>
        <div className="min-w-0">
          <h1 className="font-wide truncate text-xl font-bold text-foreground">{profil.entreprise || "Mon entreprise"}</h1>
          <p className="text-sm text-muted">{profil.nom}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profil.roles.map((r) => (
              <Pill key={r} tone="teal">
                {ROLE_LABELS[r] ?? r}
              </Pill>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Vérification</SectionTitle>
        <Card className="divide-y divide-line">
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm text-subtle">RCCM</p>
              <p className="font-mono text-foreground">{profil.rccm || "—"}</p>
            </div>
            {profil.rccmVerifie ? (
              <Pill tone="mint">
                <IconShield size={14} /> Vérifié
              </Pill>
            ) : (
              <Pill tone="coral">À vérifier</Pill>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm text-subtle">Autorisation environnementale</p>
              <p className="text-foreground">{profil.agrement}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-subtle">Zone d&apos;activité</p>
            <p className="text-foreground">{profil.zoneActivite || "—"}</p>
          </div>
        </Card>
      </section>

      <section>
        <SectionTitle>Mon activité</SectionTitle>
        <ul className="space-y-2">
          {menu.map(({ href, label, detail, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition hover:border-teal"
              >
                <Icon size={24} weight="duotone" className="text-teal" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground">{label}</span>
                  <span className="block text-sm text-muted">{detail}</span>
                </span>
                <IconChevron className="text-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Application</SectionTitle>
        <InstallButton />
      </section>

      {mode === "connecte" && (
        <form action={deconnexion}>
          <button type="submit" className={buttonClass("danger", "md", "w-full")}>
            Se déconnecter
          </button>
        </form>
      )}
    </div>
  );
}
