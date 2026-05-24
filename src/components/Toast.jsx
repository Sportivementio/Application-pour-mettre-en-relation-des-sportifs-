import { Link } from 'react-router-dom'
import { useNotifications } from '../lib/NotificationsContext'

export default function Toast() {
  const { toast, dismissToast } = useNotifications()
  if (!toast) return null

  const content = (
    <div className="toast-card" role="alert">
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-text">{toast.body}</div>
      </div>
      <button className="toast-close" onClick={dismissToast} aria-label="Fermer">×</button>
    </div>
  )

  return (
    <div className="toast-wrap" key={toast.id}>
      {toast.link ? (
        <Link to={toast.link} onClick={dismissToast} style={{ textDecoration: 'none' }}>
          {content}
        </Link>
      ) : content}
    </div>
  )
}
