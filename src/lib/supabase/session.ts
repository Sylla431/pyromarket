import { createClient } from "./server";

export function supabaseConfigure() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

// Identifiant de l'utilisateur connecté, ou null.
export async function getUserId() {
  if (!supabaseConfigure()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims.sub ?? null;
}

// Transforme un champ vide en undefined avant validation.
export function field(formData: FormData, name: string) {
  const v = formData.get(name);
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

export const NON_CONFIGURE =
  "Mode démo : Supabase n'est pas encore configuré, rien n'a été enregistré.";
