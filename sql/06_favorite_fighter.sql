-- ============================================================
-- 06 — Champ "Combattant préféré" sur le profil
-- À exécuter dans : SQL Editor de Supabase
-- ============================================================

alter table profiles add column if not exists favorite_fighter text;
