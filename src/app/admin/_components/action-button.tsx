"use client";

import { useFormStatus } from "react-dom";
import { buttonClass } from "@/components/button";

type Variant = "primary" | "secondary" | "danger" | "ghost";

function Bouton({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, "sm")}>
      {pending ? "…" : children}
    </button>
  );
}

// Petit formulaire d'action : champs cachés + bouton, avec état d'envoi.
export function ActionButton({
  action,
  champs,
  variant = "secondary",
  confirmer,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  champs: Record<string, string>;
  variant?: Variant;
  confirmer?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirmer && !window.confirm(confirmer)) e.preventDefault();
      }}
    >
      {Object.entries(champs).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <Bouton variant={variant}>{children}</Bouton>
    </form>
  );
}
