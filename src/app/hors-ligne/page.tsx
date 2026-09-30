import type { Metadata } from "next";
import { ResinBadge } from "@/components/resin-badge";

export const metadata: Metadata = { title: "Hors ligne — PyroMarket" };

// Servie par le service worker quand le réseau est indisponible.
export default function HorsLignePage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center pt-16 text-center">
      <ResinBadge code={7} size="lg" className="text-subtle" />
      <h1 className="font-wide mt-6 text-2xl text-foreground">Pas de connexion</h1>
      <p className="mt-2 text-muted">
        PyroMarket a besoin d&apos;internet pour afficher les annonces et les messages.
        Vérifiez votre réseau puis rechargez la page.
      </p>
      {/* Rechargement complet voulu : la navigation client échouerait hors ligne. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-mint px-6 font-medium text-ink hover:bg-mint-strong"
      >
        Réessayer
      </a>
    </div>
  );
}
