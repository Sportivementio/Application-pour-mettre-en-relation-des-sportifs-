import { NavLink } from 'react-router-dom'

const items = [
  { to: '/',         icon: '🔍', label: 'Search' },
  { to: '/messages', icon: '💬', label: 'Chat' },
  { to: '/quotes',   icon: '❝',  label: 'Quotes' },
  { to: '/profile',  icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
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
          <span className="bottom-nav-icon">{it.icon}</span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
