import { FormError } from "./field";

export function FormStatus({ state }: { state: { error?: string; ok?: string } }) {
  if (state.ok) {
    return (
      <p role="status" className="rounded-xl border border-accent/40 bg-mint/10 px-4 py-3 text-sm text-accent">
        {state.ok}
      </p>
    );
  }
  return <FormError message={state.error} />;
}
