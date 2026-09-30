import type { ResineCode } from "./resines";

// Données de démonstration — à remplacer par des requêtes Supabase
// (voir src/lib/supabase/ et supabase/migrations/).

export type AnnonceMock = {
  id: string;
  sens: "vente" | "achat";
  resine: ResineCode;
  typePlastique: string;
  quantiteKg: number;
  qualite: string;
  prixXof: number | null;
  localisation: string;
  departement: string;
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
  departement: string;
  tarifXofKg: number;
  matieres: ResineCode[];
  disponible: boolean;
  description: string;
};

export type TransporteurMock = {
  id: string;
  entreprise: string;
  zone: string;
  departements: string[];
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
    typePlastique: "Bouteilles PET broyées",
    quantiteKg: 8000,
    qualite: "Trié, humidité < 2 %",
    prixXof: 210000,
    localisation: "Lyon",
    departement: "69",
    vendeur: "Recyclage Rhône",
    vendeurVerifie: true,
    description:
      "Paillettes PET claires et colorées mélangées, stockées sous abri. Enlèvement possible par lots de 2 t, chargement au chariot sur place.",
    photos: 3,
    publieLe: "il y a 2 h",
    statut: "publiee",
  },
  {
    id: "a2",
    sens: "vente",
    resine: 2,
    typePlastique: "Rebuts d'injection PEHD",
    quantiteKg: 15000,
    qualite: "Non trié",
    prixXof: 138000,
    localisation: "Saint-Étienne",
    departement: "42",
    vendeur: "Plastalp Industrie",
    vendeurVerifie: true,
    description:
      "Carottes et pièces non conformes issues de notre ligne d'injection. Production régulière d'environ 15 t par mois.",
    photos: 2,
    publieLe: "hier",
    statut: "publiee",
  },
  {
    id: "a3",
    sens: "vente",
    resine: 4,
    typePlastique: "Films agricoles PEBD",
    quantiteKg: 5000,
    qualite: "Trié, lavé",
    prixXof: 118000,
    localisation: "Valence",
    departement: "26",
    vendeur: "AgriPlast",
    vendeurVerifie: false,
    description:
      "Films de serre en balles de 400 kg, lavés à l'eau. Traces de terre résiduelles possibles.",
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
    qualite: "Broyé < 30 mm",
    prixXof: 164000,
    localisation: "Roussillon",
    departement: "38",
    vendeur: "Pyrolyse Isère",
    vendeurVerifie: true,
    description:
      "Unité de pyrolyse cherche un approvisionnement mensuel régulier en PP broyé. Contrat possible sur 12 mois.",
    photos: 0,
    publieLe: "il y a 5 h",
    statut: "publiee",
  },
  {
    id: "a5",
    sens: "vente",
    resine: 7,
    typePlastique: "Mélange ABS / PC (DEEE)",
    quantiteKg: 3200,
    qualite: "Broyé, métaux retirés",
    prixXof: null,
    localisation: "Clermont-Ferrand",
    departement: "63",
    vendeur: "Auvergne DEEE",
    vendeurVerifie: true,
    description:
      "Coques de petits appareils électroménagers, broyées et déferraillées. Prix à discuter selon volume enlevé.",
    photos: 1,
    publieLe: "il y a 1 j",
    statut: "publiee",
  },
  {
    id: "a6",
    sens: "vente",
    resine: 6,
    typePlastique: "Chutes de PS expansé",
    quantiteKg: 1200,
    qualite: "Compacté en briques",
    prixXof: 59000,
    localisation: "Annecy",
    departement: "74",
    vendeur: "Emballages Léman",
    vendeurVerifie: false,
    description: "Briques de PSE compacté, propres, issues de calage d'emballage.",
    photos: 2,
    publieLe: "il y a 4 j",
    statut: "publiee",
  },
  {
    id: "a7",
    sens: "vente",
    resine: 1,
    typePlastique: "Barquettes PET",
    quantiteKg: 6000,
    qualite: "Trié",
    prixXof: 157000,
    localisation: "Villefranche-sur-Saône",
    departement: "69",
    vendeur: "Recyclage Rhône",
    vendeurVerifie: true,
    description: "Barquettes alimentaires en balles.",
    photos: 1,
    publieLe: "il y a 3 sem.",
    statut: "cloturee",
  },
];

