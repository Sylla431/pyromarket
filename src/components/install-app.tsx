"use client";

import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { buttonClass } from "./button";
import { IconClose, IconPlus, IconShare } from "./icons";

// L'évènement d'installation de Chrome/Android (absent des types DOM).
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// Stocke l'évènement dès le chargement du module : il n'est émis qu'une fois
// par page et peut arriver avant le montage des composants.
let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function useDeferredPrompt() {
  return useSyncExternalStore(subscribe, () => deferred, () => null);
}

type Plateforme = "installee" | "ios" | "autre";

function detecter(): Plateforme {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "installee";
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "autre";
}

const CLE_MASQUE = "pyromarket:installation-masquee";
const DELAI_MS = 14 * 24 * 60 * 60 * 1000;

// Repli en mémoire si le stockage du navigateur est bloqué.
let masqueSession = false;

function masqueRecemment() {
  if (masqueSession) return true;
  try {
    const t = Number(localStorage.getItem(CLE_MASQUE));
    return Boolean(t) && Date.now() - t < DELAI_MS;
  } catch {
    return false;
  }
}

function InstructionsIos({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink/70 backdrop-blur-sm md:items-center md:justify-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="installer-ios-titre"
        className="w-full rounded-t-3xl border-t border-line bg-surface p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:max-w-sm md:rounded-3xl md:border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="installer-ios-titre" className="font-wide text-xl text-foreground">
          Installer sur iPhone
        </h2>
        <ol className="mt-5 space-y-4 text-soft">
          <li className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-teal font-mono text-xs text-teal">1</span>
            <span>
              Touchez <strong className="text-foreground">Partager</strong> <IconShare size={18} className="inline -mt-1" /> dans la barre de Safari.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-teal font-mono text-xs text-teal">2</span>
            <span>
              Choisissez <strong className="text-foreground">Sur l&apos;écran d&apos;accueil</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-teal font-mono text-xs text-teal">3</span>
            <span>
              Touchez <strong className="text-foreground">Ajouter</strong>. PyroMarket apparaît avec vos applications.
            </span>
          </li>
        </ol>
        <button type="button" onClick={onClose} className={buttonClass("primary", "md", "mt-6 w-full")}>
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}

// La plateforme ne change pas pendant la visite ; null pendant le rendu serveur.
const sansAbonnement = () => () => {};
function usePlateforme() {
  return useSyncExternalStore<Plateforme | null>(sansAbonnement, detecter, () => null);
}

// Bandeau proposé en bas de l'accueil, masquable 14 jours. Limité à
// l'accueil pour ne pas masquer les boutons d'action des autres pages.
export function InstallBanner() {
  const pathname = usePathname();
  const prompt = useDeferredPrompt();
  const plateforme = usePlateforme();
  const masque = useSyncExternalStore(subscribe, masqueRecemment, () => true);
  const [aide, setAide] = useState(false);

  const disponible =
    pathname === "/" && (plateforme === "ios" || (plateforme === "autre" && prompt !== null));
  if (!disponible || masque) return aide ? <InstructionsIos onClose={() => setAide(false)} /> : null;

  function fermer() {
    masqueSession = true;
    try {
      localStorage.setItem(CLE_MASQUE, String(Date.now()));
    } catch {}
    notify();
  }

  async function installer() {
    if (plateforme === "ios") return setAide(true);
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    deferred = null;
    notify();
  }

  return (
    <>
      <div className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 rounded-2xl border border-accent/40 bg-surface p-3 shadow-xl shadow-ink/10 md:inset-x-auto md:right-6 md:bottom-6 md:w-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-96.png" alt="" width={44} height={44} className="rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Installer PyroMarket</p>
          <p className="text-xs text-muted">Accès direct depuis l&apos;écran d&apos;accueil.</p>
        </div>
        <button type="button" onClick={installer} className={buttonClass("primary", "sm", "shrink-0")}>
          Installer
        </button>
        <button
          type="button"
          onClick={fermer}
          aria-label="Masquer"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-subtle hover:bg-line hover:text-foreground"
        >
          <IconClose size={18} />
        </button>
      </div>
      {aide && <InstructionsIos onClose={() => setAide(false)} />}
    </>
  );
}

// Entrée permanente dans l'espace compte, même si le bandeau a été masqué.
export function InstallButton() {
  const prompt = useDeferredPrompt();
  const plateforme = usePlateforme();
  const [aide, setAide] = useState(false);

  if (plateforme === null) return null;
  if (plateforme === "installee") {
    return <p className="text-sm text-teal">L&apos;application est installée sur cet appareil.</p>;
  }

  async function installer() {
    if (plateforme === "ios" || !prompt) return setAide(true);
    await prompt.prompt();
    await prompt.userChoice;
    deferred = null;
    notify();
  }

  return (
    <>
      <button type="button" onClick={installer} className={buttonClass("secondary", "md", "w-full")}>
        <IconPlus size={20} /> Installer l&apos;application
      </button>
      {aide && (plateforme === "ios" ? (
        <InstructionsIos onClose={() => setAide(false)} />
      ) : (
        <p className="mt-2 text-sm text-muted">
          Ouvrez le menu du navigateur (⋮) puis choisissez « Installer l&apos;application » ou
          « Ajouter à l&apos;écran d&apos;accueil ».
        </p>
      ))}
    </>
  );
}
