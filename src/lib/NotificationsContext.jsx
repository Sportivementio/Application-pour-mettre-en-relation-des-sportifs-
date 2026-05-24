import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from './supabase'

const NotificationsContext = createContext(null)

export function useNotifications() {
  return useContext(NotificationsContext)
}

const LS_KEY = 'sportivement.unread'

function loadUnread() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch { return {} }
}
function saveUnread(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
}

/**
 * Provider global. Doit être placé à l'intérieur du BrowserRouter (utilise useLocation).
 *
 * unread state shape:
 * {
 *   city: { Paris: 3, Lyon: 0 },
 *   private: { '<otherUserId>': 2 }
 * }
 */
export function NotificationsProvider({ user, children }) {
  const [unread, setUnread] = useState(() => loadUnread())
  const [toast, setToast] = useState(null) // { id, title, body, link }
  const location = useLocation()
  const toastTimerRef = useRef(null)

  // Persist unread to localStorage
  useEffect(() => {
    saveUnread(unread)
  }, [unread])

  // Toast auto-dismiss
  const showToast = useCallback((t) => {
    clearTimeout(toastTimerRef.current)
    setToast({ ...t, id: Date.now() })
    toastTimerRef.current = setTimeout(() => setToast(null), 4500)
  }, [])

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimerRef.current)
    setToast(null)
  }, [])

  // Mark a chat as read (when user opens it)
  const markRead = useCallback((kind, key) => {
    setUnread(prev => {
      if (!prev[kind] || !prev[kind][key]) return prev
      const next = { ...prev, [kind]: { ...prev[kind], [key]: 0 } }
      return next
    })
  }, [])

  // Increment unread count
  const bumpUnread = useCallback((kind, key) => {
    setUnread(prev => {
      const sub = { ...(prev[kind] || {}) }
      sub[key] = (sub[key] || 0) + 1
      return { ...prev, [kind]: sub }
    })
  }, [])

  // Total Chat tab badge (somme villes + privés)
  const totalUnread = (
    Object.values(unread.city || {}).reduce((a, b) => a + b, 0) +
    Object.values(unread.private || {}).reduce((a, b) => a + b, 0)
  )

  // ===== Realtime subscriptions globales =====
  useEffect(() => {
    if (!user) return

    // City messages (tous les nouveaux)
    const cityChannel = supabase
      .channel('global:city_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'city_messages',
      }, async (payload) => {
        const m = payload.new
        // Ignorer mes propres messages
        if (m.user_id === user.id) return
        // Ignorer si je suis déjà dans ce salon
        if (location.pathname === `/chat/${encodeURIComponent(m.city)}`) return

        bumpUnread('city', m.city)

        // Récupérer le nom du sender pour le toast
        const { data: p } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', m.user_id)
          .maybeSingle()
        const name = p?.full_name || p?.username || 'Un combattant'
        showToast({
          title: `🥊 ${name} · ${m.city}`,
          body: m.content.length > 80 ? m.content.slice(0, 80) + '…' : m.content,
          link: `/chat/${encodeURIComponent(m.city)}`,
        })
      })
      .subscribe()

    // Messages privés où je suis le destinataire
    const privChannel = supabase
      .channel('global:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, async (payload) => {
        const m = payload.new
        if (location.pathname === `/messages/${m.sender_id}`) return

        bumpUnread('private', m.sender_id)

        const { data: p } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', m.sender_id)
          .maybeSingle()
        const name = p?.full_name || p?.username || 'Un combattant'
        showToast({
          title: `💬 ${name}`,
          body: m.content.length > 80 ? m.content.slice(0, 80) + '…' : m.content,
          link: `/messages/${m.sender_id}`,
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(cityChannel)
      supabase.removeChannel(privChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname])

  // Clear unread automatiquement quand on visite la page
  useEffect(() => {
    if (location.pathname.startsWith('/chat/')) {
      const city = decodeURIComponent(location.pathname.replace('/chat/', ''))
      markRead('city', city)
    }
    if (location.pathname.startsWith('/messages/')) {
      const id = location.pathname.replace('/messages/', '')
      if (id && id !== '') markRead('private', id)
    }
  }, [location.pathname, markRead])

  return (
    <NotificationsContext.Provider value={{
      unread,
      totalUnread,
      markRead,
      toast,
      dismissToast,
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}
