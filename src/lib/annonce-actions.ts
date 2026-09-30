"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserId, supabaseConfigure } from "@/lib/supabase/session";

// Clôture une annonce du vendeur connecté (la RLS n'autorise que ses annonces).
export async function cloturerAnnonce(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !supabaseConfigure()) return;

  const userId = await getUserId();
  if (!userId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("annonces")
    .update({ statut: "cloturee" })
    .eq("id", id)
    .eq("vendeur_id", userId);
  if (error) throw new Error("La clôture a échoué. Réessayez dans un instant.");

  revalidatePath("/compte/annonces");
  revalidatePath("/annonces");
  revalidatePath("/");
}
