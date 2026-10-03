"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBell,
  IconChat,
  IconGrinder,
  IconMarket,
  IconPlus,
  IconTruck,
  IconUser,
} from "./icons";

const tabs = [
  { href: "/annonces", label: "Marché", Icon: IconMarket },
  { href: "/transport", label: "Transport", Icon: IconTruck },
  { href: "/publier", label: "Publier", Icon: IconPlus, primary: true },
  { href: "/broyeurs", label: "Broyeurs", Icon: IconGrinder },
  { href: "/messages", label: "Messages", Icon: IconChat, badge: 2 },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function TopBar() {
  const isActive = useIsActive();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="font-wide text-lg font-bold tracking-tight">
          Pyro<span className="text-accent">Market</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Principale">
          {tabs.map(({ href, label, primary }) =>
            primary ? null : (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive(href) ? "text-accent" : "text-soft hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/publier"
            className="mr-2 hidden h-10 items-center gap-1.5 rounded-xl bg-mint px-4 text-sm font-medium text-ink hover:bg-mint-strong md:inline-flex"
          >
            <IconPlus size={18} /> Publier
          </Link>
          <Link
            href="/notifications"
            aria-label="Notifications, 2 non lues"
            className="relative grid size-11 place-items-center rounded-xl text-soft hover:bg-surface hover:text-foreground"
          >
            <IconBell />
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-coral ring-2 ring-background" />
          </Link>
          <Link
            href="/compte"
            aria-label="Mon compte"
            className={`grid size-11 place-items-center rounded-xl hover:bg-surface ${
              isActive("/compte") ? "text-accent" : "text-soft hover:text-foreground"
            }`}
          >
            <IconUser />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Principale"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid h-[4.5rem] max-w-md grid-cols-5 items-center px-2">
        {tabs.map(({ href, label, Icon, primary, badge }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex justify-center">
              {primary ? (
                <Link
                  href={href}
                  aria-label={label}
                  className="-mt-7 grid size-14 place-items-center rounded-2xl bg-mint text-ink shadow-lg shadow-mint/20 ring-4 ring-background transition active:scale-95"
                >
                  <Icon size={26} weight="bold" />
                </Link>
              ) : (
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-w-16 flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition ${
                    active ? "text-accent" : "text-subtle"
                  }`}
                >
                  <Icon weight={active ? "fill" : "regular"} />
                  {label}
                  {badge ? (
                    <span className="absolute top-0 right-3 grid min-w-4 place-items-center rounded-full bg-coral px-1 font-mono text-[10px] leading-4 text-white">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
