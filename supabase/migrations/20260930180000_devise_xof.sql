-- Passage de l'euro au franc CFA (XOF). Le franc CFA n'a pas de centimes :
-- montants entiers. Conversion au taux fixe 1 EUR = 655,957 XOF.

alter table public.annonces rename column prix_euro to prix_xof;
alter table public.annonces
  alter column prix_xof type numeric(14, 0) using round(prix_xof * 655.957);

-- Tarif indicatif des broyeurs, en XOF par kg.
alter table public.profils_broyeur
  alter column tarif_indicatif type numeric(10, 0) using round(tarif_indicatif * 655.957);

comment on column public.annonces.prix_xof is 'Prix en francs CFA (XOF) par tonne';
comment on column public.profils_broyeur.tarif_indicatif is 'Tarif indicatif en francs CFA (XOF) par kg';
