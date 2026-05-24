import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, back }) {
  const navigate = useNavigate()

  return (
    <div className="page-header">
      {back && (
        <button
          className="page-header-back"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          ←
        </button>
      )}
      <div>
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
