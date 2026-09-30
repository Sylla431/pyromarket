import type { ResineCode } from "./resines";

// Données de démonstration localisées au Mali — à remplacer par des requêtes
// Supabase (voir src/lib/supabase/ et supabase/migrations/). Entreprises et
// personnes fictives.

export type AnnonceMock = {
  id: string;
  sens: "vente" | "achat";
  resine: ResineCode;
  typePlastique: string;
  quantiteKg: number;
  qualite: string;
  prixXof: number | null;
  localisation: string;
  region: string;
  vendeur: string;
  vendeurVerifie: boolean;
  description: string;
  photos: number;
  publieLe: string;
  statut: "publiee" | "cloturee";
};

export type BroyeurMock = {
  id: string;
  entreprise: string;
  typeBroyeur: string;
  capaciteKgH: number;
  localisation: string;
  region: string;
  tarifXofKg: number;
  matieres: ResineCode[];
  disponible: boolean;
  description: string;
};

export type TransporteurMock = {
  id: string;
  entreprise: string;
  zone: string;
  regions: string[];
  remorque: string;
  capaciteM3: number;
  tonnageT: number;
  disponible: boolean;
};

export type CourseMock = {
  id: string;
  annonceId: string;
  trajet: string;
  transporteur: string;
  tonnageT: number;
  devisXof: number | null;
  date: string;
  statut: "en_attente" | "accepte" | "termine";
};

export type ConversationMock = {
  id: string;
  interlocuteur: string;
  role: string;
  sujet: string;
  apercu: string;
  date: string;
  nonLus: number;
  messages: {
    moi: boolean;
    texte: string;
    heure: string;
    devis?: { montantXof: number; trajet: string };
  }[];
};

export type NotificationMock = {
  id: string;
  type: "alerte" | "message" | "transport" | "moderation";
  titre: string;
  detail: string;
  date: string;
  href: string;
  lu: boolean;
};

export const mockAnnonces: AnnonceMock[] = [
  {
    id: "a1",
    sens: "vente",
    resine: 1,
    typePlastique: "Bouteilles d'eau PET en balles",
    quantiteKg: 6000,
    qualite: "Trié, sans bouchons",
    prixXof: 125000,
    localisation: "Sotuba, Bamako",
    region: "bamako",
    vendeur: "Recyclage Djoliba",
    vendeurVerifie: true,
    description:
      "Bouteilles d'eau et de jus collectées dans les communes I et II, pressées en balles de 250 kg et stockées sous hangar. Chargement au chariot possible sur place.",
    photos: 3,
    publieLe: "il y a 2 h",
    statut: "publiee",
  },
  {
    id: "a2",
    sens: "vente",
    resine: 4,
    typePlastique: "Sachets d'eau usagés",
    quantiteKg: 12000,
    qualite: "Lavés, séchés",
    prixXof: 70000,
    localisation: "Magnambougou, Bamako",
    region: "bamako",
    vendeur: "Coopérative Jigiya",
    vendeurVerifie: true,
    description:
      "Sachets d'eau en PEBD ramassés par les collectrices de la coopérative, lavés puis séchés. Environ 12 t disponibles chaque mois.",
    photos: 2,
    publieLe: "hier",
    statut: "publiee",
  },
  {
    id: "a3",
    sens: "vente",
    resine: 5,
    typePlastique: "Sacs de coton en polypropylène tissé",
    quantiteKg: 18000,
    qualite: "Trié, traces de fibres",
    prixXof: 90000,
    localisation: "Koutiala",
    region: "koutiala",
    vendeur: "Coton Recyclage Koutiala",
    vendeurVerifie: false,
    description:
      "Sacs de coton graine usagés après la campagne, en ballots. Quelques fibres de coton résiduelles.",
    photos: 4,
    publieLe: "il y a 3 j",
    statut: "publiee",
  },
  {
    id: "a4",
    sens: "achat",
    resine: 5,
    typePlastique: "PP broyé pour pyrolyse",
    quantiteKg: 40000,
    qualite: "Broyé < 30 mm, sec",
    prixXof: 150000,
    localisation: "Koulikoro",
    region: "koulikoro",
    vendeur: "Pyrolyse Koulikoro SA",
    vendeurVerifie: true,
    description:
      "Unité de pyrolyse cherche un approvisionnement mensuel régulier en PP broyé et sec. Contrat possible sur 12 mois, enlèvement à notre charge au-delà de 10 t.",
    photos: 0,
    publieLe: "il y a 5 h",
    statut: "publiee",
  },
  {
    id: "a5",
    sens: "vente",
    resine: 2,
    typePlastique: "Bidons et fûts PEHD broyés",
    quantiteKg: 9000,
    qualite: "Rincés, broyés",
    prixXof: 160000,
    localisation: "Zone industrielle, Ségou",
    region: "segou",
    vendeur: "Sahel Emballages",
    vendeurVerifie: true,
    description:
      "Bidons d'huile et fûts de 20 à 220 L, rincés et broyés en paillettes. Production régulière.",
    photos: 1,
    publieLe: "il y a 1 j",
    statut: "publiee",
  },
  {
    id: "a6",
    sens: "vente",
    resine: 7,
    typePlastique: "Chaises et bassines cassées",
    quantiteKg: 4500,
    qualite: "Non trié, PP et PE mélangés",
    prixXof: null,
    localisation: "Marché de Médine, Kayes",
    region: "kayes",
    vendeur: "Kayes Récup",
    vendeurVerifie: false,
    description:
      "Objets ménagers en plastique rigide récupérés auprès des revendeurs du marché. Prix à discuter selon le volume enlevé.",
    photos: 2,
    publieLe: "il y a 4 j",
    statut: "publiee",
  },
  {
    id: "a7",
    sens: "vente",
    resine: 6,
    typePlastique: "Pots de yaourt et barquettes PS",
    quantiteKg: 1500,
    qualite: "Compacté",
    prixXof: 55000,
    localisation: "Sévaré, Mopti",
    region: "mopti",
    vendeur: "Mopti Plast",
    vendeurVerifie: false,
    description: "Emballages alimentaires en polystyrène compactés en blocs.",
    photos: 2,
    publieLe: "il y a 6 j",
    statut: "publiee",
  },
  {
    id: "a8",
    sens: "vente",
    resine: 1,
    typePlastique: "Préformes et bouteilles PET",
    quantiteKg: 5000,
    qualite: "Trié",
    prixXof: 140000,
    localisation: "Kalaban Coura, Bamako",
    region: "bamako",
    vendeur: "Recyclage Djoliba",
    vendeurVerifie: true,
    description: "Rebuts de préformes et bouteilles en balles.",
    photos: 1,
    publieLe: "il y a 3 sem.",
    statut: "cloturee",
  },
];