export const mockBroyeurs: BroyeurMock[] = [
  {
    id: "b1",
    entreprise: "Broyage Rhône",
    typeBroyeur: "Mono-arbre 30 kW",
    capaciteKgH: 600,
    localisation: "Villeurbanne",
    departement: "69",
    tarifXofKg: 26,
    matieres: [1, 2, 4, 5],
    disponible: true,
    description:
      "Broyage à façon sur notre site, grille de 20 à 40 mm. Délai habituel : une semaine.",
  },
  {
    id: "b2",
    entreprise: "Grenoble Broyage",
    typeBroyeur: "Bi-arbre industriel",
    capaciteKgH: 1200,
    localisation: "Grenoble",
    departement: "38",
    tarifXofKg: 23,
    matieres: [2, 3, 5, 7],
    disponible: true,
    description:
      "Broyeur bi-arbre pour pièces volumineuses et rebuts rigides. Possibilité de broyeur mobile sur votre site.",
  },
  {
    id: "b3",
    entreprise: "Forez Recyclage",
    typeBroyeur: "Granulateur 45 kW",
    capaciteKgH: 800,
    localisation: "Montbrison",
    departement: "42",
    tarifXofKg: 33,
    matieres: [1, 5, 6],
    disponible: false,
    description: "Granulation fine (8 à 12 mm), adaptée aux unités de pyrolyse.",
  },
];

export const mockTransporteurs: TransporteurMock[] = [
  {
    id: "t1",
    entreprise: "Transports Dauphiné",
    zone: "Isère, Rhône, Drôme",
    departements: ["38", "69", "26"],
    remorque: "Fond mouvant 90 m³",
    capaciteM3: 90,
    tonnageT: 24,
    disponible: true,
  },
  {
    id: "t2",
    entreprise: "Loire Benne Services",
    zone: "Loire, Haute-Loire, Rhône",
    departements: ["42", "43", "69"],
    remorque: "Benne 30 m³",
    capaciteM3: 30,
    tonnageT: 12,
    disponible: true,
  },
  {
    id: "t3",
    entreprise: "Alpes Fret",
    zone: "Savoie, Haute-Savoie, Ain",
    departements: ["73", "74", "01"],
    remorque: "Plateau bâché",
    capaciteM3: 80,
    tonnageT: 20,
    disponible: false,
  },
];

export const mockCourses: CourseMock[] = [
  {
    id: "c1",
    annonceId: "a1",
    trajet: "Lyon → Roussillon",
    transporteur: "Transports Dauphiné",
    tonnageT: 8,
    devisXof: 275000,
    date: "3 oct.",
    statut: "accepte",
  },
  {
    id: "c2",
    annonceId: "a2",
    trajet: "Saint-Étienne → Roussillon",
    transporteur: "Loire Benne Services",
    tonnageT: 12,
    devisXof: null,
    date: "À planifier",
    statut: "en_attente",
  },
  {
    id: "c3",
    annonceId: "a7",
    trajet: "Villefranche → Roussillon",
    transporteur: "Transports Dauphiné",
    tonnageT: 6,
    devisXof: 203000,
    date: "12 sept.",
    statut: "termine",
  },
];

