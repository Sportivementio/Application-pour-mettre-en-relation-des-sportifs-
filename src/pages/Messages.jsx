import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Messages({ user }) {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadThreads()
  }, [user])

  async function loadThreads() {
    // Récupère tous les messages où user participe, puis groupe par interlocuteur
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!msgs) { setLoading(false); return }

    const map = new Map()
    for (const m of msgs) {
      const other = m.sender_id === user.id ? m.receiver_id : m.sender_id
      if (!map.has(other)) map.set(other, m)
    }
    const otherIds = [...map.keys()]
    if (otherIds.length === 0) {
      setThreads([])
      setLoading(false)
      return
    }
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', otherIds)

    const list = otherIds.map(oid => ({
      profile: profiles?.find(p => p.id === oid) || { id: oid, username: 'Utilisateur' },
      lastMessage: map.get(oid),
    }))
    setThreads(list)
    setLoading(false)
  }

  if (loading) return <div className="loading">Chargement…</div>

  return (
    <div>
      <h1 className="hero-title">Messages</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Tes conversations avec d'autres sportifs.
      </p>

      {threads.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">💬</div>
          <div style={{ marginBottom: 16 }}>Pas encore de conversation.</div>
          <Link to="/" className="btn btn-accent">Découvrir des sportifs</Link>
        </div>
      ) : (
        <div className="chat-list card">
          {threads.map(({ profile, lastMessage }) => {
            const initials = (profile.full_name || profile.username || '?')
              .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
            return (
              <Link to={`/messages/${profile.id}`} key={profile.id} className="chat-thread">
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{initials}</div>
                <div className="chat-thread-content">
                  <div className="chat-thread-name">{profile.full_name || profile.username}</div>
                  <div className="chat-thread-preview">
                    {lastMessage.sender_id === user.id && 'Toi : '}
                    {lastMessage.content}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
