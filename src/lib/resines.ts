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

// Lancement régional : Auvergne-Rhône-Alpes.
export const DEPARTEMENTS = [
  { code: "01", nom: "Ain" },
  { code: "03", nom: "Allier" },
  { code: "07", nom: "Ardèche" },
  { code: "15", nom: "Cantal" },
  { code: "26", nom: "Drôme" },
  { code: "38", nom: "Isère" },
  { code: "42", nom: "Loire" },
  { code: "43", nom: "Haute-Loire" },
  { code: "63", nom: "Puy-de-Dôme" },
  { code: "69", nom: "Rhône" },
  { code: "73", nom: "Savoie" },
  { code: "74", nom: "Haute-Savoie" },
] as const;

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
