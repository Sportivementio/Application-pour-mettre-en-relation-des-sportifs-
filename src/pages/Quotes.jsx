import { useMemo, useState } from 'react'
import { QUOTES } from '../lib/quotes'
import { SPORTS } from '../lib/constants'
import PageHeader from '../components/PageHeader'

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

  // La 1ère citation = vedette du jour, affichée en rouge
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      <PageHeader title="Citations" subtitle="La sagesse des champions" />

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

      {filtered.length === 0 ? (
        <div className="empty-card">Aucune citation trouvée.</div>
      ) : (
        <div className="stack">
          {/* 1ère = vedette en rouge */}
          <div className="quote-featured">
            <blockquote className="quote-featured-text">
              « {featured.text} »
            </blockquote>
            <div className="quote-featured-author">— {featured.author}</div>
          </div>

          {/* Le reste en cards dark */}
          {rest.map(q => (
            <div key={q.id} className="quote-card-dark">
              <blockquote className="quote-card-dark-text">
                « {q.text} »
              </blockquote>
              <div className="quote-card-dark-author">— {q.author}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
