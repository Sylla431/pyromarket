import Link from "next/link";
import {
  compterProfils,
  depuis,
  depuisMoinsDe,
  exigerAdmin,
  lireAnnonces,
  lireDemandes,
  lireSignalements,
  lireUtilisateurs,
  nomCompte,
} from "@/lib/admin";
import { RESINES, formatKg, formatXof, regionNom } from "@/lib/resines";
import { Barres, Kpi, ROLE_LABELS } from "./_components/ui";

export default async function AdminAccueil() {
  const supabase = await exigerAdmin();
  const [utilisateurs, annonces, demandes, signalements, profils] = await Promise.all([
    lireUtilisateurs(supabase),
    lireAnnonces(supabase),
    lireDemandes(supabase),
    lireSignalements(supabase),
    compterProfils(supabase),
  ]);


  const enLigne = annonces.filter((a) => a.statut === "publiee");
  const ventes = enLigne.filter((a) => a.sens === "vente");
  const vendues = annonces.filter((a) => a.statut === "cloturee");
  const volumeKg = ventes.reduce((s, a) => s + a.quantite_kg, 0);
  const valeurXof = ventes.reduce((s, a) => s + (a.prix_xof ? (a.quantite_kg / 1000) * a.prix_xof : 0), 0);
  const aVerifier = utilisateurs.filter((u) => !u.rccm_verifie && u.rccm).length;
  const signalementsATraiter = signalements.filter((s) => s.statut === "a_traiter").length;
  const demandesEnAttente = demandes.filter((d) => d.statut === "en_attente").length;

  // Fil d'activité : les derniers évènements de toute la plateforme.
  const activite = [
    ...utilisateurs.map((u) => ({
      date: u.inscrit_le,
      texte: `${nomCompte(u)} a créé son compte`,
      detail: u.roles.map((r) => ROLE_LABELS[r] ?? r).join(", ") || "Sans activité déclarée",
      href: "/admin/utilisateurs",
    })),
    ...annonces.map((a) => ({
      date: a.created_at,
      texte: `${nomCompte(a.vendeur)} a publié « ${a.type_plastique} »`,
      detail: `${a.sens === "achat" ? "Recherche" : "Vente"} · ${formatKg(a.quantite_kg)} · ${a.localisation}`,
      href: "/admin/annonces",
    })),
    ...demandes.map((d) => ({
      date: d.created_at,
      texte: `Demande de transport pour « ${d.annonce?.type_plastique ?? "une annonce"} »`,
      detail: [d.zone_depart, d.zone_arrivee].filter(Boolean).join(" → ") || "Trajet à préciser",
      href: "/admin/transport",
    })),
    ...signalements.map((s) => ({
      date: s.created_at,
      texte: `${nomCompte(s.auteur)} a signalé ${s.cible_type === "annonce" ? "une annonce" : "un profil"}`,
      detail: s.motif,
      href: "/admin/signalements",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);

  const parRole = Object.entries(ROLE_LABELS).map(([role, label]) => ({
    label,
    valeur: utilisateurs.filter((u) => u.roles.includes(role)).length,
  }));
  const parResine = RESINES.map((r) => ({
    label: `${r.code} · ${r.sigle}`,
    valeur: ventes.filter((a) => a.resine === r.code).reduce((s, a) => s + a.quantite_kg, 0),
  }));
  const regions = new Map<string, number>();
  for (const a of enLigne) {
    const nom = a.region ? regionNom(a.region) : "Non précisée";
    regions.set(nom, (regions.get(nom) ?? 0) + 1);
  }
  const parRegion = [...regions.entries()]
    .map(([label, valeur]) => ({ label, valeur }))
    .sort((a, b) => b.valeur - a.valeur)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Utilisateurs"
          valeur={utilisateurs.length}
          detail={`+${utilisateurs.filter((u) => depuisMoinsDe(u.inscrit_le, 7)).length} cette semaine`}
          href="/admin/utilisateurs"
        />
        <Kpi
          label="Annonces en ligne"
          valeur={enLigne.length}
          detail={`${ventes.length} ventes · ${enLigne.length - ventes.length} recherches`}
          href="/admin/annonces"
        />
        <Kpi label="Volume à vendre" valeur={formatKg(volumeKg)} detail={`Valeur affichée : ${formatXof(Math.round(valeurXof))}`} />
        <Kpi label="Ventes conclues" valeur={vendues.length} detail="Annonces clôturées par le vendeur" href="/admin/annonces?statut=cloturee" />
        <Kpi
          label="Demandes de transport"
          valeur={demandes.length}
          detail={`${demandesEnAttente} en attente`}
          href="/admin/transport"
        />
        <Kpi
          label="Broyeurs · Transporteurs"
          valeur={`${profils.broyeurs} · ${profils.transporteurs}`}
          detail={`${profils.broyeursDisponibles} et ${profils.transporteursDisponibles} disponibles`}
        />
        <Kpi
          label="Signalements à traiter"
          valeur={signalementsATraiter}
          alerte={signalementsATraiter > 0}
          href="/admin/signalements"
        />
        <Kpi
          label="RCCM à vérifier"
          valeur={aVerifier}
          alerte={aVerifier > 0}
          detail={`${profils.messages} messages échangés`}
          href="/admin/utilisateurs?filtre=a_verifier"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted uppercase">Activité récente</h2>
          {activite.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-subtle">
              Rien pour l&apos;instant : l&apos;activité de la plateforme apparaîtra ici.
            </p>
          ) : (
            <ol className="divide-y divide-line rounded-2xl border border-line">
              {activite.map((e, i) => (
                <li key={i}>
                  <Link href={e.href} className="flex gap-3 px-4 py-3 transition hover:bg-surface/60">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{e.texte}</span>
                      <span className="block truncate text-xs text-subtle">{e.detail}</span>
                    </span>
                    <span className="shrink-0 text-xs text-subtle">{depuis(e.date)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="space-y-4">
          <Barres titre="Utilisateurs par activité" lignes={parRole} />
          <Barres titre="Volume à vendre par résine" lignes={parResine} format={formatKg} />
          <Barres titre="Annonces en ligne par région" lignes={parRegion} />
        </div>
      </div>
    </div>
  );
}
