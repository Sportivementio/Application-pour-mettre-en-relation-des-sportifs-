import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SPORTS } from '../lib/constants'

export default function ProfileView({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const profileId = id || user?.id
  const isMe = !id || id === user?.id

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profileId) return
    supabase.from('profiles').select('*').eq('id', profileId).single()
      .then(({ data }) => { setProfile(data); setLoading(false) })
  }, [profileId])

  if (loading) return <div className="loading">Chargement…</div>
  if (!profile) return <div className="empty">Profil introuvable.</div>

  const initials = (profile.full_name || profile.username || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const userSports = (profile.sports || [])
    .map(sid => SPORTS.find(s => s.id === sid))
    .filter(Boolean)

  return (
    <div>
      <div className="card-elevated text-center" style={{ marginBottom: 24 }}>
        <div
          className="avatar avatar-lg"
          style={{
            margin: '0 auto 16px',
            ...(profile.avatar_url ? { backgroundImage: `url(${profile.avatar_url})` } : {}),
          }}
        >
          {!profile.avatar_url && initials}
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>
          {profile.full_name || profile.username}
        </h1>
        <div className="text-muted" style={{ marginBottom: 16 }}>
          @{profile.username}
          {profile.city && <> · {profile.city}</>}
          {profile.level && <> · {profile.level}</>}
        </div>

        {profile.bio && <p style={{ marginBottom: 16 }}>{profile.bio}</p>}

        {userSports.length > 0 && (
          <div className="pill-group" style={{ justifyContent: 'center', marginBottom: 16 }}>
            {userSports.map(s => (
              <span key={s.id} className="tag-sport" style={{ color: s.color, fontSize: 13, padding: '6px 14px' }}>
                {s.emoji} {s.label}
              </span>
            ))}
          </div>
        )}

        {isMe ? (
          <Link to="/profile/edit" className="btn btn-outline">Modifier mon profil</Link>
        ) : (
          <button
            className="btn btn-accent"
            onClick={() => navigate(`/messages/${profile.id}`)}
          >
            💬 Envoyer un message
          </button>
        )}
      </div>
    </div>
  )
}
