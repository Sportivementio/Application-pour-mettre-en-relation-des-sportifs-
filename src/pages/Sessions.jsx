import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SPORTS } from '../lib/constants'
import PageHeader from '../components/PageHeader'
import SessionMap from '../components/SessionMap'
import CreateSessionModal from '../components/CreateSessionModal'
import {
  fetchOpenSessions, joinSession, leaveSession, deleteSession,
  countAttendees, amIJoined,
} from '../lib/sessions'

export default function Sessions({ user }) {
  const [tab, setTab] = useState('map') // 'map' | 'list'
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchOpenSessions()
    setSessions(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()

    // Realtime : nouvelle session ou participation
    const ch = supabase
      .channel('global:sessions')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'sessions',
      }, () => load())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'session_participants',
      }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [load])

  async function handleJoin(session) {
    if (!user) return
    setBusyId(session.id)
    const res = await joinSession(session.id, user.id)
    setBusyId(null)
    if (!res.ok) {
      alert("Impossible de rejoindre : " + (res.error?.message || ''))
      return
    }
    // Ouvrir chat privé avec le créateur
    if (session.creator_id !== user.id) {
      navigate(`/messages/${session.creator_id}`)
    }
  }

  async function handleLeave(session) {
    if (!confirm('Quitter cette session ?')) return
    setBusyId(session.id)
    await leaveSession(session.id, user.id)
    setBusyId(null)
    load()
  }

  async function handleDelete(session) {
    if (!confirm('Supprimer cette session ? Les participants seront notifiés.')) return
    setBusyId(session.id)
    await deleteSession(session.id)
    setBusyId(null)
    load()
  }

  return (
    <div>
      <PageHeader title="Sessions" subtitle="Trouve ou crée un entraînement près de chez toi" />

      <div className="chat-tabs" style={{ marginBottom: 16 }}>
        <button
          className={'chat-tab' + (tab === 'map' ? ' active' : '')}
          onClick={() => setTab('map')}
        >🗺️ CARTE</button>
        <button
          className={'chat-tab' + (tab === 'list' ? ' active' : '')}
          onClick={() => setTab('list')}
        >📋 LISTE</button>
      </div>

      <button
        className="btn btn-accent btn-full btn-lg"
        onClick={() => setShowCreate(true)}
        style={{ marginBottom: 16 }}
      >
        ➕ CRÉER UNE SESSION
      </button>

      {loading ? (
        <div className="loading">Chargement…</div>
      ) : tab === 'map' ? (
        sessions.length === 0 ? (
          <div className="empty-card">
            <div style={{ marginBottom: 8 }}>AUCUNE SESSION.</div>
            <div style={{ fontSize: 13, color: 'var(--text-mute)' }}>Sois le 1ᵉʳ à créer une session dans ta ville 🥊</div>
          </div>
        ) : (
          <SessionMap sessions={sessions} onSessionClick={(s) => {
            const el = document.getElementById('session-' + s.id)
            if (el) {
              setTab('list')
              setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
            }
          }} />
        )
      ) : (
        <div className="stack">
          {sessions.length === 0 ? (
            <div className="empty-card">Aucune session ouverte pour le moment.</div>
          ) : (
            sessions.map(s => {
              const sport = SPORTS.find(sp => sp.id === s.sport)
              const joined = amIJoined(s, user?.id)
              const isMine = s.creator_id === user?.id
              const count = countAttendees(s)
              const dt = new Date(s.session_at)
              return (
                <div key={s.id} id={'session-' + s.id} className="session-card">
                  <div className="session-card-head">
                    <span
                      className="tag-sport"
                      style={{ color: sport?.color || '#e63946' }}
                    >
                      {sport?.emoji} {sport?.label}
                    </span>
                    <span className={'session-status ' + (s.status === 'full' ? 'full' : 'open')}>
                      {count}/{s.max_participants} · {s.status === 'full' ? 'COMPLET' : 'OUVERT'}
                    </span>
                  </div>
                  <div className="session-city">📍 {s.city}
                    {s.location_details && <span className="session-loc"> — {s.location_details}</span>}
                  </div>
                  <div className="session-time">
                    🗓️ {dt.toLocaleString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                      hour: '2-digit', minute: '2-digit',
                    })} · {s.duration_minutes} min
                  </div>
                  <div className="session-equipment">
                    {s.equipment_provided
                      ? <>✓ <span style={{ color: 'var(--success)' }}>Équipement fourni</span></>
                      : <>📦 Apporter le sien</>}
                    {s.equipment_details && <span className="text-muted"> — {s.equipment_details}</span>}
                  </div>
                  <div className="session-creator text-muted">
                    Créé par <b>{s.creator?.full_name || s.creator?.username || 'un combattant'}</b>
                  </div>
                  <div className="session-actions">
                    {isMine ? (
                      <button
                        className="btn btn-ghost btn-full"
                        onClick={() => handleDelete(s)}
                        disabled={busyId === s.id}
                      >🗑 Supprimer ma session</button>
                    ) : joined ? (
                      <>
                        <button
                          className="btn btn-accent btn-full"
                          onClick={() => navigate(`/messages/${s.creator_id}`)}
                        >💬 Chatter avec le créateur</button>
                        <button
                          className="btn btn-outline btn-full"
                          onClick={() => handleLeave(s)}
                          disabled={busyId === s.id}
                          style={{ marginTop: 8 }}
                        >Quitter la session</button>
                      </>
                    ) : (
                      <button
                        className="btn btn-accent btn-full"
                        onClick={() => handleJoin(s)}
                        disabled={busyId === s.id || s.status === 'full'}
                      >{s.status === 'full' ? 'COMPLET' : '➕ REJOINDRE'}</button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {showCreate && (
        <CreateSessionModal
          user={user}
          onClose={() => setShowCreate(false)}
          onCreated={() => load()}
        />
      )}
    </div>
  )
}
