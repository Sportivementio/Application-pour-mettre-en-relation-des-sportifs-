import { Link } from 'react-router-dom'
import { SPORTS } from '../lib/constants'

export default function ProfileCard({ profile }) {
  const initials = (profile.full_name || profile.username || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const userSports = (profile.sports || [])
    .map(id => SPORTS.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 3)

  return (
    <Link to={`/profile/${profile.id}`} className="profile-card">
      <div className="avatar">{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 17 }}>
          {profile.full_name || profile.username}
        </div>
        <div className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>
          {profile.city ? `${profile.city} · ` : ''}{profile.level || ''}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {userSports.map(s => (
            <span key={s.id} className="tag">{s.emoji} {s.label}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
