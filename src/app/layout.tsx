import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import { BottomNav, TopBar } from "@/components/nav";

const hyperlegible = localFont({
  variable: "--font-hyperlegible",
  display: "swap",
  src: [
    { path: "../../public/fonts/webfonts/HyperlegibleSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/webfonts/HyperlegibleSans-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/webfonts/HyperlegibleSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/webfonts/HyperlegibleSans-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/webfonts/HyperlegibleSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/webfonts/HyperlegibleSans-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyroMarket — le marché du plastique pour la pyrolyse",
  description:
    "Mise en relation des vendeurs de plastique, transporteurs et possesseurs de broyeurs pour l'industrie de la pyrolyse.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PyroMarket",
  },
};

export const viewport: Viewport = {
  themeColor: "#021F28",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${hyperlegible.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <RegisterServiceWorker />
        <TopBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pt-8 md:pb-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
