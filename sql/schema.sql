-- ============================================================
-- Sportivement.io — Schéma de base de données Supabase
-- À exécuter dans : SQL Editor de ton projet Supabase
-- ============================================================

-- 1) TABLE PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  sports text[] default '{}',
  level text,
  city text,
  latitude float,
  longitude float,
  created_at timestamp with time zone default now()
);

-- 2) TABLE MESSAGES
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_messages_pair
  on messages (sender_id, receiver_id, created_at desc);

-- 3) ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table messages enable row level security;

-- Profiles : tout le monde (connecté) peut lire ; on ne peut éditer que le sien
drop policy if exists "Profiles visibles par tous les utilisateurs connectés" on profiles;
create policy "Profiles visibles par tous les utilisateurs connectés"
  on profiles for select
  to authenticated
  using (true);

drop policy if exists "Créer son propre profil" on profiles;
create policy "Créer son propre profil"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Mettre à jour son propre profil" on profiles;
create policy "Mettre à jour son propre profil"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- Messages : on ne peut lire/envoyer que ses propres conversations
drop policy if exists "Voir mes messages" on messages;
create policy "Voir mes messages"
  on messages for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Envoyer un message" on messages;
create policy "Envoyer un message"
  on messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- 4) REALTIME : activer la diffusion sur messages
-- (à exécuter une seule fois)
alter publication supabase_realtime add table messages;
