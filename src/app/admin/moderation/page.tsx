import { DemoActions } from "@/components/demo-actions";
import { Card, PageHeader, Pill } from "@/components/ui";
import { mockModeration } from "@/lib/mock-data";

export default function ModerationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        back="/compte"
        title="Modération"
        subtitle={`${mockModeration.length} éléments à traiter`}
      />
      <ul className="space-y-3">
        {mockModeration.map((s) => (
          <li key={s.id}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground">{s.titre}</p>
                <Pill tone={s.cible === "Annonce" ? "teal" : "coral"}>{s.cible}</Pill>
              </div>
              <p className="mt-2 text-sm text-soft">{s.motif}</p>
              <p className="mt-1 text-xs text-subtle">
                {s.signalePar} · {s.date}
              </p>
              <DemoActions
                className="mt-4 border-t border-line pt-4"
                choix={[
                  { label: "Valider", fait: "Validé", variant: "primary" },
                  { label: "Demander un complément", fait: "Complément demandé", variant: "secondary" },
                  { label: "Suspendre", fait: "Suspendu", variant: "danger" },
                ]}
              />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
