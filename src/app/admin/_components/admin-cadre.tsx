import type { Compteurs } from "./admin-nav";
import { AdminNav } from "./admin-nav";

// Cadre du tableau de bord, séparé pour pouvoir l'afficher sans session.
export function AdminCadre({
  compteurs,
  date,
  children,
}: {
  compteurs: Compteurs;
  date: string;
  children: React.ReactNode;
}) {
  return (
    // Sur grand écran, le tableau de bord déborde de la colonne du site
    // pour profiter de la largeur (jusqu'à 1280 px).
    <div className="lg:mx-[calc((100%-min(1280px,100vw-3rem))/2)]">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-teal uppercase">Administration</p>
          <h1 className="font-wide mt-1 text-2xl text-foreground lg:text-3xl">Tableau de bord</h1>
        </div>
        <p className="text-sm text-subtle first-letter:uppercase">{date}</p>
      </header>
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <AdminNav compteurs={compteurs} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
