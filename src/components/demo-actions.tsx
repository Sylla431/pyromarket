"use client";

import { useState } from "react";
import { buttonClass } from "./button";

type Choix = { label: string; fait: string; variant?: "primary" | "secondary" | "danger" | "ghost" };

// Boutons dont l'effet reste local (données de démonstration).
export function DemoActions({ choix, className = "" }: { choix: Choix[]; className?: string }) {
  const [fait, setFait] = useState<string | null>(null);

  if (fait) {
    return (
      <p role="status" className="text-sm font-medium text-mint">
        {fait}
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {choix.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => setFait(c.fait)}
          className={buttonClass(c.variant ?? "secondary", "sm")}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ defaultOn, label }: { defaultOn: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn(!on)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition ${on ? "bg-mint" : "bg-line"}`}
    >
      <span className={`absolute top-1 size-6 rounded-full bg-ink transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}
