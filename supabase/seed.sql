-- Données de démonstration localisées au Mali (entreprises fictives).
--
-- À exécuter dans l'éditeur SQL de Supabase (ou via `supabase db reset` en
-- local). Réexécutable : les identifiants sont fixes et les doublons ignorés.
--
-- Les comptes de démo n'ont pas de mot de passe (connexion impossible) et
-- utilisent le domaine réservé .invalid. Pour tout retirer :
--   delete from auth.users where email like '%@demo.pyromarket.invalid';
-- (profils, annonces, fiches broyeur et transporteur suivent en cascade)

-- 1. Comptes : le déclencheur handle_new_user crée le profil à partir des
--    métadonnées (nom, entreprise, rccm, roles, zone_activite).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  '00000000-0000-0000-0000-000000000000', u.id::uuid, 'authenticated', 'authenticated',
  u.email, '', now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  jsonb_build_object(
    'nom', u.nom, 'entreprise', u.entreprise, 'rccm', u.rccm,
    'roles', u.roles::jsonb, 'zone_activite', u.zone
  ),
  now(), now(), '', '', '', ''
from (values
  ('00000000-0000-4000-a000-000000000001', 'djoliba@demo.pyromarket.invalid',   'Moussa Diarra',     'Recyclage Djoliba',        'MA.BKO.2021.B.4817', '["vendeur"]',      'District de Bamako, Koulikoro'),
  ('00000000-0000-4000-a000-000000000002', 'jigiya@demo.pyromarket.invalid',    'Fatoumata Coulibaly','Coopérative Jigiya',      'MA.BKO.2019.B.0932', '["vendeur"]',      'District de Bamako'),
  ('00000000-0000-4000-a000-000000000003', 'koutiala@demo.pyromarket.invalid',  'Bakary Dembélé',    'Coton Recyclage Koutiala', 'MA.KTL.2022.B.0118', '["vendeur"]',      'Koutiala, Sikasso'),
  ('00000000-0000-4000-a000-000000000004', 'pyrolyse@demo.pyromarket.invalid',  'Awa Keïta',         'Pyrolyse Koulikoro SA',    'MA.KKR.2023.B.0045', '["acheteur"]',     'Koulikoro'),
  ('00000000-0000-4000-a000-000000000005', 'sahel@demo.pyromarket.invalid',     'Ibrahim Touré',     'Sahel Emballages',         'MA.SGO.2020.B.0317', '["vendeur"]',      'Ségou'),
  ('00000000-0000-4000-a000-000000000006', 'kayes@demo.pyromarket.invalid',     'Seydou Sissoko',    'Kayes Récup',              'MA.KYS.2024.A.0071', '["vendeur"]',      'Kayes'),
  ('00000000-0000-4000-a000-000000000007', 'mopti@demo.pyromarket.invalid',     'Hamadoun Cissé',    'Mopti Plast',              'MA.MPT.2023.A.0029', '["vendeur"]',      'Mopti'),
  ('00000000-0000-4000-a000-000000000008', 'sotuba@demo.pyromarket.invalid',    'Oumar Sangaré',     'Atelier Broyage Sotuba',   'MA.BKO.2018.B.2290', '["broyeur"]',      'District de Bamako'),
  ('00000000-0000-4000-a000-000000000009', 'sikasso@demo.pyromarket.invalid',   'Mariam Traoré',     'Sikasso Plast Broyage',    'MA.SKO.2021.B.0406', '["broyeur"]',      'Sikasso, Koutiala'),
  ('00000000-0000-4000-a000-000000000010', 'segou@demo.pyromarket.invalid',     'Adama Konaté',      'Ségou Granulés',           'MA.SGO.2022.B.0188', '["broyeur"]',      'Ségou'),
  ('00000000-0000-4000-a000-000000000011', 'transniger@demo.pyromarket.invalid','Souleymane Maïga',  'Trans-Niger Logistique',   'MA.BKO.2017.B.3051', '["transporteur"]', 'Bamako, Koulikoro, Ségou, Mopti'),
  ('00000000-0000-4000-a000-000000000012', 'diallo@demo.pyromarket.invalid',    'Mamadou Diallo',    'Transports Diallo & Fils', 'MA.BKO.2016.B.1874', '["transporteur"]', 'Bamako, Sikasso, Koutiala, Bougouni'),
  ('00000000-0000-4000-a000-000000000013', 'kayesfret@demo.pyromarket.invalid', 'Boubacar Camara',   'Kayes Fret',               'MA.KYS.2020.B.0233', '["transporteur"]', 'Kayes, Kita, Nioro du Sahel'),
  ('00000000-0000-4000-a000-000000000014', 'katakatani@demo.pyromarket.invalid','Drissa Kanté',      'Katakatani Express',       'MA.BKO.2024.A.5520', '["transporteur"]', 'District de Bamako')
) as u(id, email, nom, entreprise, rccm, roles, zone)
on conflict (id) do nothing;

-- 2. Entreprises dont le RCCM a été vérifié (badge « Entreprise vérifiée »).
update public.profiles set rccm_verifie = true
where id in (
  '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000002',
  '00000000-0000-4000-a000-000000000004', '00000000-0000-4000-a000-000000000005',
  '00000000-0000-4000-a000-000000000008', '00000000-0000-4000-a000-000000000009',
  '00000000-0000-4000-a000-000000000011', '00000000-0000-4000-a000-000000000012'
);

