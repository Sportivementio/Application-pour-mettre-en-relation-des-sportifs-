import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CITIES } from '../lib/constants'
import PageHeader from '../components/PageHeader'

export default function Chat({ user }) {
  const [tab, setTab] = useState('villes') // 'villes' | 'prive'
  const [search, setSearch] = useState('')
  const [threads, setThreads] = useState([])
  const [loadingThreads, setLoadingThreads] = useState(true)

  useEffect(() => {
    if (tab === 'prive' && user) loadThreads()
  }, [tab, user])

  async function loadThreads() {
    setLoadingThreads(true)
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!msgs || msgs.length === 0) {
      setThreads([])
      setLoadingThreads(false)
      return
    }

    const map = new Map()
    for (const m of msgs) {
      const other = m.sender_id === user.id ? m.receiver_id : m.sender_id
      if (!map.has(other)) map.set(other, m)
    }
    const otherIds = [...map.keys()]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', otherIds)

    const list = otherIds.map(oid => ({
      profile: profiles?.find(p => p.id === oid) || { id: oid, username: 'Utilisateur' },
      lastMessage: map.get(oid),
    }))
    setThreads(list)
    setLoadingThreads(false)
  }

  const filteredCities = useMemo(() => {
    if (!search.trim()) return CITIES
    const s = search.trim().toLowerCase()
    return CITIES.filter(c => c.name.toLowerCase().includes(s))
  }, [search])

  return (
    <div>
      <PageHeader title="Chat" subtitle="Le ring commun" />

      <div className="chat-tabs">
        <button
          className={'chat-tab' + (tab === 'villes' ? ' active' : '')}
          onClick={() => setTab('villes')}
        >
          VILLES
        </button>
        <button
          className={'chat-tab' + (tab === 'prive' ? ' active' : '')}
          onClick={() => setTab('prive')}
        >
          PRIVÉ
        </button>
      </div>

      {tab === 'villes' ? (
        <>
          <div className="search-bar">
            <span className="search-icon">🔎</span>
            <input
              className="search-input"
              placeholder="FILTRER UNE VILLE…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredCities.length === 0 ? (
            <div className="empty-card">Aucune ville trouvée.</div>
          ) : (
            <div className="city-grid">
              {filteredCities.map(c => (
                <Link
                  key={c.name}
                  to={`/chat/${encodeURIComponent(c.name)}`}
                  className="city-card"
                >
                  <span className="city-card-pin" aria-hidden>📍</span>
                  <div className="city-card-name">{c.name}</div>
                  <div className="city-card-tag">Salon public</div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {loadingThreads ? (
            <div className="loading">Chargement…</div>
          ) : threads.length === 0 ? (
            <div className="empty-card">
              <div style={{ marginBottom: 8 }}>AUCUNE CONVERSATION PRIVÉE.</div>
              <Link to="/" className="link-accent">→ Trouve un combattant</Link>
            </div>
          ) : (
            <div className="chat-list">
              {threads.map(({ profile, lastMessage }) => {
                const initials = (profile.full_name || profile.username || '?')
                  .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
                return (
                  <Link to={`/messages/${profile.id}`} key={profile.id} className="chat-thread">
                    <div
                      className="avatar"
                      style={{
                        width: 44, height: 44, fontSize: 16,
                        ...(profile.avatar_url ? { backgroundImage: `url(${profile.avatar_url})` } : {}),
                      }}
                    >
                      {!profile.avatar_url && initials}
                    </div>
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
        </>
      )}
    </div>
  )
}
