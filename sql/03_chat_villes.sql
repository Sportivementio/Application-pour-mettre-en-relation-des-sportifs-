-- ============================================================
-- 03 — Chat VILLES : salons publics par ville
-- À exécuter dans : SQL Editor de Supabase
-- ============================================================

-- 1) Table des messages publics par ville
create table if not exists city_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  city text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_city_messages_city
  on city_messages (city, created_at desc);

-- 2) RLS
alter table city_messages enable row level security;

drop policy if exists "Lire tous les messages de ville" on city_messages;
create policy "Lire tous les messages de ville"
  on city_messages for select
  to authenticated
  using (true);

drop policy if exists "Envoyer un message dans une ville" on city_messages;
create policy "Envoyer un message dans une ville"
  on city_messages for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Supprimer son propre message" on city_messages;
create policy "Supprimer son propre message"
  on city_messages for delete
  to authenticated
  using (auth.uid() = user_id);

-- 3) Realtime activé pour diffusion live
alter publication supabase_realtime add table city_messages;
