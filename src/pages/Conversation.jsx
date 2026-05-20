import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Conversation({ user }) {
  const { otherId } = useParams()
  const [messages, setMessages] = useState([])
  const [other, setOther] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const endRef = useRef(null)

  useEffect(() => {
    if (!user || !otherId) return

    // Charger le profil de l'autre
    supabase.from('profiles').select('*').eq('id', otherId).single()
      .then(({ data }) => setOther(data))

    // Charger les messages
    loadMessages()

    // S'abonner aux nouveaux messages temps réel
    const channel = supabase
      .channel(`chat:${user.id}:${otherId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const m = payload.new
        const concernsUs =
          (m.sender_id === user.id && m.receiver_id === otherId) ||
          (m.sender_id === otherId && m.receiver_id === user.id)
        if (concernsUs) {
          setMessages(prev => [...prev, m])
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, otherId])

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e) {
    e.preventDefault()
    if (!text.trim()) return
    const content = text.trim()
    setText('')
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: otherId,
      content,
    })
    if (error) {
      console.error(error)
      setText(content)
      alert("Impossible d'envoyer le message")
    }
  }

  if (loading) return <div className="loading">Chargement…</div>

  return (
    <div>
      <div className="row" style={{ marginBottom: 16 }}>
        <Link to="/messages" className="btn btn-outline btn-sm">← Retour</Link>
        {other && (
          <Link to={`/profile/${other.id}`} style={{ fontWeight: 600 }}>
            {other.full_name || other.username}
          </Link>
        )}
      </div>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="text-center text-muted" style={{ padding: 40 }}>
              Lance la conversation 👋
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={'msg ' + (m.sender_id === user.id ? 'msg-mine' : 'msg-theirs')}>
              {m.content}
              <div className="msg-time">
                {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="chat-input-row">
          <input
            className="input"
            placeholder="Écris ton message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-accent" disabled={!text.trim()}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  )
}
