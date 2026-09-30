"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NON_CONFIGURE, field, supabaseConfigure } from "@/lib/supabase/session";
import { connexionSchema, inscriptionSchema } from "@/lib/validation";

export type AuthState = { error?: string; info?: string };

export async function connexion(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = connexionSchema.safeParse({
    email: field(formData, "email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (!supabaseConfigure()) return { error: NON_CONFIGURE };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "E-mail ou mot de passe incorrect." };

  redirect("/compte");
}

export async function inscription(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = inscriptionSchema.safeParse({
    email: field(formData, "email"),
    password: formData.get("password"),
    nom: field(formData, "nom"),
    entreprise: field(formData, "entreprise"),
    siret: field(formData, "siret") ?? "",
    zone_activite: field(formData, "zone_activite"),
    agrement: field(formData, "agrement"),
    roles: formData.getAll("roles"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (!supabaseConfigure()) return { error: NON_CONFIGURE };

  const { email, password, ...profil } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: profil },
  });
  if (error) return { error: "Inscription impossible. Cet e-mail est peut-être déjà utilisé." };

  if (!data.session) {
    return { info: `Compte créé. Confirmez votre adresse via le lien envoyé à ${email}.` };
  }
  redirect("/compte");
}

export async function deconnexion() {
  if (supabaseConfigure()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/connexion");
}
