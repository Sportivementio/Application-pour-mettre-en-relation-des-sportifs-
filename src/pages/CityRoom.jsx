import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import {
  fetchBlockedUserIds,
  fetchHiddenMessageIds,
  reportMessage,
  deleteCityMessage,
} from '../lib/moderation'

export default function CityRoom({ user }) {
  const { cityName } = useParams()
  const city = decodeURIComponent(cityName || '')
  const [messages, setMessages] = useState([])
  const [profilesById, setProfilesById] = useState({})
  const [blockedIds, setBlockedIds] = useState(new Set())
  const [hiddenIds, setHiddenIds] = useState(new Set())
  const [openMenu, setOpenMenu] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (!user || !city) return
    init()

    // Realtime
    const channel = supabase
      .channel(`city:${city}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'city_messages',
        filter: `city=eq.${city}`,
      }, async (payload) => {
        const newMsg = payload.new
        if (!profilesById[newMsg.user_id]) {
          const { data: p } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', newMsg.user_id)
            .single()
          if (p) setProfilesById(prev => ({ ...prev, [p.id]: p }))
        }
        setMessages(prev => [...prev, newMsg])
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'city_messages',
        filter: `city=eq.${city}`,
      }, (payload) => {
        const oldId = payload.old?.id
        if (oldId) setMessages(prev => prev.filter(m => m.id !== oldId))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, city])

  async function init() {
    setLoading(true)
    const [blocked, hidden] = await Promise.all([
      fetchBlockedUserIds(user.id),
      fetchHiddenMessageIds(3),
    ])
    setBlockedIds(blocked)
    setHiddenIds(hidden)
    await loadMessages()
    setLoading(false)
  }

  async function loadMessages() {
    const { data } = await supabase
      .from('city_messages')
      .select('*')
      .eq('city', city)
      .order('created_at', { ascending: false })
      .limit(100)
    const msgs = (data || []).reverse()

    const userIds = [...new Set(msgs.map(m => m.user_id))]
    if (userIds.length > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds)
      const map = {}
      ;(profs || []).forEach(p => { map[p.id] = p })
      setProfilesById(map)
    }

    setMessages(msgs)
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const content = text.trim()
    setText('')
    const { error } = await supabase.from('city_messages').insert({
      user_id: user.id,
      city,
      content,
    })
    setSending(false)
    if (error) {
      console.error(error)
      setText(content)
      alert("Impossible d'envoyer le message")
    }
  }

  async function handleReport(messageId) {
    setOpenMenu(null)
    const res = await reportMessage(user.id, messageId)
    if (res.ok) {
      alert(res.already ? 'Tu as déjà signalé ce message.' : 'Message signalé ✓ merci.')
      // Recharger les hidden au cas où on dépasse le seuil
      const ids = await fetchHiddenMessageIds(3)
      setHiddenIds(ids)
    } else {
      alert("Impossible de signaler : " + (res.error?.message || 'erreur'))
    }
  }

  async function handleDelete(messageId) {
    setOpenMenu(null)
    if (!confirm('Supprimer ce message ?')) return
    const res = await deleteCityMessage(messageId)
    if (!res.ok) {
      alert("Impossible de supprimer : " + (res.error?.message || 'erreur'))
    }
  }

  // Filtrer : pas les messages des bloqués
  const visibleMessages = messages.filter(m => !blockedIds.has(m.user_id))

  return (
    <div onClick={() => openMenu && setOpenMenu(null)}>
      <PageHeader title={city} subtitle="Salon public · Le ring commun" back />

      <div className="city-room">
        <div className="city-room-messages">
          {loading ? (
            <div className="loading">Chargement…</div>
          ) : visibleMessages.length === 0 ? (
            <div className="empty-card" style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 4 }}>AUCUN MESSAGE.</div>
              <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>Sois le 1ᵉʳ à briser le silence du ring 🔔</div>
            </div>
          ) : (
            visibleMessages.map(m => {
              const p = profilesById[m.user_id]
              const isMine = m.user_id === user.id
              const isHidden = hiddenIds.has(m.id)
              const name = p?.full_name || p?.username || 'Combattant'
              const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
              const menuOpen = openMenu === m.id

              return (
                <div key={m.id} className={'city-msg' + (isMine ? ' city-msg-mine' : '')}>
                  <Link
                    to={isMine ? '/profile' : `/profile/${m.user_id}`}
                    style={{ flexShrink: 0 }}
                  >
                    <div
                      className="avatar"
                      style={{
                        width: 32, height: 32, fontSize: 12,
                        ...(p?.avatar_url ? { backgroundImage: `url(${p.avatar_url})` } : {}),
                      }}
                    >
                      {!p?.avatar_url && initials}
                    </div>
                  </Link>
                  <div className="city-msg-content">
                    <div className="city-msg-header">
                      <span className="city-msg-author">{isMine ? 'Toi' : name}</span>
                      <span className="city-msg-time">
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="spacer" />
                      <button
                        className="city-msg-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenu(menuOpen ? null : m.id)
                        }}
                        aria-label="Options"
                      >⋯</button>
                    </div>
                    {isHidden ? (
                      <div className="city-msg-bubble city-msg-hidden">
                        [Message signalé · masqué]
                      </div>
                    ) : (
                      <div className="city-msg-bubble">{m.content}</div>
                    )}
                    {menuOpen && (
                      <div className="city-msg-menu" onClick={e => e.stopPropagation()}>
                        {isMine ? (
                          <button className="city-msg-menu-item danger" onClick={() => handleDelete(m.id)}>
                            🗑 Supprimer
                          </button>
                        ) : (
                          <button className="city-msg-menu-item" onClick={() => handleReport(m.id)}>
                            🚩 Signaler
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="city-room-input">
          <input
            className="input"
            placeholder={`Écris dans le ring de ${city}…`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />
          <button
            type="submit"
            className="btn btn-accent"
            disabled={!text.trim() || sending}
          >
            {sending ? '…' : 'ENVOYER'}
          </button>
        </form>
      </div>
    </div>
  )
}
