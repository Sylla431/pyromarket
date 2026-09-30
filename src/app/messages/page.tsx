import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";
import { mockConversations } from "@/lib/mock-data";

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Messages" />
      <ul className="-mx-4 divide-y divide-line border-y border-line sm:mx-0 sm:rounded-2xl sm:border">
        {mockConversations.map((c) => (
          <li key={c.id}>
            <Link href={`/messages/${c.id}`} className="flex gap-3 px-4 py-4 transition hover:bg-surface/60">
              <span className="font-wide grid size-12 shrink-0 place-items-center rounded-xl bg-teal/15 font-bold text-teal">
                {c.interlocuteur.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={`truncate ${c.nonLus ? "font-semibold text-foreground" : "text-soft"}`}>
                    {c.interlocuteur}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-subtle">{c.date}</span>
                </span>
                <span className="block truncate text-xs text-teal">{c.sujet}</span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className={`truncate text-sm ${c.nonLus ? "text-soft" : "text-subtle"}`}>{c.apercu}</span>
                  {c.nonLus > 0 && (
                    <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-mint px-1.5 font-mono text-[11px] text-ink">
                      {c.nonLus}
                    </span>
                  )}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {mockConversations.length === 0 && (
        <EmptyState title="Aucune conversation">Contactez un vendeur depuis une annonce.</EmptyState>
      )}
    </div>
  );
}
