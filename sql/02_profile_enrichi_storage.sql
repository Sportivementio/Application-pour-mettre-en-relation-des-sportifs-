-- ============================================================
-- 02 — Profile enrichi + Supabase Storage pour les avatars
-- À exécuter dans : SQL Editor de Supabase
-- ============================================================

-- 1) Ajouter les nouveaux champs au profil
alter table profiles add column if not exists age int;
alter table profiles add column if not exists gender text;          -- 'H' | 'F' | 'X'
alter table profiles add column if not exists years_practice int;
alter table profiles add column if not exists weight numeric;       -- en kg
alter table profiles add column if not exists goals text[] default '{}';

-- 2) Bucket "avatars" public en read (les URLs sont publiques pour l'affichage)
--    À créer également via l'UI : Storage > New bucket > "avatars" > public
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 3) Policies Storage — l'utilisateur ne peut écrire QUE dans son propre dossier (uid/...)
drop policy if exists "Avatars lisibles publiquement" on storage.objects;
create policy "Avatars lisibles publiquement"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "Avatars upload par l'utilisateur connecté" on storage.objects;
create policy "Avatars upload par l'utilisateur connecté"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatars update par le propriétaire" on storage.objects;
create policy "Avatars update par le propriétaire"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatars delete par le propriétaire" on storage.objects;
create policy "Avatars delete par le propriétaire"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
