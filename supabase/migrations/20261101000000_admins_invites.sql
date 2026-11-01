-- Administrateurs pré-inscrits : un e-mail ajouté ici devient administrateur
-- dès la création de son compte (ou tout de suite s'il existe déjà, voir
-- l'instruction « update » à exécuter à la main). Réexécutable.
--
-- Ne pas écrire d'e-mail réel dans ce fichier (dépôt public) : ajouter les
-- administrateurs depuis l'éditeur SQL de Supabase :
--   insert into public.admins_invites (email) values ('admin@exemple.com')
--   on conflict do nothing;

create table if not exists public.admins_invites (
  email      text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- RLS active sans aucune politique : table invisible depuis l'application.
alter table public.admins_invites enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nom, entreprise, rccm, roles, zone_activite, agrement, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    new.raw_user_meta_data ->> 'entreprise',
    new.raw_user_meta_data ->> 'rccm',
    coalesce(
      (select array_agg(r::public.role)
         from jsonb_array_elements_text(new.raw_user_meta_data -> 'roles') as r),
      '{}'
    ),
    new.raw_user_meta_data ->> 'zone_activite',
    new.raw_user_meta_data ->> 'agrement',
    exists (select 1 from public.admins_invites a where a.email = lower(new.email))
  );
  return new;
end;
$$;