-- 3. Annonces (prix en F CFA par tonne ; dates relatives à l'exécution).
insert into public.annonces (
  id, vendeur_id, sens, resine, type_plastique, quantite_kg, qualite, prix_xof,
  localisation, region, description, statut, created_at
) values
  ('00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'vente', 1,
   'Bouteilles d''eau PET en balles', 6000, 'Trié, sans bouchons', 125000, 'Sotuba, Bamako', 'bamako',
   'Bouteilles d''eau et de jus collectées dans les communes I et II, pressées en balles de 250 kg et stockées sous hangar. Chargement au chariot possible sur place.',
   'publiee', now() - interval '2 hours'),
  ('00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000002', 'vente', 4,
   'Sachets d''eau usagés', 12000, 'Lavés, séchés', 70000, 'Magnambougou, Bamako', 'bamako',
   'Sachets d''eau en PEBD ramassés par les collectrices de la coopérative, lavés puis séchés. Environ 12 t disponibles chaque mois.',
   'publiee', now() - interval '1 day'),
  ('00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000003', 'vente', 5,
   'Sacs de coton en polypropylène tissé', 18000, 'Trié, traces de fibres', 90000, 'Koutiala', 'koutiala',
   'Sacs de coton graine usagés après la campagne, en ballots. Quelques fibres de coton résiduelles.',
   'publiee', now() - interval '3 days'),
  ('00000000-0000-4000-b000-000000000004', '00000000-0000-4000-a000-000000000004', 'achat', 5,
   'PP broyé pour pyrolyse', 40000, 'Broyé < 30 mm, sec', 150000, 'Koulikoro', 'koulikoro',
   'Unité de pyrolyse cherche un approvisionnement mensuel régulier en PP broyé et sec. Contrat possible sur 12 mois, enlèvement à notre charge au-delà de 10 t.',
   'publiee', now() - interval '5 hours'),
  ('00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000005', 'vente', 2,
   'Bidons et fûts PEHD broyés', 9000, 'Rincés, broyés', 160000, 'Zone industrielle, Ségou', 'segou',
   'Bidons d''huile et fûts de 20 à 220 L, rincés et broyés en paillettes. Production régulière.',
   'publiee', now() - interval '1 day 4 hours'),
  ('00000000-0000-4000-b000-000000000006', '00000000-0000-4000-a000-000000000006', 'vente', 7,
   'Chaises et bassines cassées', 4500, 'Non trié, PP et PE mélangés', null, 'Marché de Médine, Kayes', 'kayes',
   'Objets ménagers en plastique rigide récupérés auprès des revendeurs du marché. Prix à discuter selon le volume enlevé.',
   'publiee', now() - interval '4 days'),
  ('00000000-0000-4000-b000-000000000007', '00000000-0000-4000-a000-000000000007', 'vente', 6,
   'Pots de yaourt et barquettes PS', 1500, 'Compacté', 55000, 'Sévaré, Mopti', 'mopti',
   'Emballages alimentaires en polystyrène compactés en blocs.',
   'publiee', now() - interval '6 days'),
  ('00000000-0000-4000-b000-000000000008', '00000000-0000-4000-a000-000000000001', 'vente', 1,
   'Préformes et bouteilles PET', 5000, 'Trié', 140000, 'Kalaban Coura, Bamako', 'bamako',
   'Rebuts de préformes et bouteilles en balles.',
   'cloturee', now() - interval '3 weeks')
on conflict (id) do nothing;

-- 4. Annuaire des broyeurs (tarif en F CFA par kg).
insert into public.profils_broyeur (
  id, user_id, entreprise, type_broyeur, capacite_kg_h, localisation, region,
  tarif_indicatif, matieres, disponible, description
) values
  ('00000000-0000-4000-c000-000000000001', '00000000-0000-4000-a000-000000000008', 'Atelier Broyage Sotuba',
   'Mono-rotor 22 kW', 400, 'Sotuba, Bamako', 'bamako', 20, '{1,2,4,5}', true,
   'Broyage à façon dans notre atelier, grille de 20 à 40 mm. Délai habituel : une semaine.'),
  ('00000000-0000-4000-c000-000000000002', '00000000-0000-4000-a000-000000000009', 'Sikasso Plast Broyage',
   'Bi-arbre industriel', 900, 'Zone industrielle, Sikasso', 'sikasso', 18, '{2,5,7}', true,
   'Broyeur bi-arbre pour pièces volumineuses et sacs tissés. Broyeur mobile possible sur votre site dans les régions de Sikasso et Koutiala.'),
  ('00000000-0000-4000-c000-000000000003', '00000000-0000-4000-a000-000000000010', 'Ségou Granulés',
   'Granulateur 30 kW', 500, 'Pélengana, Ségou', 'segou', 25, '{1,5,6}', false,
   'Granulation fine (8 à 12 mm), adaptée aux unités de pyrolyse.')
on conflict (id) do nothing;

-- 5. Transporteurs (codes de région : voir src/lib/resines.ts).
insert into public.profils_transporteur (
  id, user_id, regions, type_remorque, capacite_m3, tonnage_t, disponible
) values
  ('00000000-0000-4000-d000-000000000001', '00000000-0000-4000-a000-000000000011',
   '{bamako,koulikoro,segou,mopti}', 'Semi-remorque bâchée', 80, 30, true),
  ('00000000-0000-4000-d000-000000000002', '00000000-0000-4000-a000-000000000012',
   '{bamako,sikasso,koutiala,bougouni}', 'Camion benne', 25, 15, true),
  ('00000000-0000-4000-d000-000000000003', '00000000-0000-4000-a000-000000000013',
   '{kayes,kita,nioro}', 'Camion à ridelles', 40, 10, false),
  ('00000000-0000-4000-d000-000000000004', '00000000-0000-4000-a000-000000000014',
   '{bamako}', 'Tricycle cargo (katakatani)', 3, 1, true)
on conflict (id) do nothing;
