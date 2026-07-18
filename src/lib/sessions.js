import { supabase } from './supabase'

/**
 * Récupère les sessions ouvertes ou pleines, futures ou aujourd'hui.
 * Inclut les infos du créateur + le nombre de participants.
 */
export async function fetchOpenSessions() {
  const nowIso = new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3h de tolérance
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      creator:profiles!sessions_creator_id_fkey(id, username, full_name, avatar_url, gender, sports),
      participants:session_participants(user_id)
    `)
    .in('status', ['open', 'full'])
    .gte('session_at', nowIso)
    .order('session_at', { ascending: true })

  if (error) console.warn('fetchOpenSessions', error)
  return data || []
}

/** Sessions créées par un utilisateur */
export async function fetchMySessions(userId) {
  const { data } = await supabase
    .from('sessions')
    .select('*, participants:session_participants(user_id)')
    .eq('creator_id', userId)
    .order('session_at', { ascending: true })
  return data || []
}

/** Sessions auxquelles je participe */
export async function fetchJoinedSessions(userId) {
  const { data } = await supabase
    .from('session_participants')
    .select(`
      session:sessions(*, creator:profiles!sessions_creator_id_fkey(id, username, full_name, avatar_url))
    `)
    .eq('user_id', userId)
  return (data || []).map(row => row.session).filter(Boolean)
}

/** Créer une session */
export async function createSession(payload) {
  const { data, error } = await supabase
    .from('sessions')
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

/** Rejoindre une session */
export async function joinSession(sessionId, userId) {
  const { error } = await supabase
    .from('session_participants')
    .insert({ session_id: sessionId, user_id: userId })
  if (error && error.code === '23505') return { ok: true, already: true }
  return { ok: !error, error }
}

/** Quitter une session */
export async function leaveSession(sessionId, userId) {
  const { error } = await supabase
    .from('session_participants')
    .delete()
    .eq('session_id', sessionId)
    .eq('user_id', userId)
  return { ok: !error, error }
}

/** Supprimer une session (créateur uniquement) */
export async function deleteSession(sessionId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)
  return { ok: !error, error }
}

/**
 * Compte le nombre TOTAL de personnes présentes à une session
 * (créateur + participants).
 */
export function countAttendees(session) {
  return 1 + (session?.participants?.length || 0)
}

/** Est-ce que je participe déjà ? */
export function amIJoined(session, userId) {
  if (!userId) return false
  if (session.creator_id === userId) return true
  return (session.participants || []).some(p => p.user_id === userId)
}
