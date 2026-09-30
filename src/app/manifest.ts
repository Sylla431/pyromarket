import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PyroMarket",
    short_name: "PyroMarket",
    description:
      "Le marché du plastique pour l'industrie de la pyrolyse : annonces, transport et annuaire des broyeurs.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    lang: "fr",
    dir: "ltr",
    categories: ["business", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Publier une annonce",
        short_name: "Publier",
        url: "/annonces/nouvelle",
        icons: [{ src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Marché du plastique",
        short_name: "Marché",
        url: "/annonces",
        icons: [{ src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Messages",
        url: "/messages",
        icons: [{ src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" }],
      },
    ],
    screenshots: [
      {
        src: "/screenshots/accueil.png",
        sizes: "750x1500",
        type: "image/png",
        form_factor: "narrow",
        label: "Choisir une résine pour voir les volumes disponibles",
      },
      {
        src: "/screenshots/marche.png",
        sizes: "750x1500",
        type: "image/png",
        form_factor: "narrow",
        label: "Les annonces de plastique avec filtres",
      },
      {
        src: "/screenshots/annonce.png",
        sizes: "750x1500",
        type: "image/png",
        form_factor: "narrow",
        label: "Le détail d'une annonce et le contact vendeur",
      },
    ],
  };
}
