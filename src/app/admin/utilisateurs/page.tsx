import Link from "next/link";
import { IconSearch, IconShield } from "@/components/icons";
import { EmptyState, Pill } from "@/components/ui";
import { verifierRccm } from "@/lib/admin-actions";
import { depuis, exigerAdmin, lireUtilisateurs } from "@/lib/admin";
import { ActionButton } from "../_components/action-button";
import { ROLE_LABELS } from "../_components/ui";

const FILTRES = [
  { valeur: "", label: "Tous" },
  { valeur: "vendeur", label: "Vendeurs" },
  { valeur: "acheteur", label: "Acheteurs" },
  { valeur: "transporteur", label: "Transporteurs" },
  { valeur: "broyeur", label: "Broyeurs" },
  { valeur: "a_verifier", label: "RCCM à vérifier" },
];

export default async function AdminUtilisateurs({ searchParams }: PageProps<"/admin/utilisateurs">) {
  const params = await searchParams;
  const filtre = typeof params.filtre === "string" ? params.filtre : "";
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";

  const supabase = await exigerAdmin();
  const tous = await lireUtilisateurs(supabase);

  const liste = tous.filter(
    (u) =>
      (!filtre ||
        (filtre === "a_verifier" ? !u.rccm_verifie && Boolean(u.rccm) : u.roles.includes(filtre))) &&
      (!q || [u.nom, u.entreprise, u.email, u.rccm].some((v) => v?.toLowerCase().includes(q))),
  );

  const lien = (f: string) => {
    const p = new URLSearchParams();
    if (f) p.set("filtre", f);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `/admin/utilisateurs?${s}` : "/admin/utilisateurs";
  };

  return (
    <div>
      <form action="/admin/utilisateurs" className="relative">
        {filtre && <input type="hidden" name="filtre" value={filtre} />}
        <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
        <label className="sr-only" htmlFor="q-utilisateurs">
          Rechercher un utilisateur
        </label>
        <input
          id="q-utilisateurs"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Nom, entreprise, e-mail, RCCM…"
          className="h-12 w-full rounded-xl border border-line bg-surface pr-4 pl-11 text-[16px] text-foreground placeholder:text-subtle focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none"
        />
      </form>

      <div className="scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTRES.map((f) => (
          <Link
            key={f.valeur}
            href={lien(f.valeur)}
            className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-sm transition ${
              filtre === f.valeur ? "border-accent bg-mint/10 text-accent" : "border-line text-soft hover:border-teal"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <p className="mt-5 mb-3 text-sm text-subtle">
        <span className="font-mono text-foreground">{liste.length}</span> compte{liste.length > 1 ? "s" : ""}
      </p>

      <ul className="space-y-3">
        {liste.map((u) => (
          <li key={u.id} className="rounded-2xl border border-line bg-surface/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {u.entreprise || u.nom || "Sans nom"}
                  {u.is_admin && (
                    <span className="ml-2 align-middle">
                      <Pill tone="teal">Administrateur</Pill>
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-muted">
                  {u.nom} · {u.email}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.roles.map((r) => (
                  <Pill key={r}>{ROLE_LABELS[r] ?? r}</Pill>
                ))}
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs text-subtle">RCCM</dt>
                <dd className="font-mono text-foreground">{u.rccm || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">Zone</dt>
                <dd className="text-foreground">{u.zone_activite || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">Inscription</dt>
                <dd className="text-foreground">{depuis(u.inscrit_le)}</dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">Dernière connexion</dt>
                <dd className="text-foreground">{u.derniere_connexion ? depuis(u.derniere_connexion) : "Jamais"}</dd>
              </div>
            </dl>
            {u.agrement && <p className="mt-2 text-xs text-subtle">Autorisation : {u.agrement}</p>}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              {u.rccm_verifie ? (
                <span className="flex items-center gap-1.5 text-sm text-accent">
                  <IconShield size={16} weight="fill" /> RCCM vérifié
                </span>
              ) : (
                <span className="text-sm text-coral">{u.rccm ? "RCCM non vérifié" : "Pas de RCCM"}</span>
              )}
              {u.rccm &&
                (u.rccm_verifie ? (
                  <ActionButton
                    action={verifierRccm}
                    champs={{ id: u.id, verifie: "false" }}
                    variant="ghost"
                    confirmer={`Retirer la vérification de ${u.entreprise || u.nom} ?`}
                  >
                    Retirer la vérification
                  </ActionButton>
                ) : (
                  <ActionButton action={verifierRccm} champs={{ id: u.id, verifie: "true" }} variant="primary">
                    Marquer le RCCM vérifié
                  </ActionButton>
                ))}
            </div>
          </li>
        ))}
      </ul>
      {liste.length === 0 && <EmptyState title="Aucun compte ne correspond" />}
    </div>
  );
}
