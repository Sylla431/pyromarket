"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/annonces", label: "Annonces" },
  { href: "/admin/transport", label: "Transport" },
  { href: "/admin/signalements", label: "Signalements" },
];

export function AdminTabs({ aTraiter }: { aTraiter: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration" className="scrollbar-none -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-line px-4">
      {ONGLETS.map(({ href, label }) => {
        const actif = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={actif ? "page" : undefined}
            className={`-mb-px flex h-11 shrink-0 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition ${
              actif ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {label}
            {href === "/admin/signalements" && aTraiter > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-coral px-1.5 font-mono text-[11px] leading-5 text-white">
                {aTraiter}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
