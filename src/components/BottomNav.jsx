import { NavLink } from 'react-router-dom'
import { useNotifications } from '../lib/NotificationsContext'

const items = [
  { to: '/',         icon: '🔍', label: 'Search' },
  { to: '/messages', icon: '💬', label: 'Chat', badgeKey: 'chat' },
  { to: '/sessions', icon: '📍', label: 'Sessions' },
  { to: '/quotes',   icon: '❝',  label: 'Quotes' },
  { to: '/profile',  icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const notif = useNotifications()
  const total = notif?.totalUnread || 0

  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === '/'}
          className={({ isActive }) =>
            'bottom-nav-item' + (isActive ? ' active' : '')
          }
        >
          <span className="bottom-nav-icon" style={{ position: 'relative' }}>
            {it.icon}
            {it.badgeKey === 'chat' && total > 0 && (
              <span className="nav-badge">{total > 9 ? '9+' : total}</span>
            )}
          </span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
