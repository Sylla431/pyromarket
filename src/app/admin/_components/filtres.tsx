import Link from "next/link";

// Puces de filtre en tête d'un panneau du tableau de bord.
export function Filtres({
  items,
}: {
  items: { href: string; label: string; active: boolean; count?: number }[];
}) {
  return (
    <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-line p-4">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={i.active ? "page" : undefined}
          className={`flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm transition ${
            i.active ? "border-accent bg-mint/15 text-accent" : "border-line text-soft hover:border-teal"
          }`}
        >
          {i.label}
          {i.count !== undefined && <span className="font-mono text-xs opacity-70">{i.count}</span>}
        </Link>
      ))}
    </div>
  );
}
