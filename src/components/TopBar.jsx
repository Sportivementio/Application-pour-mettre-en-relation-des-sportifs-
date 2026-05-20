import { Link } from 'react-router-dom'

export default function TopBar({ user, onLogout }) {
  return (
    <header className="topbar">
      <Link to="/" className="topbar-logo">
        Sportiv<span>ement</span>
      </Link>
      <div className="topbar-actions">
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>
            Déconnexion
          </button>
        ) : (
          <>
            <Link to="/auth" className="btn btn-ghost btn-sm">Connexion</Link>
          </>
        )}
      </div>
    </header>
  )
}
