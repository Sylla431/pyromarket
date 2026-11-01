import Link from "next/link";
import type { ReactNode } from "react";
import {
  IconFlag,
  IconGrinder,
  IconHandshake,
  IconIdCard,
  IconMarket,
  IconPackage,
  IconTruck,
  IconUser,
  IconUsers,
} from "@/components/icons";
import { ResinBadge } from "@/components/resin-badge";
import {
  depuis,
  depuisMoinsDe,
  nomCompte,
  periode,
  serieHebdo,
  type AnnonceAdmin,
  type DemandeTransport,
  type Signalement,
  type Utilisateur,
} from "@/lib/admin";
import { RESINES, formatKg, formatXof, regionNom } from "@/lib/resines";
import { ATraiter, Barres, Kpi, Panneau, ROLE_LABELS } from "./ui";

export type DonneesApercu = {
  utilisateurs: Utilisateur[];
  annonces: AnnonceAdmin[];
  demandes: DemandeTransport[];
  signalements: Signalement[];
  profils: {
    broyeurs: number;
    broyeursDisponibles: number;
    transporteurs: number;
    transporteursDisponibles: number;
    messages: number;
  };
};

type Evenement = { date: string; type: "compte" | "annonce" | "transport" | "signalement"; texte: string; detail: string; href: string };

const TYPES: Record<Evenement["type"], { icone: ReactNode; classe: string }> = {
  compte: { icone: <IconUser size={18} />, classe: "bg-teal/10 text-teal" },
  annonce: { icone: <IconMarket size={18} />, classe: "bg-mint/25 text-accent" },
  transport: { icone: <IconTruck size={18} />, classe: "bg-surface text-soft" },
  signalement: { icone: <IconFlag size={18} />, classe: "bg-coral/10 text-coral" },
};

