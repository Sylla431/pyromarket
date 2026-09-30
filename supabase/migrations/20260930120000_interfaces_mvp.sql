-- Champs nécessaires aux écrans du MVP (cahier des charges).
-- Réexécutable : chaque instruction vérifie si l'objet existe déjà.

do $$
begin
  create type public.annonce_sens as enum ('vente', 'achat');
exception when duplicate_object then null;
end;
$$;

alter table public.annonces
  add column if not exists sens        public.annonce_sens not null default 'vente',
  add column if not exists resine      smallint check (resine between 1 and 7),
  add column if not exists departement text,
  add column if not exists description text;

create index if not exists annonces_filtres_idx
  on public.annonces (statut, sens, resine, departement);

-- Agrément préfectoral (vendeurs de déchets) et suivi des vérifications.
alter table public.profiles
  add column if not exists agrement      text,
  add column if not exists siret_verifie boolean not null default false;

-- Matières traitées par un broyeur (codes résine).
alter table public.profils_broyeur
  add column if not exists entreprise  text,
  add column if not exists departement text,
  add column if not exists matieres    smallint[] not null default '{}',
  add column if not exists description text;

-- Profil transporteur (module Transport).
create table if not exists public.profils_transporteur (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references public.profiles (id) on delete cascade,
  departements    text[] not null default '{}',
  type_remorque   text not null,
  capacite_m3     integer check (capacite_m3 > 0),
  tonnage_t       numeric(6, 1) check (tonnage_t > 0),
  disponible      boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.profils_transporteur enable row level security;

drop policy if exists "profils_transporteur_select" on public.profils_transporteur;
create policy "profils_transporteur_select" on public.profils_transporteur
  for select to anon, authenticated using (true);
drop policy if exists "profils_transporteur_insert_own" on public.profils_transporteur;
create policy "profils_transporteur_insert_own" on public.profils_transporteur
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "profils_transporteur_update_own" on public.profils_transporteur;
create policy "profils_transporteur_update_own" on public.profils_transporteur
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "profils_transporteur_delete_own" on public.profils_transporteur;
create policy "profils_transporteur_delete_own" on public.profils_transporteur
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Un utilisateur ne peut pas se déclarer lui-même vérifié : seules ces
-- colonnes restent modifiables depuis l'application.
revoke update on public.profiles from anon, authenticated;
grant update (nom, entreprise, siret, roles, zone_activite, agrement)
  on public.profiles to authenticated;

-- Reprend l'agrément saisi à l'inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nom, entreprise, siret, roles, zone_activite, agrement)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    new.raw_user_meta_data ->> 'entreprise',
    new.raw_user_meta_data ->> 'siret',
    coalesce(
      (select array_agg(r::public.role)
         from jsonb_array_elements_text(new.raw_user_meta_data -> 'roles') as r),
      '{}'
    ),
    new.raw_user_meta_data ->> 'zone_activite',
    new.raw_user_meta_data ->> 'agrement'
  );
  return new;
end;
$$;

-- Signalements (bouton « Signaler » sur les annonces et profils).
do $$
begin
  create type public.signalement_statut as enum ('a_traiter', 'valide', 'suspendu', 'complement_demande');
exception when duplicate_object then null;
end;
$$;

create table if not exists public.signalements (
  id         uuid primary key default gen_random_uuid(),
  auteur_id  uuid not null references public.profiles (id) on delete cascade,
  cible_type text not null check (cible_type in ('annonce', 'profil')),
  cible_id   text not null,
  motif      text not null,
  detail     text,
  statut     public.signalement_statut not null default 'a_traiter',
  created_at timestamptz not null default now()
);

alter table public.signalements enable row level security;

-- Chacun peut signaler et relire ses propres signalements ; le traitement se
-- fait côté modération (clé secrète, hors RLS).
drop policy if exists "signalements_insert_own" on public.signalements;
create policy "signalements_insert_own" on public.signalements
  for insert to authenticated
  with check ((select auth.uid()) = auteur_id and statut = 'a_traiter');
drop policy if exists "signalements_select_own" on public.signalements;
create policy "signalements_select_own" on public.signalements
  for select to authenticated using ((select auth.uid()) = auteur_id);
