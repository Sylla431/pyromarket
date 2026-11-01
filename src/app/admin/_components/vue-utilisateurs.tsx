import Link from "next/link";
import { IconSearch, IconShield } from "@/components/icons";
import { EmptyState, Pill } from "@/components/ui";
import { verifierRccm } from "@/lib/admin-actions";
import { dateCourte, depuis, type Utilisateur } from "@/lib/admin";
import { ActionButton } from "./action-button";
import { ROLE_LABELS } from "./ui";

const FILTRES = [
  { valeur: "", label: "Tous" },
  { valeur: "vendeur", label: "Vendeurs" },
  { valeur: "acheteur", label: "Acheteurs" },
  { valeur: "transporteur", label: "Transporteurs" },
  { valeur: "broyeur", label: "Broyeurs" },
  { valeur: "a_verifier", label: "RCCM à vérifier" },
];

function ActionRccm({ u }: { u: Utilisateur }) {
  if (!u.rccm) return null;
  return u.rccm_verifie ? (
    <ActionButton
      action={verifierRccm}
      champs={{ id: u.id, verifie: "false" }}
      variant="ghost"
      confirmer={`Retirer la vérification de ${u.entreprise || u.nom} ?`}
    >
      Retirer
    </ActionButton>
  ) : (
    <ActionButton action={verifierRccm} champs={{ id: u.id, verifie: "true" }} variant="primary">
      Vérifier
    </ActionButton>
  );
}

function EtatRccm({ u }: { u: Utilisateur }) {
  if (u.rccm_verifie)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
        <IconShield size={14} weight="fill" /> Vérifié
      </span>
    );
  return <span className="text-xs font-medium text-coral">{u.rccm ? "À vérifier" : "Absent"}</span>;
}

function Initiale({ u }: { u: Utilisateur }) {
  return (
    <span className="font-wide grid size-9 shrink-0 place-items-center rounded-full bg-teal/10 text-sm text-teal">
      {(u.entreprise || u.nom || "?").charAt(0).toUpperCase()}
    </span>
  );
}

export function VueUtilisateurs({ tous, filtre, q }: { tous: Utilisateur[]; filtre: string; q: string }) {
  const liste = tous.filter(
    (u) =>
      (!filtre || (filtre === "a_verifier" ? !u.rccm_verifie && Boolean(u.rccm) : u.roles.includes(filtre))) &&
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
    <div className="rounded-2xl border border-line">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
        <form action="/admin/utilisateurs" className="relative w-full sm:w-80">
          {filtre && <input type="hidden" name="filtre" value={filtre} />}
          <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-subtle" />
          <label className="sr-only" htmlFor="q-utilisateurs">
            Rechercher un utilisateur
          </label>
          <input
            id="q-utilisateurs"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nom, entreprise, e-mail, RCCM…"
            className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-10 text-[15px] text-foreground placeholder:text-subtle focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none"
          />
        </form>
        <div className="scrollbar-none order-last flex w-full gap-1.5 overflow-x-auto">
          {FILTRES.map((f) => (
            <Link
              key={f.valeur}
              href={lien(f.valeur)}
              className={`flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm transition ${
                filtre === f.valeur ? "border-accent bg-mint/15 text-accent" : "border-line text-soft hover:border-teal"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-subtle sm:ml-auto">
          <span className="font-mono text-foreground">{liste.length}</span> compte{liste.length > 1 ? "s" : ""}
        </p>
      </div>

      {liste.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Aucun compte ne correspond" />
        </div>
      ) : (
        <>
          {/* Grand écran : tableau */}
          <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/60 text-xs text-subtle">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Compte</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Activités</th>
                <th scope="col" className="px-4 py-2.5 font-medium">RCCM</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Inscription</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Dernière connexion</th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {liste.map((u) => (
                <tr key={u.id} className="align-middle transition hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Initiale u={u} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {u.entreprise || u.nom || "Sans nom"}
                          {u.is_admin && <span className="ml-2 text-xs font-normal text-teal">Admin</span>}
                        </p>
                        <p className="truncate text-xs text-subtle">
                          {u.nom} · {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length ? u.roles.map((r) => <Pill key={r}>{ROLE_LABELS[r] ?? r}</Pill>) : <span className="text-subtle">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-foreground">{u.rccm || "—"}</p>
                    <EtatRccm u={u} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-soft">{dateCourte(u.inscrit_le)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-soft">
                    {u.derniere_connexion ? depuis(u.derniere_connexion) : <span className="text-subtle">Jamais</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ActionRccm u={u} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile : cartes */}
          <ul className="divide-y divide-line lg:hidden">
            {liste.map((u) => (
              <li key={u.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Initiale u={u} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{u.entreprise || u.nom || "Sans nom"}</p>
                    <p className="truncate text-xs text-subtle">{u.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <Pill key={r}>{ROLE_LABELS[r] ?? r}</Pill>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-foreground">{u.rccm || "Pas de RCCM"}</p>
                    <EtatRccm u={u} />
                  </div>
                  <ActionRccm u={u} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
