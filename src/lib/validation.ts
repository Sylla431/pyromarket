import { z } from "zod";
import { REGION_CODES } from "./resines";

const region = z
  .string()
  .refine((v) => REGION_CODES.includes(v), "Choisissez une région");

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined);

export const annonceSchema = z.object({
  sens: z.enum(["vente", "achat"]),
  resine: z.coerce.number().int().min(1, "Choisissez une résine").max(7),
  typePlastique: z.string().trim().min(2, "Décrivez la matière en quelques mots"),
  quantiteKg: z.coerce.number().int().positive("Indiquez une quantité supérieure à 0"),
  qualite: optionalText,
  prixXof: z.coerce.number().int("Le prix en F CFA est un nombre entier").nonnegative("Le prix ne peut pas être négatif").optional(),
  localisation: z.string().trim().min(2, "Indiquez la ville"),
  region,
  description: optionalText,
});

export type AnnonceInput = z.infer<typeof annonceSchema>;

export const inscriptionSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  nom: z.string().trim().min(2, "Indiquez votre nom"),
  entreprise: z.string().trim().min(2, "Indiquez le nom de votre entreprise"),
  // Registre du commerce et du crédit mobilier, ex. MA.BKO.2021.B.4817
  rccm: z
    .string()
    .transform((v) => v.replace(/\s/g, "").toUpperCase())
    .pipe(
      z
        .string()
        .regex(/^MA\.[A-Z]{3}\.\d{4}\.[A-Z]\.\d{1,6}$/, "Format RCCM attendu : MA.BKO.2021.B.4817"),
    ),
  zone_activite: optionalText,
  agrement: optionalText,
  roles: z
    .array(z.enum(["vendeur", "transporteur", "broyeur", "acheteur"]))
    .min(1, "Choisissez au moins une activité"),
});

export const connexionSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Saisissez votre mot de passe"),
});

export const profilBroyeurSchema = z.object({
  entreprise: z.string().trim().min(2, "Indiquez le nom affiché"),
  type_broyeur: z.string().trim().min(2, "Indiquez le type de broyeur"),
  capacite_kg_h: z.coerce.number().int().positive("Capacité invalide").optional(),
  localisation: z.string().trim().min(2, "Indiquez la ville"),
  region,
  tarif_indicatif: z.coerce.number().int("Le tarif en F CFA est un nombre entier").nonnegative().optional(),
  matieres: z.array(z.coerce.number().int().min(1).max(7)).min(1, "Choisissez au moins une matière"),
  disponible: z.boolean(),
  description: optionalText,
});

export const profilTransporteurSchema = z.object({
  regions: z.array(region).min(1, "Choisissez au moins une région"),
  type_remorque: z.string().trim().min(2, "Indiquez le type de remorque"),
  capacite_m3: z.coerce.number().int().positive("Volume invalide").optional(),
  tonnage_t: z.coerce.number().positive("Tonnage invalide").optional(),
  disponible: z.boolean(),
});

export const signalementSchema = z.object({
  cible_type: z.enum(["annonce", "profil"]),
  cible_id: z.string().min(1),
  motif: z.string().min(1, "Choisissez un motif"),
  detail: optionalText,
});
