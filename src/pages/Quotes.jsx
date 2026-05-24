import { useMemo, useState } from 'react'
import { QUOTES } from '../lib/quotes'
import { SPORTS } from '../lib/constants'

// Filtres : "Tout" + liste des sports présents dans QUOTES
const SPORT_FILTERS = [
  { id: 'all', label: 'Tout', color: '#e63946' },
  ...SPORTS.filter(s => QUOTES.some(q => q.sport === s.id)),
  { id: 'general', label: 'Arts martiaux', color: '#a855f7' },
]

export default function Quotes() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = QUOTES
    if (filter !== 'all') list = list.filter(q => q.sport === filter)
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      list = list.filter(q =>
        q.text.toLowerCase().includes(s) ||
        q.author.toLowerCase().includes(s)
      )
    }
    return list
  }, [filter, search])

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-banner-content">
          <span className="hero-banner-badge">❝ Citations</span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(34px, 7vw, 52px)', margin: 0 }}>
            Les légendes<br/>ont <span className="hero-accent">parlé</span>
          </h1>
        </div>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔎</span>
        <input
          className="search-input"
          placeholder="CHERCHE UNE CITATION OU UN CHAMPION…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-row">
        {SPORT_FILTERS.map(f => (
          <button
            key={f.id}
            className={'filter-pill' + (filter === f.id ? ' active' : '')}
            onClick={() => setFilter(f.id)}
            style={filter === f.id ? { background: f.color, borderColor: f.color } : {}}
          >
            {f.label.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 24 }}>
        {filtered.length} {filtered.length > 1 ? 'citations' : 'citation'}
      </h2>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">❝</div>
          <div>Aucune citation trouvée.</div>
        </div>
      ) : (
        <div className="stack">
          {filtered.map(q => {
            const sport = SPORTS.find(s => s.id === q.sport)
            const accentColor = sport?.color || '#a855f7'
            return (
              <div key={q.id} className="quote-card">
                <span className="quote-mark" aria-hidden>❝</span>
                <blockquote className="quote-text">
                  {q.text}
                </blockquote>
                <div className="quote-footer">
                  <div className="quote-author">— {q.author}</div>
                  <span
                    className="tag-sport"
                    style={{ color: accentColor, fontSize: 11 }}
                  >
                    {q.emoji} {sport?.label || 'Arts martiaux'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
