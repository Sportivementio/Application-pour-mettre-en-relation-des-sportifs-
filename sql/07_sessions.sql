-- ============================================================
-- 07 — Sessions d'entraînement (carte + création + participation)
-- À exécuter dans : SQL Editor de Supabase
-- ============================================================

-- 1) Table des sessions
create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  city text not null,
  latitude float not null,
  longitude float not null,
  location_details text,
  sport text not null,
  session_at timestamp with time zone not null,
  duration_minutes int default 60 not null,
  max_participants int default 4 not null check (max_participants between 2 and 20),
  equipment_provided boolean default false,
  equipment_details text,
  status text default 'open' not null check (status in ('open', 'full', 'closed', 'past')),
  created_at timestamp with time zone default now()
);

create index if not exists idx_sessions_city on sessions (city);
create index if not exists idx_sessions_sport on sessions (sport);
create index if not exists idx_sessions_status on sessions (status, session_at desc);

-- 2) Table des participants
create table if not exists session_participants (
  session_id uuid references sessions(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default now(),
  primary key (session_id, user_id)
);

create index if not exists idx_participants_user on session_participants (user_id);

-- 3) RLS sur sessions
alter table sessions enable row level security;

drop policy if exists "Lire toutes les sessions" on sessions;
create policy "Lire toutes les sessions"
  on sessions for select
  to authenticated
  using (true);

drop policy if exists "Créer sa propre session" on sessions;
create policy "Créer sa propre session"
  on sessions for insert
  to authenticated
  with check (auth.uid() = creator_id);

drop policy if exists "Modifier sa propre session" on sessions;
create policy "Modifier sa propre session"
  on sessions for update
  to authenticated
  using (auth.uid() = creator_id);

drop policy if exists "Supprimer sa propre session" on sessions;
create policy "Supprimer sa propre session"
  on sessions for delete
  to authenticated
  using (auth.uid() = creator_id);

-- 4) RLS sur participants
alter table session_participants enable row level security;

drop policy if exists "Voir les participants" on session_participants;
create policy "Voir les participants"
  on session_participants for select
  to authenticated
  using (true);

drop policy if exists "Rejoindre une session" on session_participants;
create policy "Rejoindre une session"
  on session_participants for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Quitter une session" on session_participants;
create policy "Quitter une session"
  on session_participants for delete
  to authenticated
  using (auth.uid() = user_id);

-- 5) Trigger : auto-clôture quand session pleine + auto-marquage past
create or replace function update_session_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  cur_count int;
  max_p int;
begin
  select count(*) into cur_count from session_participants where session_id = new.session_id;
  select max_participants into max_p from sessions where id = new.session_id;

  -- +1 car le créateur compte
  if cur_count + 1 >= max_p then
    update sessions set status = 'full' where id = new.session_id and status = 'open';
  end if;

  return new;
end;
$$;

drop trigger if exists on_participant_added on session_participants;
create trigger on_participant_added
  after insert on session_participants
  for each row execute procedure update_session_status();

-- Quand un participant quitte, on remet en 'open' si était 'full'
create or replace function on_participant_leave()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update sessions set status = 'open'
   where id = old.session_id and status = 'full';
  return old;
end;
$$;

drop trigger if exists on_participant_removed on session_participants;
create trigger on_participant_removed
  after delete on session_participants
  for each row execute procedure on_participant_leave();

-- 6) Realtime
alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table session_participants;
