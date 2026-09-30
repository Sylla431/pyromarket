import Link from "next/link";
import type { ReactNode } from "react";
import { IconBack } from "./icons";

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 pb-5">
      {back && (
        <Link
          href={back}
          aria-label="Retour"
          className="-ml-2 grid size-11 shrink-0 place-items-center rounded-xl text-soft hover:bg-surface hover:text-foreground"
        >
          <IconBack />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="font-wide text-2xl leading-tight font-bold text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-surface/60 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        {children}
      </h2>
      {action}
    </div>
  );
}

// Onglets à base de liens : fonctionnent sans JavaScript.
export function Segmented({
  items,
}: {
  items: { href: string; label: string; active: boolean; count?: number }[];
}) {
  return (
    <div className="flex rounded-xl border border-line bg-surface p-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition ${
            item.active ? "bg-ink text-mint shadow" : "text-muted hover:text-foreground"
          }`}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="font-mono text-xs opacity-70">{item.count}</span>
          )}
        </Link>
      ))}
    </div>
  );
}

const pillTones = {
  mint: "bg-mint/12 text-mint",
  teal: "bg-teal/15 text-teal",
  coral: "bg-coral/12 text-coral",
  muted: "bg-line/60 text-muted",
};

export function Pill({
  tone = "muted",
  children,
}: {
  tone?: keyof typeof pillTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${pillTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {children && <p className="mt-1 text-sm text-muted">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-0.5 truncate font-mono text-[15px] text-foreground">{value}</dd>
    </div>
  );
}

// Bandeau d'action collé au-dessus de la barre d'onglets sur mobile.
export function StickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
      <div className="mx-auto flex max-w-3xl gap-3">{children}</div>
    </div>
  );
}
