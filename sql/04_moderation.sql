-- ============================================================
-- 04 — Modération : signalements + utilisateurs bloqués
-- À exécuter dans : SQL Editor de Supabase
-- ============================================================

-- 1) Table des signalements (sur messages de ville)
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references profiles(id) on delete cascade not null,
  message_id uuid references city_messages(id) on delete cascade not null,
  reason text,
  created_at timestamp with time zone default now(),
  unique (reporter_id, message_id)
);

create index if not exists idx_reports_message on reports (message_id);

alter table reports enable row level security;

drop policy if exists "Lire ses propres signalements" on reports;
create policy "Lire ses propres signalements"
  on reports for select
  to authenticated
  using (auth.uid() = reporter_id);

drop policy if exists "Signaler un message" on reports;
create policy "Signaler un message"
  on reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

-- 2) Table des utilisateurs bloqués
create table if not exists blocked_users (
  blocker_id uuid references profiles(id) on delete cascade not null,
  blocked_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  primary key (blocker_id, blocked_id)
);

alter table blocked_users enable row level security;

drop policy if exists "Voir ses propres blocages" on blocked_users;
create policy "Voir ses propres blocages"
  on blocked_users for select
  to authenticated
  using (auth.uid() = blocker_id);

drop policy if exists "Bloquer un utilisateur" on blocked_users;
create policy "Bloquer un utilisateur"
  on blocked_users for insert
  to authenticated
  with check (auth.uid() = blocker_id);

drop policy if exists "Débloquer un utilisateur" on blocked_users;
create policy "Débloquer un utilisateur"
  on blocked_users for delete
  to authenticated
  using (auth.uid() = blocker_id);

-- 3) Vue : count des signalements par message (pratique pour requêter en 1 coup)
create or replace view city_messages_report_counts as
select
  message_id,
  count(*) as report_count
from reports
group by message_id;

-- 4) RPC pour récupérer les IDs de messages avec >= seuil signalements
create or replace function hidden_message_ids(threshold int default 3)
returns table (message_id uuid)
language sql
security definer
as $$
  select message_id from city_messages_report_counts where report_count >= threshold;
$$;
