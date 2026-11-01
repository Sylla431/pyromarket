"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDashboard, IconFlag, IconMarket, IconTruck, IconUsers } from "@/components/icons";

export type Compteurs = { signalements: number; annonces: number; utilisateurs: number; demandes: number };

const ENTREES = [
  { href: "/admin", label: "Vue d'ensemble", Icon: IconDashboard, cle: null },
  { href: "/admin/utilisateurs", label: "Utilisateurs", Icon: IconUsers, cle: "utilisateurs" },
  { href: "/admin/annonces", label: "Annonces", Icon: IconMarket, cle: "annonces" },
  { href: "/admin/transport", label: "Transport", Icon: IconTruck, cle: "demandes" },
  { href: "/admin/signalements", label: "Signalements", Icon: IconFlag, cle: "signalements" },
] as const;

function useActif() {
  const pathname = usePathname();
  return (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
}

// Menu latéral sur grand écran, onglets défilants sur mobile.
export function AdminNav({ compteurs }: { compteurs: Compteurs }) {
  const actif = useActif();

  return (
    <>
      <nav aria-label="Administration" className="hidden lg:block">
        <ul className="sticky top-20 space-y-1">
          {ENTREES.map(({ href, label, Icon, cle }) => {
            const on = actif(href);
            const n = cle ? compteurs[cle] : null;
            const alerte = cle === "signalements" && (n ?? 0) > 0;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                    on ? "bg-mint/20 text-accent" : "text-soft hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon size={20} weight={on ? "fill" : "regular"} />
                  <span className="flex-1">{label}</span>
                  {n !== null && (
                    <span
                      className={`grid min-w-6 place-items-center rounded-full px-1.5 font-mono text-[11px] leading-5 ${
                        alerte ? "bg-coral text-white" : "bg-surface text-subtle"
                      }`}
                    >
                      {n}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Administration" className="scrollbar-none -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-line px-4 lg:hidden">
        {ENTREES.map(({ href, label, cle }) => {
          const on = actif(href);
          const alerte = cle === "signalements" && compteurs.signalements > 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`-mb-px flex h-11 shrink-0 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition ${
                on ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {label}
              {alerte && (
                <span className="grid min-w-5 place-items-center rounded-full bg-coral px-1.5 font-mono text-[11px] leading-5 text-white">
                  {compteurs.signalements}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
