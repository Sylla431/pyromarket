-- Passage de l'euro au franc CFA (XOF). Le franc CFA n'a pas de centimes :
-- montants entiers. Conversion au taux fixe 1 EUR = 655,957 XOF.
-- Réexécutable : la conversion n'a lieu qu'une fois, tant que les montants
-- sont encore en euros.

do $$
begin
  -- Prix des annonces : la colonne prix_euro n'existe plus après conversion.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'annonces' and column_name = 'prix_euro'
  ) then
    alter table public.annonces rename column prix_euro to prix_xof;
    alter table public.annonces
      alter column prix_xof type numeric(14, 0) using round(prix_xof * 655.957);
  end if;

  -- Tarif des broyeurs : encore en euros tant qu'il garde 2 décimales.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profils_broyeur'
      and column_name = 'tarif_indicatif' and numeric_scale = 2
  ) then
    alter table public.profils_broyeur
      alter column tarif_indicatif type numeric(10, 0) using round(tarif_indicatif * 655.957);
  end if;
end;
$$;

comment on column public.annonces.prix_xof is 'Prix en francs CFA (XOF) par tonne';
comment on column public.profils_broyeur.tarif_indicatif is 'Tarif indicatif en francs CFA (XOF) par kg';
