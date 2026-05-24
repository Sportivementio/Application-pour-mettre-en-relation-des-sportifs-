import { supabase } from './supabase'

// Récupère la liste des IDs utilisateurs bloqués par moi
export async function fetchBlockedUserIds(userId) {
  if (!userId) return new Set()
  const { data, error } = await supabase
    .from('blocked_users')
    .select('blocked_id')
    .eq('blocker_id', userId)
  if (error) {
    console.warn('blocked_users fetch error', error)
    return new Set()
  }
  return new Set((data || []).map(r => r.blocked_id))
}

// Récupère la liste des IDs de messages cachés (≥ seuil signalements)
export async function fetchHiddenMessageIds(threshold = 3) {
  const { data, error } = await supabase
    .from('city_messages_report_counts')
    .select('message_id, report_count')
    .gte('report_count', threshold)
  if (error) {
    console.warn('hidden messages fetch error', error)
    return new Set()
  }
  return new Set((data || []).map(r => r.message_id))
}

// Signaler un message (gère le doublon proprement)
export async function reportMessage(reporterId, messageId, reason = null) {
  const { error } = await supabase
    .from('reports')
    .insert({ reporter_id: reporterId, message_id: messageId, reason })
  if (error && error.code === '23505') {
    // Déjà signalé : on ignore
    return { ok: true, already: true }
  }
  return { ok: !error, error }
}

// Supprimer son propre message de ville
export async function deleteCityMessage(messageId) {
  const { error } = await supabase
    .from('city_messages')
    .delete()
    .eq('id', messageId)
  return { ok: !error, error }
}

// Bloquer un utilisateur
export async function blockUser(blockerId, blockedId) {
  const { error } = await supabase
    .from('blocked_users')
    .insert({ blocker_id: blockerId, blocked_id: blockedId })
  if (error && error.code === '23505') {
    return { ok: true, already: true }
  }
  return { ok: !error, error }
}

// Débloquer
export async function unblockUser(blockerId, blockedId) {
  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
  return { ok: !error, error }
}

// Vérifier si un utilisateur est bloqué
export async function isBlocked(blockerId, blockedId) {
  const { data } = await supabase
    .from('blocked_users')
    .select('blocker_id')
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
    .maybeSingle()
  return !!data
}
