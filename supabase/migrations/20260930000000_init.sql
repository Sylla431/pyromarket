-- Schéma initial PyroMarket (reprise du modèle de données du cahier des charges).
-- Les utilisateurs sont gérés par Supabase Auth ; `profiles` porte les
-- informations métier et est créé automatiquement à l'inscription.

create type public.role as enum ('vendeur', 'transporteur', 'broyeur', 'acheteur');
create type public.annonce_statut as enum ('publiee', 'en_moderation', 'suspendue', 'cloturee');
create type public.transport_statut as enum ('en_attente', 'accepte', 'termine');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profils -------------------------------------------------------------------

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  nom           text not null default '',
  entreprise    text,
  siret         text,
  roles         public.role[] not null default '{}',
  zone_activite text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crée le profil à l'inscription à partir des métadonnées passées à signUp().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nom, entreprise, siret, roles, zone_activite)
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
    new.raw_user_meta_data ->> 'zone_activite'
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Annonces ------------------------------------------------------------------

create table public.annonces (
  id             uuid primary key default gen_random_uuid(),
  vendeur_id     uuid not null references public.profiles (id) on delete cascade,
  type_plastique text not null,
  quantite_kg    integer not null check (quantite_kg > 0),
  qualite        text,
  prix_euro      numeric(12, 2) check (prix_euro >= 0),
  localisation   text not null,
  photos         text[] not null default '{}',
  statut         public.annonce_statut not null default 'publiee',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index annonces_vendeur_id_idx on public.annonces (vendeur_id);
create index annonces_statut_idx on public.annonces (statut);

create trigger annonces_updated_at before update on public.annonces
  for each row execute function public.set_updated_at();

-- Profils broyeur -----------------------------------------------------------

create table public.profils_broyeur (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references public.profiles (id) on delete cascade,
  type_broyeur    text not null,
  capacite_kg_h   integer check (capacite_kg_h > 0),
  localisation    text not null,
  tarif_indicatif numeric(12, 2) check (tarif_indicatif >= 0),
  disponible      boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Demandes de transport -----------------------------------------------------

create table public.demandes_transport (
  id              uuid primary key default gen_random_uuid(),
  annonce_id      uuid not null references public.annonces (id) on delete cascade,
  transporteur_id uuid references public.profiles (id) on delete set null,
  zone_depart     text,
  zone_arrivee    text,
  tonnage         integer check (tonnage > 0),
  statut          public.transport_statut not null default 'en_attente',
  created_at      timestamptz not null default now()
);

create index demandes_transport_annonce_id_idx on public.demandes_transport (annonce_id);
create index demandes_transport_transporteur_id_idx on public.demandes_transport (transporteur_id);

-- Messages ------------------------------------------------------------------

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  annonce_id uuid references public.annonces (id) on delete cascade,
  auteur_id  uuid not null references public.profiles (id) on delete cascade,
  contenu    text not null check (length(contenu) > 0),
  created_at timestamptz not null default now()
);

create index messages_annonce_id_idx on public.messages (annonce_id);
create index messages_auteur_id_idx on public.messages (auteur_id);

-- Row Level Security --------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.annonces enable row level security;
alter table public.profils_broyeur enable row level security;
alter table public.demandes_transport enable row level security;
alter table public.messages enable row level security;

-- Profils : lisibles par tous (nom d'entreprise affiché sur les annonces),
-- modifiables uniquement par leur propriétaire.
create policy "profiles_select" on public.profiles
  for select to anon, authenticated using (true);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Annonces : les annonces publiées sont publiques ; le vendeur voit et gère
-- toutes les siennes. Publication immédiate, modération a posteriori.
create policy "annonces_select" on public.annonces
  for select to anon, authenticated
  using (statut = 'publiee' or (select auth.uid()) = vendeur_id);
create policy "annonces_insert_own" on public.annonces
  for insert to authenticated
  with check ((select auth.uid()) = vendeur_id and statut = 'publiee');
create policy "annonces_update_own" on public.annonces
  for update to authenticated
  using ((select auth.uid()) = vendeur_id)
  with check ((select auth.uid()) = vendeur_id and statut in ('publiee', 'cloturee'));
create policy "annonces_delete_own" on public.annonces
  for delete to authenticated using ((select auth.uid()) = vendeur_id);

-- Annuaire des broyeurs : public, géré par le propriétaire.
create policy "profils_broyeur_select" on public.profils_broyeur
  for select to anon, authenticated using (true);
create policy "profils_broyeur_insert_own" on public.profils_broyeur
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profils_broyeur_update_own" on public.profils_broyeur
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "profils_broyeur_delete_own" on public.profils_broyeur
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Demandes de transport : visibles par le vendeur de l'annonce et le
-- transporteur ; créées par le vendeur, mises à jour par l'un ou l'autre.
create policy "demandes_transport_select" on public.demandes_transport
  for select to authenticated
  using (
    (select auth.uid()) = transporteur_id
    or exists (
      select 1 from public.annonces a
      where a.id = annonce_id and a.vendeur_id = (select auth.uid())
    )
  );
create policy "demandes_transport_insert" on public.demandes_transport
  for insert to authenticated
  with check (
    exists (
      select 1 from public.annonces a
      where a.id = annonce_id and a.vendeur_id = (select auth.uid())
    )
  );
create policy "demandes_transport_update" on public.demandes_transport
  for update to authenticated
  using (
    (select auth.uid()) = transporteur_id
    or exists (
      select 1 from public.annonces a
      where a.id = annonce_id and a.vendeur_id = (select auth.uid())
    )
  );

-- Messages : visibles par leur auteur et par le vendeur de l'annonce.
create policy "messages_select" on public.messages
  for select to authenticated
  using (
    (select auth.uid()) = auteur_id
    or exists (
      select 1 from public.annonces a
      where a.id = annonce_id and a.vendeur_id = (select auth.uid())
    )
  );
create policy "messages_insert_own" on public.messages
  for insert to authenticated with check ((select auth.uid()) = auteur_id);
