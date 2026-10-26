-- Tableau de bord d'administration : un rôle administrateur qui voit tout.
-- Réexécutable.
--
-- Pour nommer un administrateur (après qu'il a créé son compte) :
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'admin@exemple.com');

alter table public.profiles
  add column if not exists is_admin boolean not null default false;
-- is_admin ne fait pas partie des colonnes modifiables par l'application
-- (voir le « grant update (...) » de la migration interfaces_mvp) : un
-- utilisateur ne peut pas se nommer administrateur lui-même.

-- Vrai si l'utilisateur connecté est administrateur. security definer pour
-- lire profiles sans repasser par la RLS (évite une récursion de politiques).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

-- Lecture de tout pour l'administrateur (s'ajoute aux politiques existantes).
drop policy if exists "admin_select_annonces" on public.annonces;
create policy "admin_select_annonces" on public.annonces
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "admin_select_demandes_transport" on public.demandes_transport;
create policy "admin_select_demandes_transport" on public.demandes_transport
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "admin_select_messages" on public.messages;
create policy "admin_select_messages" on public.messages
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "admin_select_signalements" on public.signalements;
create policy "admin_select_signalements" on public.signalements
  for select to authenticated using ((select public.is_admin()));

-- Comptes avec e-mail et dernière connexion (auth.users n'est pas exposé).
create or replace function public.admin_utilisateurs()
returns table (
  id uuid,
  email text,
  nom text,
  entreprise text,
  rccm text,
  rccm_verifie boolean,
  roles public.role[],
  zone_activite text,
  agrement text,
  is_admin boolean,
  inscrit_le timestamptz,
  derniere_connexion timestamptz
)
language plpgsql
stable
security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;
  return query
    select p.id, u.email::text, p.nom, p.entreprise, p.rccm, p.rccm_verifie, p.roles,
           p.zone_activite, p.agrement, p.is_admin, u.created_at, u.last_sign_in_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by u.created_at desc;
end;
$$;

-- Actions de l'administrateur, contrôlées ici plutôt que par des droits de
-- mise à jour directs (qui laisseraient un utilisateur se vérifier lui-même).
create or replace function public.admin_verifier_rccm(profil_id uuid, verifie boolean)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;
  update public.profiles set rccm_verifie = verifie where id = profil_id;
end;
$$;

create or replace function public.admin_statut_annonce(annonce_id uuid, nouveau_statut public.annonce_statut)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;
  update public.annonces set statut = nouveau_statut where id = annonce_id;
end;
$$;

create or replace function public.admin_traiter_signalement(signalement_id uuid, nouveau_statut public.signalement_statut)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;
  update public.signalements set statut = nouveau_statut where id = signalement_id;
end;
$$;

revoke execute on function public.admin_utilisateurs() from public, anon;
revoke execute on function public.admin_verifier_rccm(uuid, boolean) from public, anon;
revoke execute on function public.admin_statut_annonce(uuid, public.annonce_statut) from public, anon;
revoke execute on function public.admin_traiter_signalement(uuid, public.signalement_statut) from public, anon;
grant execute on function public.admin_utilisateurs() to authenticated;
grant execute on function public.admin_verifier_rccm(uuid, boolean) to authenticated;
grant execute on function public.admin_statut_annonce(uuid, public.annonce_statut) to authenticated;
grant execute on function public.admin_traiter_signalement(uuid, public.signalement_statut) to authenticated;
