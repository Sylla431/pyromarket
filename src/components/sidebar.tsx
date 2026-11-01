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

function Lien({ entree, actif, fin }: { entree: Entree; actif: boolean; fin?: boolean }) {
  const { href, label, Icon, badge, point } = entree;
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 font-medium transition ${fin ? "h-9 text-[13px]" : "h-11 text-sm"} ${
        actif ? "bg-mint/20 text-accent" : "text-soft hover:bg-surface hover:text-foreground"
      }`}
    >
      <Icon size={fin ? 18 : 20} weight={actif ? "fill" : "regular"} />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="grid min-w-5 place-items-center rounded-full bg-coral px-1.5 font-mono text-[11px] leading-5 text-white">
          {badge}
        </span>
      ) : null}
      {point && <span className="size-2 rounded-full bg-coral" aria-label="Non lues" />}
    </Link>
  );
}

// Menu latéral du site sur grand écran (la barre d'onglets reste sur mobile).
export function Sidebar() {
  const pathname = usePathname();
  const compte = useCompte();
  const actif = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const dansAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 flex-col border-r border-line bg-background lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="font-wide text-xl tracking-tight">
          Pyro<span className="text-accent">Market</span>
        </Link>
      </div>

      <div className="px-4 pb-4">
        <Link
          href="/publier"
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-mint text-sm font-medium text-ink transition hover:bg-mint-strong active:scale-[0.98]"
        >
          <IconPlus size={18} weight="bold" /> Publier
        </Link>
      </div>

      <nav aria-label="Principale" className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-1">
          {PRINCIPAL.map((e) => (
            <li key={e.href}>
              <Lien entree={e} actif={actif(e.href)} />
            </li>
          ))}
        </ul>

        {compte?.isAdmin && (
          <div className="mt-6">
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase">Administration</p>
            <Lien
              entree={{ href: "/admin", label: "Tableau de bord", Icon: IconDashboard }}
              actif={pathname === "/admin"}
            />
            {dansAdmin && (
              <ul className="mt-1 ml-5 space-y-0.5 border-l border-line pl-2">
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

      <div className="border-t border-line p-4">
        {compte ? (
          <Link
            href="/compte"
            aria-current={actif("/compte") ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl p-2 transition ${actif("/compte") ? "bg-mint/20" : "hover:bg-surface"}`}
          >
            <span className="font-wide grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-mint">
              {(compte.entreprise || compte.nom || "?").charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{compte.entreprise || compte.nom}</span>
              <span className="block truncate text-xs text-subtle">{compte.isAdmin ? "Administrateur" : "Mon compte"}</span>
            </span>
          </Link>
        ) : compte === null ? (
          <div className="space-y-2">
            <Link
              href="/connexion"
              className="flex h-10 items-center justify-center rounded-xl border border-line text-sm font-medium text-foreground hover:border-teal"
            >
              Se connecter
            </Link>
            <Link href="/inscription" className="block text-center text-xs text-accent hover:underline">
              Créer un compte
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2" aria-hidden="true">
            <span className="grid size-10 place-items-center rounded-xl bg-surface text-subtle">
              <IconUser />
            </span>
            <span className="h-3 w-24 rounded bg-surface" />
          </div>
        )}
      </div>
    </aside>
  );
}