export const mockBroyeurs: BroyeurMock[] = [
  {
    id: "b1",
    entreprise: "Atelier Broyage Sotuba",
    typeBroyeur: "Mono-rotor 22 kW",
    capaciteKgH: 400,
    localisation: "Sotuba, Bamako",
    region: "bamako",
    tarifXofKg: 20,
    matieres: [1, 2, 4, 5],
    disponible: true,
    description:
      "Broyage à façon dans notre atelier, grille de 20 à 40 mm. Délai habituel : une semaine.",
  },
  {
    id: "b2",
    entreprise: "Sikasso Plast Broyage",
    typeBroyeur: "Bi-arbre industriel",
    capaciteKgH: 900,
    localisation: "Zone industrielle, Sikasso",
    region: "sikasso",
    tarifXofKg: 18,
    matieres: [2, 5, 7],
    disponible: true,
    description:
      "Broyeur bi-arbre pour pièces volumineuses et sacs tissés. Broyeur mobile possible sur votre site dans les régions de Sikasso et Koutiala.",
  },
  {
    id: "b3",
    entreprise: "Ségou Granulés",
    typeBroyeur: "Granulateur 30 kW",
    capaciteKgH: 500,
    localisation: "Pélengana, Ségou",
    region: "segou",
    tarifXofKg: 25,
    matieres: [1, 5, 6],
    disponible: false,
    description: "Granulation fine (8 à 12 mm), adaptée aux unités de pyrolyse.",
  },
];

export const mockTransporteurs: TransporteurMock[] = [
  {
    id: "t1",
    entreprise: "Trans-Niger Logistique",
    zone: "Bamako, Koulikoro, Ségou, Mopti",
    regions: ["bamako", "koulikoro", "segou", "mopti"],
    remorque: "Semi-remorque bâchée",
    capaciteM3: 80,
    tonnageT: 30,
    disponible: true,
  },
  {
    id: "t2",
    entreprise: "Transports Diallo & Fils",
    zone: "Bamako, Sikasso, Koutiala, Bougouni",
    regions: ["bamako", "sikasso", "koutiala", "bougouni"],
    remorque: "Camion benne",
    capaciteM3: 25,
    tonnageT: 15,
    disponible: true,
  },
  {
    id: "t3",
    entreprise: "Kayes Fret",
    zone: "Kayes, Kita, Nioro du Sahel",
    regions: ["kayes", "kita", "nioro"],
    remorque: "Camion à ridelles",
    capaciteM3: 40,
    tonnageT: 10,
    disponible: false,
  },
  {
    id: "t4",
    entreprise: "Katakatani Express",
    zone: "District de Bamako",
    regions: ["bamako"],
    remorque: "Tricycle cargo (katakatani)",
    capaciteM3: 3,
    tonnageT: 1,
    disponible: true,
  },
];

export const mockCourses: CourseMock[] = [
  {
    id: "c1",
    annonceId: "a1",
    trajet: "Sotuba → Koulikoro",
    transporteur: "Trans-Niger Logistique",
    tonnageT: 6,
    devisXof: 85000,
    date: "3 oct.",
    statut: "accepte",
  },
  {
    id: "c2",
    annonceId: "a3",
    trajet: "Koutiala → Koulikoro",
    transporteur: "Transports Diallo & Fils",
    tonnageT: 15,
    devisXof: null,
    date: "À planifier",
    statut: "en_attente",
  },
  {
    id: "c3",
    annonceId: "a8",
    trajet: "Kalaban Coura → Koulikoro",
    transporteur: "Trans-Niger Logistique",
    tonnageT: 5,
    devisXof: 70000,
    date: "12 sept.",
    statut: "termine",
  },
];

