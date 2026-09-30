import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PyroMarket",
    short_name: "PyroMarket",
    description:
      "Le marché du plastique pour l'industrie de la pyrolyse : annonces, transport et annuaire des broyeurs.",
    start_url: "/",
    display: "standalone",
    background_color: "#021F28",
    theme_color: "#021F28",
    lang: "fr",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
  };
}