function synthese({ utilisateurs, annonces, demandes, signalements }: DonneesApercu) {
  const enLigne = annonces.filter((a) => a.statut === "publiee");
  const ventes = enLigne.filter((a) => a.sens === "vente");

  const evenements: Evenement[] = [
    ...utilisateurs.map((u) => ({
      date: u.inscrit_le,
      type: "compte" as const,
      texte: `${nomCompte(u)} a créé son compte`,
      detail: u.roles.map((r) => ROLE_LABELS[r] ?? r).join(", ") || "Sans activité déclarée",
      href: "/admin/utilisateurs",
    })),
    ...annonces.map((a) => ({
      date: a.created_at,
      type: "annonce" as const,
      texte: `${nomCompte(a.vendeur)} a publié « ${a.type_plastique} »`,
      detail: `${a.sens === "achat" ? "Recherche" : "Vente"} · ${formatKg(a.quantite_kg)} · ${a.localisation}`,
      href: "/admin/annonces",
    })),
    ...demandes.map((d) => ({
      date: d.created_at,
      type: "transport" as const,
      texte: `Demande de transport pour « ${d.annonce?.type_plastique ?? "une annonce"} »`,
      detail: [d.zone_depart, d.zone_arrivee].filter(Boolean).join(" → ") || "Trajet à préciser",
      href: "/admin/transport",
    })),
    ...signalements.map((s) => ({
      date: s.created_at,
      type: "signalement" as const,
      texte: `${nomCompte(s.auteur)} a signalé ${s.cible_type === "annonce" ? "une annonce" : "un profil"}`,
      detail: s.motif,
      href: "/admin/signalements",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  // Fil groupé par période, dans l'ordre chronologique inverse.
  const groupes: { periode: string; evenements: (Evenement & { il: string })[] }[] = [];
  for (const e of evenements) {
    const p = periode(e.date);
    const dernier = groupes.at(-1);
    const ligne = { ...e, il: depuis(e.date) };
    if (dernier?.periode === p) dernier.evenements.push(ligne);
    else groupes.push({ periode: p, evenements: [ligne] });
  }

  const regions = new Map<string, number>();
  for (const a of enLigne) {
    const nom = a.region ? regionNom(a.region) : "Non précisée";
    regions.set(nom, (regions.get(nom) ?? 0) + 1);
  }

  return {
    enLigne,
    ventes,
    vendues: annonces.filter((a) => a.statut === "cloturee"),
    volumeKg: ventes.reduce((s, a) => s + a.quantite_kg, 0),
    valeurXof: Math.round(ventes.reduce((s, a) => s + (a.prix_xof ? (a.quantite_kg / 1000) * a.prix_xof : 0), 0)),
    nouveaux: utilisateurs.filter((u) => depuisMoinsDe(u.inscrit_le, 7)).length,
    nouvellesAnnonces: annonces.filter((a) => depuisMoinsDe(a.created_at, 7)).length,
    aVerifier: utilisateurs.filter((u) => !u.rccm_verifie && u.rccm).length,
    signalementsATraiter: signalements.filter((s) => s.statut === "a_traiter").length,
    demandesEnAttente: demandes.filter((d) => d.statut === "en_attente").length,
    serieComptes: serieHebdo(utilisateurs.map((u) => u.inscrit_le)),
    serieAnnonces: serieHebdo(annonces.map((a) => a.created_at)),
    serieVentes: serieHebdo(annonces.filter((a) => a.statut === "cloturee").map((a) => a.updated_at)),
    groupes,
    parRole: Object.entries(ROLE_LABELS).map(([role, label]) => ({
      label,
      valeur: utilisateurs.filter((u) => u.roles.includes(role)).length,
    })),
    parResine: RESINES.map((r) => ({
      label: r.nom,
      valeur: ventes.filter((a) => a.resine === r.code).reduce((s, a) => s + a.quantite_kg, 0),
      prefixe: <ResinBadge code={r.code} size="sm" />,
    })),
    parRegion: [...regions.entries()]
      .map(([label, valeur]) => ({ label, valeur }))
      .sort((a, b) => b.valeur - a.valeur)
      .slice(0, 6),
  };
}

export function VueApercu(donnees: DonneesApercu) {
  const s = synthese(donnees);
  const { profils } = donnees;

  return (
    <div className="space-y-6">
      <section aria-label="À traiter" className="grid gap-3 md:grid-cols-3">
        <ATraiter
          icone={<IconFlag size={22} />}
          label="Signalements à traiter"
          nombre={s.signalementsATraiter}
          href="/admin/signalements"
          action="Traiter"
        />
        <ATraiter
          icone={<IconIdCard size={22} />}
          label="RCCM à vérifier"
          nombre={s.aVerifier}
          href="/admin/utilisateurs?filtre=a_verifier"
          action="Vérifier"
        />
        <ATraiter
          icone={<IconTruck size={22} />}
          label="Transports en attente"
          nombre={s.demandesEnAttente}
          href="/admin/transport?statut=en_attente"
          action="Voir"
        />
      </section>

      <section aria-label="Indicateurs" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icone={<IconUsers size={18} />}
          label="Utilisateurs"
          valeur={donnees.utilisateurs.length}
          detail={`+${s.nouveaux} cette semaine`}
          tendance={s.serieComptes}
          href="/admin/utilisateurs"
        />
        <Kpi
          icone={<IconMarket size={18} />}
          label="Annonces en ligne"
          valeur={s.enLigne.length}
          detail={`+${s.nouvellesAnnonces} cette semaine · ${s.enLigne.length - s.ventes.length} recherches`}
          tendance={s.serieAnnonces}
          href="/admin/annonces?statut=publiee"
        />
        <Kpi
          icone={<IconHandshake size={18} />}
          label="Ventes conclues"
          valeur={s.vendues.length}
          detail="Annonces clôturées"
          tendance={s.serieVentes}
          href="/admin/annonces?statut=cloturee"
        />
        <Kpi
          icone={<IconPackage size={18} />}
          label="Volume à vendre"
          valeur={formatKg(s.volumeKg)}
          detail={`Valeur affichée ${formatXof(s.valeurXof)}`}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panneau
          titre="Activité récente"
          action={
            <span className="text-xs text-subtle">
              {profils.messages} message{profils.messages > 1 ? "s" : ""} échangé{profils.messages > 1 ? "s" : ""}
            </span>
          }
        >
          {s.groupes.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-subtle">L&apos;activité de la plateforme apparaîtra ici.</p>
          ) : (
            <div className="pb-2">
              {s.groupes.map((g) => (
                <div key={g.periode}>
                  <h3 className="px-5 pt-4 pb-1 text-xs font-semibold tracking-[0.12em] text-subtle uppercase">
                    {g.periode}
                  </h3>
                  <ol>
                    {g.evenements.map((e, i) => (
                      <li key={i}>
                        <Link href={e.href} className="flex items-center gap-3 px-5 py-2.5 transition hover:bg-surface/70">
                          <span className={`grid size-9 shrink-0 place-items-center rounded-full ${TYPES[e.type].classe}`}>
                            {TYPES[e.type].icone}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-foreground">{e.texte}</span>
                            <span className="block truncate text-xs text-subtle">{e.detail}</span>
                          </span>
                          <span className="shrink-0 text-xs text-subtle">{e.il}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </Panneau>

        <div className="space-y-6">
          <Panneau titre="Réseau">
            <dl className="grid grid-cols-2 divide-x divide-line">
              <div className="flex items-center gap-3 px-5 py-4">
                <IconGrinder size={24} weight="duotone" className="text-teal" />
                <div>
                  <dt className="text-xs text-subtle">Broyeurs</dt>
                  <dd className="font-mono text-foreground">
                    {profils.broyeurs} <span className="text-xs text-subtle">· {profils.broyeursDisponibles} dispo.</span>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <IconTruck size={24} weight="duotone" className="text-teal" />
                <div>
                  <dt className="text-xs text-subtle">Transporteurs</dt>
                  <dd className="font-mono text-foreground">
                    {profils.transporteurs} <span className="text-xs text-subtle">· {profils.transporteursDisponibles} dispo.</span>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="border-t border-line">
              <p className="px-5 pt-4 text-xs font-semibold tracking-[0.12em] text-subtle uppercase">Comptes par activité</p>
              <Barres lignes={s.parRole} />
            </div>
          </Panneau>
          <Panneau titre="Volume à vendre par résine">
            <Barres lignes={s.parResine.filter((l) => l.valeur > 0)} format={formatKg} vide="Aucun volume à vendre." />
          </Panneau>
          <Panneau titre="Annonces en ligne par région">
            <Barres lignes={s.parRegion} />
          </Panneau>
        </div>
      </div>
    </div>
  );
}
