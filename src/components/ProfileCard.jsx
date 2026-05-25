import { Link } from 'react-router-dom'
import { SPORTS } from '../lib/constants'
import { defaultAvatarFor } from '../lib/defaultAvatar'

export default function ProfileCard({ profile }) {
  const userSports = (profile.sports || [])
    .map(id => SPORTS.find(s => s.id === id))
    .filter(Boolean)

  const primarySport = userSports[0]
  const imgUrl = defaultAvatarFor(profile)

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
