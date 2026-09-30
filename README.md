# PyroMarket

Le marché du plastique pour l'industrie de la pyrolyse : annonces de
plastique (toutes catégories), mise en relation avec des transporteurs, et
annuaire des possesseurs de broyeurs. Web app responsive, installable sur
Android et iOS (PWA).

Voir le [cahier des charges](https://claude.ai/code/artifact/0df25591-b08f-44cb-8f6e-dc81888dd3a6)
pour le contexte, les personas et la roadmap complète.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) : Postgres, Auth (et bientôt Storage)
- PWA : `src/app/manifest.ts`, `src/app/icon.tsx`, `public/sw.js`

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # renseigner l'URL et la clé publishable Supabase
npx supabase link            # relier le projet Supabase
npx supabase db push         # applique supabase/migrations/
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Sans Supabase configuré, les pages `/annonces` et `/broyeurs`
s'affichent avec des données de démonstration
(`src/lib/mock-data.ts`) et la publication d'annonce affiche un message
d'erreur explicite plutôt que d'échouer silencieusement.

## État du MVP

- [x] Structure Next.js + Tailwind + PWA installable
- [x] Schéma de données (`supabase/migrations/`, avec RLS) : utilisateurs, annonces,
      profils broyeur, demandes de transport, messages
- [x] Page d'accueil, liste et création d'annonces, annuaire des broyeurs
- [ ] Authentification Supabase Auth (clients et proxy prêts, écrans de connexion / inscription à faire)
- [ ] Mise en relation transport (demande liée à une annonce)
- [ ] Messagerie
- [ ] Modération / vérification des annonces
