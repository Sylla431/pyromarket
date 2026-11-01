"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  IconBell,
  IconChat,
  IconDashboard,
  IconFlag,
  IconGrinder,
  IconMarket,
  IconPlus,
  IconTruck,
  IconUser,
  IconUsers,
  type IconProps,
} from "./icons";

type Entree = {
  href: string;
  label: string;
  Icon: (p: IconProps) => React.ReactNode;
  badge?: number;
  point?: boolean;
};

const PRINCIPAL: Entree[] = [
  { href: "/annonces", label: "Marché", Icon: IconMarket },
  { href: "/transport", label: "Transport", Icon: IconTruck },
  { href: "/broyeurs", label: "Broyeurs", Icon: IconGrinder },
  { href: "/messages", label: "Messages", Icon: IconChat, badge: 2 },
  { href: "/notifications", label: "Notifications", Icon: IconBell, point: true },
];

const ADMIN: Entree[] = [
  { href: "/admin/utilisateurs", label: "Utilisateurs", Icon: IconUsers },
  { href: "/admin/annonces", label: "Annonces", Icon: IconMarket },
  { href: "/admin/transport", label: "Transport", Icon: IconTruck },
  { href: "/admin/signalements", label: "Signalements", Icon: IconFlag },
];

type Compte = { nom: string; entreprise: string | null; isAdmin: boolean } | null;

// Compte connecté, lu depuis le navigateur (les pages statiques le restent)
// et mis à jour à la connexion / déconnexion.
function useCompte() {
  const [compte, setCompte] = useState<Compte | undefined>(undefined);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      queueMicrotask(() => setCompte(null));
      return;
    }
    const supabase = createClient();

    async function charger(userId: string | undefined) {
      if (!userId) return setCompte(null);
      const { data } = await supabase
        .from("profiles")
        .select("nom, entreprise, is_admin")
        .eq("id", userId)
        .maybeSingle();
      setCompte(data ? { nom: data.nom, entreprise: data.entreprise, isAdmin: Boolean(data.is_admin) } : null);
    }

    supabase.auth.getUser().then(({ data }) => charger(data.user?.id));
    const { data: abonnement } = supabase.auth.onAuthStateChange((_evt, session) => {
      charger(session?.user.id);
    });
    return () => abonnement.subscription.unsubscribe();
  }, []);

  return compte;
}

// Entrée du menu : icône seule (avec infobulle) en rail, icône + libellé
// en menu complet.
function Lien({ entree, actif, fin }: { entree: Entree; actif: boolean; fin?: boolean }) {
  const { href, label, Icon, badge, point } = entree;
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      aria-current={actif ? "page" : undefined}
      className={`relative flex items-center justify-center gap-3 rounded-xl font-medium transition lg:justify-start lg:px-3 ${
        fin ? "h-9 text-[13px]" : "h-11 text-sm"
      } ${actif ? "bg-mint/20 text-accent" : "text-soft hover:bg-surface hover:text-foreground"}`}
    >
      <Icon size={fin ? 18 : 20} weight={actif ? "fill" : "regular"} />
      <span className="hidden flex-1 lg:inline">{label}</span>
      {badge ? (
        <span className="absolute top-1 right-2 grid min-w-5 place-items-center rounded-full bg-coral px-1.5 font-mono text-[11px] leading-5 text-white lg:static">
          {badge}
        </span>
      ) : null}
      {point && <span className="absolute top-2.5 right-4 size-2 rounded-full bg-coral lg:static" aria-label="Non lues" />}
    </Link>
  );
}

// Menu latéral du site dès 768 px (réduit aux icônes jusqu'à 1024 px) ;
// sur téléphone, la barre du haut et la barre d'onglets prennent le relais.
export function Sidebar() {
  const pathname = usePathname();
  const compte = useCompte();
  const actif = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const dansAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <aside className="sticky top-0 hidden h-screen w-rail shrink-0 flex-col border-r border-line bg-background md:flex lg:w-sidebar">
      <div className="flex h-16 items-center justify-center lg:justify-start lg:px-6">
        <Link href="/" className="font-wide text-xl tracking-tight" aria-label="Manasugu, accueil">
          <span className="grid size-10 place-items-center rounded-xl bg-ink text-mint lg:hidden">M</span>
          <span className="hidden lg:inline">
            Mana<span className="text-accent">sugu</span>
          </span>
        </Link>
      </div>

      <div className="px-3 pb-4 lg:px-4">
        <Link
          href="/publier"
          title="Publier"
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-mint text-sm font-medium text-ink transition hover:bg-mint-strong active:scale-[0.98]"
        >
          <IconPlus size={18} weight="bold" /> <span className="hidden lg:inline">Publier</span>
        </Link>
      </div>

      <nav aria-label="Principale" className="flex-1 overflow-y-auto px-3 lg:px-4">
        <ul className="space-y-1">
          {PRINCIPAL.map((e) => (
            <li key={e.href}>
              <Lien entree={e} actif={actif(e.href)} />
            </li>
          ))}
        </ul>

        {compte?.isAdmin && (
          <div className="mt-6">
            <p className="hidden px-3 pb-2 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase lg:block">Administration</p>
            <hr className="mb-2 border-line lg:hidden" />
            <Lien
              entree={{ href: "/admin", label: "Tableau de bord", Icon: IconDashboard }}
              actif={pathname === "/admin"}
            />
            {dansAdmin && (
              <ul className="mt-1 space-y-0.5 lg:ml-5 lg:border-l lg:border-line lg:pl-2">
                {ADMIN.map((e) => (
                  <li key={e.href}>
                    <Lien entree={e} actif={actif(e.href)} fin />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>

      <div className="border-t border-line p-3 lg:p-4">
        {compte ? (
          <Link
            href="/compte"
            aria-current={actif("/compte") ? "page" : undefined}
            title="Mon compte"
            className={`flex items-center justify-center gap-3 rounded-xl p-1.5 transition lg:justify-start lg:p-2 ${actif("/compte") ? "bg-mint/20" : "hover:bg-surface"}`}
          >
            <span className="font-wide grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-mint">
              {(compte.entreprise || compte.nom || "?").charAt(0).toUpperCase()}
            </span>
            <span className="hidden min-w-0 lg:block">
              <span className="block truncate text-sm font-medium text-foreground">{compte.entreprise || compte.nom}</span>
              <span className="block truncate text-xs text-subtle">{compte.isAdmin ? "Administrateur" : "Mon compte"}</span>
            </span>
          </Link>
        ) : compte === null ? (
          <div className="space-y-2">
            <Link
              href="/connexion"
              title="Se connecter"
              className="flex h-10 items-center justify-center rounded-xl border border-line text-sm font-medium text-foreground hover:border-teal"
            >
              <IconUser size={20} className="lg:hidden" />
              <span className="hidden lg:inline">Se connecter</span>
            </Link>
            <Link href="/inscription" className="hidden text-center text-xs text-accent hover:underline lg:block">
              Créer un compte
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 p-2 lg:justify-start" aria-hidden="true">
            <span className="grid size-10 place-items-center rounded-xl bg-surface text-subtle">
              <IconUser />
            </span>
            <span className="hidden h-3 w-24 rounded bg-surface lg:block" />
          </div>
        )}
      </div>
    </aside>
  );
}