export const mockConversations: ConversationMock[] = [
  {
    id: "m1",
    interlocuteur: "Pyrolyse Koulikoro SA",
    role: "Acheteur",
    sujet: "Bouteilles d'eau PET en balles · 6 t",
    apercu: "On peut enlever les 6 t la semaine prochaine ?",
    date: "10:42",
    nonLus: 2,
    messages: [
      { moi: false, texte: "I ni sogoma ! Votre PET est-il encore disponible ?", heure: "09:58" },
      { moi: true, texte: "Oui, les 6 t sont disponibles, stockées sous hangar à Sotuba.", heure: "10:15" },
      { moi: false, texte: "Parfait. Les bouchons sont bien retirés ?", heure: "10:40" },
      { moi: false, texte: "On peut enlever les 6 t la semaine prochaine ?", heure: "10:42" },
    ],
  },
  {
    id: "m2",
    interlocuteur: "Trans-Niger Logistique",
    role: "Transporteur",
    sujet: "Transport · Sotuba → Koulikoro",
    apercu: "Devis envoyé : 85 000 F CFA",
    date: "hier",
    nonLus: 0,
    messages: [
      { moi: true, texte: "Bonjour, il faudrait enlever 6 t de PET à Sotuba pour Koulikoro.", heure: "14:02" },
      { moi: false, texte: "C'est possible jeudi matin, voici notre devis.", heure: "15:30" },
      {
        moi: false,
        texte: "Semi-remorque bâchée, chargement compris.",
        heure: "15:31",
        devis: { montantXof: 85000, trajet: "Sotuba → Koulikoro" },
      },
    ],
  },
  {
    id: "m3",
    interlocuteur: "Sikasso Plast Broyage",
    role: "Broyeur",
    sujet: "Broyage de sacs PP tissés",
    apercu: "Nous avons un créneau lundi.",
    date: "lun.",
    nonLus: 0,
    messages: [
      { moi: true, texte: "Pouvez-vous broyer 18 t de sacs de coton en PP tissé ?", heure: "08:20" },
      { moi: false, texte: "Nous avons un créneau lundi.", heure: "09:05" },
    ],
  },
];

export const mockNotifications: NotificationMock[] = [
  {
    id: "n1",
    type: "message",
    titre: "Nouveau message de Pyrolyse Koulikoro SA",
    detail: "On peut enlever les 6 t la semaine prochaine ?",
    date: "10:42",
    href: "/messages/m1",
    lu: false,
  },
  {
    id: "n2",
    type: "alerte",
    titre: "Nouvelle annonce PP à Koulikoro",
    detail: "PP broyé pour pyrolyse · 40 t · Koulikoro",
    date: "il y a 5 h",
    href: "/annonces/a4",
    lu: false,
  },
  {
    id: "n3",
    type: "transport",
    titre: "Devis reçu : 85 000 F CFA",
    detail: "Trans-Niger Logistique · Sotuba → Koulikoro",
    date: "hier",
    href: "/messages/m2",
    lu: true,
  },
  {
    id: "n4",
    type: "moderation",
    titre: "Votre RCCM est vérifié",
    detail: "Votre badge « Entreprise vérifiée » apparaît sur vos annonces.",
    date: "lun.",
    href: "/compte",
    lu: true,
  },
];

export const mockAlertes = [
  { id: "al1", libelle: "PP · Koulikoro", detail: "Toutes quantités", active: true },
  { id: "al2", libelle: "PET · Bamako, Ségou", detail: "À partir de 5 t", active: true },
  { id: "al3", libelle: "Autres plastiques", detail: "Moins de 60 000 F CFA/t", active: false },
];

export const mockModeration = [
  {
    id: "s1",
    cible: "Annonce",
    titre: "Pots de yaourt et barquettes PS · Mopti Plast",
    motif: "Photos sans rapport avec la matière",
    signalePar: "Pyrolyse Koulikoro SA",
    date: "il y a 1 h",
  },
  {
    id: "s2",
    cible: "Profil",
    titre: "Kayes Récup",
    motif: "Autorisation environnementale à vérifier",
    signalePar: "Vérification à l'inscription",
    date: "il y a 3 j",
  },
  {
    id: "s3",
    cible: "Annonce",
    titre: "Chaises et bassines cassées · Kayes Récup",
    motif: "Prix ou quantité incohérents",
    signalePar: "Recyclage Djoliba",
    date: "hier",
  },
];

// Compte affiché en mode démo (Supabase non configuré).
export const mockProfil = {
  nom: "Moussa Diarra",
  entreprise: "Recyclage Djoliba",
  rccm: "MA.BKO.2021.B.4817",
  zoneActivite: "District de Bamako, Koulikoro",
  roles: ["vendeur", "broyeur"] as string[],
  rccmVerifie: true,
  agrement: "En attente de vérification",
};
