import Link from "next/link";
import { ButtonLink, buttonClass } from "@/components/button";
import { Select } from "@/components/field";
import { IconChat, IconTruck } from "@/components/icons";
import { ResinBadge } from "@/components/resin-badge";
import { Card, EmptyState, PageHeader, Pill, Segmented, Stat } from "@/components/ui";
import { mockAnnonces, mockCourses, mockTransporteurs, type CourseMock } from "@/lib/mock-data";
import { DEPARTEMENTS, formatKg, formatXof } from "@/lib/resines";

const STATUTS: Record<CourseMock["statut"], { label: string; tone: "coral" | "teal" | "mint" | "muted" }> = {
  en_attente: { label: "En attente", tone: "coral" },
  accepte: { label: "Acceptée", tone: "teal" },
  termine: { label: "Terminée", tone: "muted" },
};
const ETAPES: CourseMock["statut"][] = ["en_attente", "accepte", "termine"];

function str(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

export default async function TransportPage({ searchParams }: PageProps<"/transport">) {
  const params = await searchParams;
  const vue = str(params.vue) === "courses" ? "courses" : "transporteurs";
  const annonce = mockAnnonces.find((a) => a.id === str(params.annonce));
  const dep = str(params.dep) || annonce?.departement || "";

  const transporteurs = mockTransporteurs
    .filter((t) => !dep || t.departements.includes(dep))
    .sort((a, b) => Number(b.disponible) - Number(a.disponible));

  return (
    <div>
      <PageHeader title="Transport" subtitle="Des remorques pour acheminer vos volumes." />

      <Segmented
        items={[
          { href: "/transport", label: "Transporteurs", active: vue === "transporteurs" },
          {
            href: "/transport?vue=courses",
            label: "Mes courses",
            active: vue === "courses",
            count: mockCourses.filter((c) => c.statut !== "termine").length,
          },
        ]}
      />

      {vue === "transporteurs" ? (
        <>
          {annonce && (
            <Card className="mt-4 flex items-center gap-3 border-teal/50 p-4">
              <ResinBadge code={annonce.resine} size="sm" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="text-subtle">Transport pour</p>
                <p className="truncate font-medium text-foreground">
                  {annonce.typePlastique} · {formatKg(annonce.quantiteKg)} · {annonce.localisation}
                </p>
              </div>
            </Card>
          )}

          <form action="/transport" className="mt-4 flex gap-2">
            {annonce && <input type="hidden" name="annonce" value={annonce.id} />}
            <label className="flex-1">
              <span className="sr-only">Département de chargement</span>
              <Select name="dep" defaultValue={dep} className="mt-0">
                <option value="">Tous les départements</option>
                {DEPARTEMENTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    Chargement en {d.code} · {d.nom}
                  </option>
                ))}
              </Select>
            </label>
            <button type="submit" className={buttonClass("secondary")}>
              OK
            </button>
          </form>

          <ul className="mt-5 space-y-3">
            {transporteurs.map((t) => (
              <li key={t.id}>
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal/15 text-teal">
                      <IconTruck />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-medium text-foreground">{t.entreprise}</h2>
                        {t.disponible ? <Pill tone="mint">Disponible</Pill> : <Pill>Complet</Pill>}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">{t.zone}</p>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
                    <Stat label="Remorque" value={<span className="font-sans text-sm">{t.remorque.split(" ").slice(0, 2).join(" ")}</span>} />
                    <Stat label="Volume" value={`${t.capaciteM3} m³`} />
                    <Stat label="Charge" value={`${t.tonnageT} t`} />
                  </dl>
                  <ButtonLink
                    href={`/messages/nouveau?a=${encodeURIComponent(t.entreprise)}&sujet=${encodeURIComponent(
                      annonce ? `Transport · ${annonce.localisation} · ${formatKg(annonce.quantiteKg)}` : "Demande de devis transport",
                    )}`}
                    variant={t.disponible ? "primary" : "secondary"}
                    className="mt-4 w-full"
                  >
                    <IconChat size={20} /> Demander un devis
                  </ButtonLink>
                </Card>
              </li>
            ))}
            {transporteurs.length === 0 && (
              <EmptyState title="Aucun transporteur sur ce département">
                Élargissez la recherche à toute la région.
              </EmptyState>
            )}
          </ul>
        </>
      ) : (
        <ul className="mt-5 space-y-3">
          {mockCourses.map((c) => {
            const etape = ETAPES.indexOf(c.statut);
            return (
              <li key={c.id}>
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-medium text-foreground">{c.trajet}</h2>
                      <p className="text-sm text-muted">
                        {c.transporteur} · <span className="font-mono">{c.tonnageT} t</span>
                      </p>
                    </div>
                    <Pill tone={STATUTS[c.statut].tone}>{STATUTS[c.statut].label}</Pill>
                  </div>

                  <ol className="mt-4 grid grid-cols-3 gap-1.5" aria-label="Avancement">
                    {ETAPES.map((e, i) => (
                      <li key={e}>
                        <span className={`block h-1.5 rounded-full ${i <= etape ? "bg-teal" : "bg-line"}`} />
                        <span className={`mt-1.5 block text-[11px] ${i <= etape ? "text-soft" : "text-subtle"}`}>
                          {STATUTS[e].label}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                    <span className="text-subtle">
                      {c.devisXof !== null ? (
                        <>
                          Devis <span className="font-mono text-mint">{formatXof(c.devisXof)}</span>
                        </>
                      ) : (
                        "Devis en attente"
                      )}{" "}
                      · {c.date}
                    </span>
                    <Link href="/messages/m2" className="font-medium text-teal hover:underline">
                      Messages
                    </Link>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
