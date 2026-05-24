import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SPORTS } from '../lib/constants'
import PageHeader from '../components/PageHeader'

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
  if (!profile) return <div className="empty-card">Profil introuvable.</div>

  const initials = (profile.full_name || profile.username || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const userSports = (profile.sports || [])
    .map(sid => SPORTS.find(s => s.id === sid))
    .filter(Boolean)

  const stats = [
    profile.age && { label: 'Âge', value: profile.age },
    profile.weight && { label: 'Poids', value: `${profile.weight} kg` },
    profile.years_practice && { label: 'Pratique', value: `${profile.years_practice} an${profile.years_practice > 1 ? 's' : ''}` },
    profile.level && { label: 'Niveau', value: profile.level },
  ].filter(Boolean)

  return (
    <div>
      <PageHeader title={isMe ? 'Mon profil' : 'Combattant'} back={!isMe} />

      <div className="profile-hero">
        <div
          className="avatar avatar-lg"
          style={{
            margin: '0 auto 18px',
            ...(profile.avatar_url ? { backgroundImage: `url(${profile.avatar_url})` } : {}),
          }}
        >
          {!profile.avatar_url && initials}
        </div>
        <h2 className="profile-hero-name">{profile.full_name || profile.username}</h2>
        <div className="profile-hero-meta">
          @{profile.username}
          {profile.city && <> · {profile.city}</>}
        </div>

        {profile.bio && (
          <p className="profile-hero-bio">{profile.bio}</p>
        )}

        {stats.length > 0 && (
          <div className="profile-stats">
            {stats.map(s => (
              <div key={s.label} className="profile-stat">
                <div className="profile-stat-label">{s.label}</div>
                <div className="profile-stat-value">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {userSports.length > 0 && (
          <div className="pill-group" style={{ justifyContent: 'center', marginTop: 16 }}>
            {userSports.map(s => (
              <span key={s.id} className="tag-sport" style={{ color: s.color, fontSize: 13, padding: '6px 14px' }}>
                {s.emoji} {s.label}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          {isMe ? (
            <Link to="/profile/edit" className="btn btn-outline btn-full">
              ✏️ MODIFIER MON PROFIL
            </Link>
          ) : (
            <button
              className="btn btn-accent btn-full"
              onClick={() => navigate(`/messages/${profile.id}`)}
            >
              💬 ENVOYER UN MESSAGE
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
