"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Field, Select } from "@/components/field";
import { Toggle } from "@/components/demo-actions";
import { IconBell } from "@/components/icons";
import { Card } from "@/components/ui";
import { mockAlertes } from "@/lib/mock-data";
import { DEPARTEMENTS, RESINES, resine } from "@/lib/resines";

export function Alertes() {
  const [alertes, setAlertes] = useState(mockAlertes);
  const [ouvert, setOuvert] = useState(false);

  function creer(formData: FormData) {
    const r = Number(formData.get("resine"));
    const d = String(formData.get("dep") ?? "");
    const dep = DEPARTEMENTS.find((x) => x.code === d);
    setAlertes((a) => [
      {
        id: crypto.randomUUID(),
        libelle: `${r ? resine(r).sigle : "Toutes résines"} · ${dep ? dep.nom : "Toute la région"}`,
        detail: "Toutes quantités",
        active: true,
      },
      ...a,
    ]);
    setOuvert(false);
  }

  return (
    <div className="space-y-4">
      {ouvert ? (
        <Card className="p-4">
          <form action={creer} className="space-y-4">
            <Field label="Résine">
              <Select name="resine" defaultValue="">
                <option value="">Toutes résines</option>
                {RESINES.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.code} · {r.sigle}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Département">
              <Select name="dep" defaultValue="">
                <option value="">Toute la région</option>
                {DEPARTEMENTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} · {d.nom}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Créer l&apos;alerte
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOuvert(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Button onClick={() => setOuvert(true)} className="w-full">
          <IconBell size={20} /> Nouvelle alerte
        </Button>
      )}

      <ul className="space-y-2">
        {alertes.map((a) => (
          <li key={a.id}>
            <Card className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{a.libelle}</p>
                <p className="text-sm text-muted">{a.detail}</p>
              </div>
              <Toggle defaultOn={a.active} label={`Activer l'alerte ${a.libelle}`} />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
