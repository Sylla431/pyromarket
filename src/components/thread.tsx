"use client";

import { useState } from "react";
import type { ConversationMock } from "@/lib/mock-data";
import { formatXof } from "@/lib/resines";
import { IconSend } from "./icons";

type Message = ConversationMock["messages"][number];

// Fil de discussion. Les envois restent locaux tant que la messagerie
// n'est pas branchée sur la table `messages`.
export function Thread({ initial }: { initial: Message[] }) {
  const [messages, setMessages] = useState(initial);
  const [texte, setTexte] = useState("");
  const [decisions, setDecisions] = useState<Record<number, "acceptee" | "refusee">>({});

  function envoyer(e: React.FormEvent) {
    e.preventDefault();
    const t = texte.trim();
    if (!t) return;
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { moi: true, texte: t, heure }]);
    setTexte("");
  }

  return (
    <>
      <ol className="space-y-2 pb-24" aria-live="polite">
        {messages.length === 0 && (
          <li className="py-10 text-center text-sm text-subtle">
            Présentez votre besoin : matière, quantité, dates.
          </li>
        )}
        {messages.map((m, i) => (
          <li key={i} className={`flex ${m.moi ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                m.moi ? "rounded-br-md bg-mint text-ink" : "rounded-bl-md border border-line bg-surface text-foreground"
              }`}
            >
              {m.devis && (
                <div className="mb-2 rounded-xl border border-teal/40 bg-ink/40 p-3">
                  <p className="text-xs tracking-wide text-teal uppercase">Devis transport</p>
                  <p className="font-wide mt-1 text-2xl font-bold text-mint">{formatXof(m.devis.montantXof)}</p>
                  <p className="text-sm text-soft">{m.devis.trajet}</p>
                  {decisions[i] ? (
                    <p className={`mt-3 text-sm font-medium ${decisions[i] === "acceptee" ? "text-mint" : "text-coral"}`}>
                      {decisions[i] === "acceptee" ? "Devis accepté" : "Devis refusé"}
                    </p>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDecisions((d) => ({ ...d, [i]: "acceptee" }))}
                        className="h-10 rounded-lg bg-mint text-sm font-medium text-ink hover:bg-teal"
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecisions((d) => ({ ...d, [i]: "refusee" }))}
                        className="h-10 rounded-lg border border-line text-sm text-soft hover:border-coral hover:text-coral"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              )}
              <p className="text-[15px] leading-snug">{m.texte}</p>
              <p className={`mt-1 text-right font-mono text-[10px] ${m.moi ? "text-ink/60" : "text-subtle"}`}>{m.heure}</p>
            </div>
          </li>
        ))}
      </ol>

      <form
        onSubmit={envoyer}
        className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur md:bottom-0"
      >
        <div className="mx-auto flex max-w-3xl gap-2">
          <label className="flex-1">
            <span className="sr-only">Votre message</span>
            <input
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              placeholder="Écrire un message…"
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-foreground placeholder:text-subtle focus:border-teal focus:outline-none"
            />
          </label>
          <button
            type="submit"
            aria-label="Envoyer"
            disabled={!texte.trim()}
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-mint text-ink transition hover:bg-teal active:scale-95 disabled:opacity-40"
          >
            <IconSend size={20} />
          </button>
        </div>
      </form>
    </>
  );
}
