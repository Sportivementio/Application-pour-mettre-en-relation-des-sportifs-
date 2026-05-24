-- ============================================================
-- 05 — Auto-création du profil pour utilisateurs OAuth (Google)
-- À exécuter dans : SQL Editor de Supabase
-- ============================================================
-- Sans ce trigger, un user s'inscrivant via Google n'aurait pas
-- de ligne dans `profiles` (à cause des RLS qui exigent auth.uid()
-- pendant l'insert manuel). Ce trigger crée la ligne automatiquement
-- avec les infos Google (full_name, avatar_url) quand dispo.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  -- Si un profil existe déjà (cas signup classique), ne rien faire
  if exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;

  -- Username de base : metadata 'username' OU 'name' nettoyé OU email prefix
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    lower(regexp_replace(
      coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
      '[^a-z0-9_]', '_', 'g'
    ))
  );

  -- Garantir l'unicité (ajoute 1, 2, 3… si déjà pris)
  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      final_username
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