export const mockConversations: ConversationMock[] = [
  {
    id: "m1",
    interlocuteur: "Pyrolyse Isère",
    role: "Acheteur",
    sujet: "Bouteilles PET broyées · 8 t",
    apercu: "On peut enlever les 8 t la semaine prochaine ?",
    date: "10:42",
    nonLus: 2,
    messages: [
      { moi: false, texte: "Bonjour, votre PET est-il encore disponible ?", heure: "09:58" },
      { moi: true, texte: "Oui, les 8 t sont disponibles, stockées sous abri.", heure: "10:15" },
      { moi: false, texte: "Parfait. Quel taux d'humidité mesurez-vous ?", heure: "10:40" },
      { moi: false, texte: "On peut enlever les 8 t la semaine prochaine ?", heure: "10:42" },
    ],
  },
  {
    id: "m2",
    interlocuteur: "Transports Dauphiné",
    role: "Transporteur",
    sujet: "Transport · Lyon → Roussillon",
    apercu: "Devis envoyé : 275 000 F CFA",
    date: "hier",
    nonLus: 0,
    messages: [
      { moi: true, texte: "Bonjour, il faudrait enlever 8 t de PET à Lyon pour Roussillon.", heure: "14:02" },
      { moi: false, texte: "C'est possible jeudi, voici notre devis.", heure: "15:30" },
      {
        moi: false,
        texte: "Fond mouvant 90 m³, chargement compris.",
        heure: "15:31",
        devis: { montantXof: 275000, trajet: "Lyon → Roussillon" },
      },
    ],
  },
  {
    id: "m3",
    interlocuteur: "Grenoble Broyage",
    role: "Broyeur",
    sujet: "Broyage de rebuts PEHD",
    apercu: "Nous avons un créneau lundi.",
    date: "lun.",
    nonLus: 0,
    messages: [
      { moi: true, texte: "Pouvez-vous broyer 15 t de PEHD rigide ?", heure: "08:20" },
      { moi: false, texte: "Nous avons un créneau lundi.", heure: "09:05" },
    ],
  },
];

export const mockNotifications: NotificationMock[] = [
  {
    id: "n1",
    type: "message",
    titre: "Nouveau message de Pyrolyse Isère",
    detail: "On peut enlever les 8 t la semaine prochaine ?",
    date: "10:42",
    href: "/messages/m1",
    lu: false,
  },
  {
    id: "n2",
    type: "alerte",
    titre: "Nouvelle annonce PP dans l'Isère",
    detail: "PP broyé pour pyrolyse · 40 t · Roussillon",
    date: "il y a 5 h",
    href: "/annonces/a4",
    lu: false,
  },
  {
    id: "n3",
    type: "transport",
    titre: "Devis reçu : 275 000 F CFA",
    detail: "Transports Dauphiné · Lyon → Roussillon",
    date: "hier",
    href: "/messages/m2",
    lu: true,
  },
  {
    id: "n4",
    type: "moderation",
    titre: "Votre SIRET est vérifié",
    detail: "Votre badge « Entreprise vérifiée » apparaît sur vos annonces.",
    date: "lun.",
    href: "/compte",
    lu: true,
  },
];

export const mockAlertes = [
  { id: "al1", libelle: "PP · Isère", detail: "Toutes quantités", active: true },
  { id: "al2", libelle: "PET · Rhône, Loire", detail: "À partir de 5 t", active: true },
  { id: "al3", libelle: "Autres plastiques", detail: "Moins de 130 000 F CFA/t", active: false },
];

export const mockModeration = [
  {
    id: "s1",
    cible: "Annonce",
    titre: "Chutes de PS expansé · Emballages Léman",
    motif: "Photos sans rapport avec la matière",
    signalePar: "Pyrolyse Isère",
    date: "il y a 1 h",
  },
  {
    id: "s2",
    cible: "Profil",
    titre: "AgriPlast",
    motif: "Agrément préfectoral à vérifier",
    signalePar: "Vérification à l'inscription",
    date: "il y a 3 j",
  },
  {
    id: "s3",
    cible: "Annonce",
    titre: "Mélange ABS / PC (DEEE) · Auvergne DEEE",
    motif: "Prix ou quantité incohérents",
    signalePar: "Recyclage Rhône",
    date: "hier",
  },
];

// Compte affiché en mode démo (Supabase non configuré).
export const mockProfil = {
  nom: "Camille Martin",
  entreprise: "Recyclage Rhône",
  siret: "852 147 963 00018",
  zoneActivite: "Rhône, Loire",
  roles: ["vendeur", "broyeur"] as string[],
  siretVerifie: true,
  agrement: "En attente de vérification",
};
