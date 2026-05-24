import { Link } from 'react-router-dom'

export default function TopBar({ user, onLogout }) {
  return (
    <header className="topbar">
      <Link to="/" className="topbar-logo">
        SPORTIVEMENT<span>IO</span>
      </Link>
      <div className="topbar-actions">
        {user ? (
          <button
            className="topbar-badge"
            onClick={onLogout}
            aria-label="Déconnexion"
            title="Déconnexion"
          >
            <span aria-hidden>◆</span>
          </button>
        ) : (
          <Link to="/auth" className="btn btn-ghost btn-sm">Connexion</Link>
        )}
      </div>
    </header>
  )
}
