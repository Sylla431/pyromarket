-- Localisation au Mali : régions à la place des départements français,
-- RCCM (Registre du commerce et du crédit mobilier) à la place du SIRET.
-- Réexécutable : chaque renommage vérifie l'état actuel de la colonne.

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'annonces' and column_name = 'departement') then
    alter table public.annonces rename column departement to region;
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'profils_broyeur' and column_name = 'departement') then
    alter table public.profils_broyeur rename column departement to region;
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'profils_transporteur' and column_name = 'departements') then
    alter table public.profils_transporteur rename column departements to regions;
  end if;

  -- Les droits de mise à jour par colonne suivent la colonne renommée.
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'profiles' and column_name = 'siret') then
    alter table public.profiles rename column siret to rccm;
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'profiles' and column_name = 'siret_verifie') then
    alter table public.profiles rename column siret_verifie to rccm_verifie;
  end if;
end;
$$;

comment on column public.annonces.region is 'Région du Mali (code, ex. bamako, sikasso)';
comment on column public.profiles.rccm is 'Numéro RCCM, ex. MA.BKO.2021.B.4817';

-- Le profil créé à l'inscription lit désormais le RCCM.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nom, entreprise, rccm, roles, zone_activite, agrement)
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
    new.raw_user_meta_data ->> 'agrement'
  );
  return new;
end;
$$;
