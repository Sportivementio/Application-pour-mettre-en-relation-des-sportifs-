import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

export default function CityRoom({ user }) {
  const { cityName } = useParams()
  const city = decodeURIComponent(cityName || '')
  const [messages, setMessages] = useState([])
  const [profilesById, setProfilesById] = useState({})
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (!user || !city) return
    loadMessages()

    // Realtime : nouveaux messages live
    const channel = supabase
      .channel(`city:${city}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'city_messages',
        filter: `city=eq.${city}`,
      }, async (payload) => {
        const newMsg = payload.new
        // S'assurer qu'on a le profil du nouvel auteur
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
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, city])

  async function loadMessages() {
    setLoading(true)
    // Garde les 100 derniers messages (par sécurité)
    const { data } = await supabase
      .from('city_messages')
      .select('*')
      .eq('city', city)
      .order('created_at', { ascending: false })
      .limit(100)
    const msgs = (data || []).reverse() // remettre dans l'ordre chronologique

    // Charger les profils des auteurs
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
    setLoading(false)
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

  return (
    <div>
      <PageHeader title={city} subtitle="Salon public · Le ring commun" back />

      <div className="city-room">
        <div className="city-room-messages">
          {loading ? (
            <div className="loading">Chargement…</div>
          ) : messages.length === 0 ? (
            <div className="empty-card" style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 4 }}>AUCUN MESSAGE.</div>
              <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>Sois le 1ᵉʳ à briser le silence du ring 🔔</div>
            </div>
          ) : (
            messages.map(m => {
              const p = profilesById[m.user_id]
              const isMine = m.user_id === user.id
              const name = p?.full_name || p?.username || 'Combattant'
              const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
              return (
                <div key={m.id} className={'city-msg' + (isMine ? ' city-msg-mine' : '')}>
                  <div
                    className="avatar"
                    style={{
                      width: 32, height: 32, fontSize: 12, flexShrink: 0,
                      ...(p?.avatar_url ? { backgroundImage: `url(${p.avatar_url})` } : {}),
                    }}
                  >
                    {!p?.avatar_url && initials}
                  </div>
                  <div className="city-msg-content">
                    <div className="city-msg-header">
                      <span className="city-msg-author">{isMine ? 'Toi' : name}</span>
                      <span className="city-msg-time">
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="city-msg-bubble">{m.content}</div>
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
