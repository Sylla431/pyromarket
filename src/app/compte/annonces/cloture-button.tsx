"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/button";
import { cloturerAnnonce } from "@/lib/annonce-actions";

function Confirmer() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Clôture…" : "Oui, clôturer"}
    </Button>
  );
}

// Clôture en deux temps : une annonce clôturée ne peut pas être rouverte.
export function ClotureButton({ id }: { id: string }) {
  const [confirmer, setConfirmer] = useState(false);

  if (!confirmer) {
    return (
      <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmer(true)}>
        Clôturer la vente
      </Button>
    );
  }

  return (
    <form action={cloturerAnnonce} className="flex flex-wrap items-center justify-end gap-2">
      <input type="hidden" name="id" value={id} />
      <span className="text-sm text-soft">L&apos;annonce quittera le marché.</span>
      <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmer(false)}>
        Annuler
      </Button>
      <Confirmer />
    </form>
  );
}
