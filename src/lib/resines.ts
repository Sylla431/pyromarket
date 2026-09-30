// Codes d'identification des résines (triangle de recyclage), utilisés par
// toute la filière pour désigner la matière.
export const RESINES = [
  { code: 1, sigle: "PET", nom: "Polyéthylène téréphtalate" },
  { code: 2, sigle: "PEHD", nom: "Polyéthylène haute densité" },
  { code: 3, sigle: "PVC", nom: "Polychlorure de vinyle" },
  { code: 4, sigle: "PEBD", nom: "Polyéthylène basse densité" },
  { code: 5, sigle: "PP", nom: "Polypropylène" },
  { code: 6, sigle: "PS", nom: "Polystyrène" },
  { code: 7, sigle: "Autres", nom: "Mélanges, ABS, PC, PA…" },
] as const;

export type ResineCode = (typeof RESINES)[number]["code"];

export function resine(code: number) {
  return RESINES.find((r) => r.code === code) ?? RESINES[6];
}

// Lancement au Mali : les 19 régions et le district de Bamako (réforme 2023).
export const REGIONS = [
  { code: "bamako", nom: "District de Bamako" },
  { code: "bandiagara", nom: "Bandiagara" },
  { code: "bougouni", nom: "Bougouni" },
  { code: "dioila", nom: "Dioïla" },
  { code: "douentza", nom: "Douentza" },
  { code: "gao", nom: "Gao" },
  { code: "kayes", nom: "Kayes" },
  { code: "kidal", nom: "Kidal" },
  { code: "kita", nom: "Kita" },
  { code: "koulikoro", nom: "Koulikoro" },
  { code: "koutiala", nom: "Koutiala" },
  { code: "menaka", nom: "Ménaka" },
  { code: "mopti", nom: "Mopti" },
  { code: "nara", nom: "Nara" },
  { code: "nioro", nom: "Nioro du Sahel" },
  { code: "san", nom: "San" },
  { code: "segou", nom: "Ségou" },
  { code: "sikasso", nom: "Sikasso" },
  { code: "taoudenit", nom: "Taoudénit" },
  { code: "tombouctou", nom: "Tombouctou" },
] as const;

export const REGION_CODES = REGIONS.map((r) => r.code) as string[];

export function regionNom(code: string) {
  return REGIONS.find((r) => r.code === code)?.nom ?? code;
}

export function formatKg(kg: number) {
  return kg >= 1000
    ? `${(kg / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} t`
    : `${kg.toLocaleString("fr-FR")} kg`;
}

const xof = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

// Montant en francs CFA (XOF), sans décimales : « 210 000 F CFA ».
export function formatXof(montant: number) {
  return xof.format(montant);
}
