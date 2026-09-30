import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-foreground placeholder:text-subtle focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-soft">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-subtle">{hint}</span>}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%234f6b72%22 stroke-width=%221.8%22 fill=%22none%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={4}
      {...props}
      className={`${inputClass} h-auto py-3 ${props.className ?? ""}`}
    />
  );
}

// Case ou bouton radio affiché comme une puce sélectionnable.
export function ChoiceChip({
  type = "checkbox",
  name,
  value,
  defaultChecked,
  children,
}: {
  type?: "checkbox" | "radio";
  name: string;
  value: string;
  defaultChecked?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-soft transition peer-checked:border-accent peer-checked:bg-mint/10 peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
        {children}
      </span>
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral"
    >
      {message}
    </p>
  );
}
