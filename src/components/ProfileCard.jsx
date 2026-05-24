import { Link } from 'react-router-dom'
import { SPORTS } from '../lib/constants'

// Silhouettes par défaut (1 par sport) — Unsplash combat sports
const FALLBACK_AVATARS = {
  mma: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=600&q=70',
  boxe: 'https://images.unsplash.com/photo-1549824506-31077e0adc94?auto=format&fit=crop&w=600&q=70',
  'muay-thai': 'https://images.unsplash.com/photo-1517438476312-10d79c5f2c9e?auto=format&fit=crop&w=600&q=70',
  kickboxing: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=70',
  jjb: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=70',
  judo: 'https://images.unsplash.com/photo-1593352216840-aa5cf6f1c4b1?auto=format&fit=crop&w=600&q=70',
  lutte: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=70',
  karate: 'https://images.unsplash.com/photo-1591117287932-a1fc0c8dbf21?auto=format&fit=crop&w=600&q=70',
  default: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=70',
}

export default function ProfileCard({ profile }) {
  const userSports = (profile.sports || [])
    .map(id => SPORTS.find(s => s.id === id))
    .filter(Boolean)

  const primarySport = userSports[0]
  const imgUrl =
    profile.avatar_url
    || (primarySport && FALLBACK_AVATARS[primarySport.id])
    || FALLBACK_AVATARS.default

  return (
    <Link to={`/profile/${profile.id}`} className="combatant-card">
      <div
        className="combatant-card-image"
        style={{ backgroundImage: `url(${imgUrl})` }}
      >
        {profile.level && (
          <span className="combatant-card-level">{profile.level}</span>
        )}
        <div className="combatant-card-overlay">
          <div className="combatant-card-name">
            {profile.full_name || profile.username}
          </div>
          <div className="combatant-card-meta">
            {profile.city || '—'}
            {primarySport && <> · {primarySport.emoji} {primarySport.label}</>}
          </div>
        </div>
      </div>
    </Link>
  )
}
