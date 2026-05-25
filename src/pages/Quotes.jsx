import { useMemo, useState } from 'react'
import { QUOTES } from '../lib/quotes'
import { FACTS } from '../lib/facts'
import { SPORTS } from '../lib/constants'
import PageHeader from '../components/PageHeader'

// Filtres : "Tout" + sports + Arts martiaux général
const SPORT_FILTERS = [
  { id: 'all', label: 'Tout', color: '#e63946' },
  ...SPORTS,
  { id: 'general', label: 'Arts martiaux', color: '#a855f7' },
]

export default function Quotes() {
  const [tab, setTab] = useState('quotes') // 'quotes' | 'facts'
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Filtrage des citations
  const filteredQuotes = useMemo(() => {
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

  // Filtrage des faits
  const filteredFacts = useMemo(() => {
    let list = FACTS
    if (filter !== 'all') list = list.filter(f => f.sport === filter)
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      list = list.filter(f => f.text.toLowerCase().includes(s))
    }
    return list
  }, [filter, search])

  const items = tab === 'quotes' ? filteredQuotes : filteredFacts
  const featured = items[0]
  const rest = items.slice(1)

  return (
    <div>
      <PageHeader
        title={tab === 'quotes' ? 'Citations' : 'Le saviez-vous ?'}
        subtitle={tab === 'quotes' ? 'La sagesse des champions' : `${FACTS.length} faits surprenants`}
      />

      {/* Onglets CITATIONS / FAITS */}
      <div className="chat-tabs" style={{ marginBottom: 18 }}>
        <button
          className={'chat-tab' + (tab === 'quotes' ? ' active' : '')}
          onClick={() => setTab('quotes')}
        >
          ❝ CITATIONS
        </button>
        <button
          className={'chat-tab' + (tab === 'facts' ? ' active' : '')}
          onClick={() => setTab('facts')}
        >
          💡 FAITS
        </button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔎</span>
        <input
          className="search-input"
          placeholder={tab === 'quotes' ? 'CHERCHE UNE CITATION OU UN CHAMPION…' : 'CHERCHE UN FAIT…'}
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

      <div className="text-muted" style={{ fontSize: 12, marginBottom: 14, fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {items.length} {tab === 'quotes' ? 'citation' : 'fait'}{items.length > 1 ? 's' : ''}
      </div>

      {items.length === 0 ? (
        <div className="empty-card">Aucun résultat.</div>
      ) : tab === 'quotes' ? (
        <div className="stack">
          {/* 1ère = vedette en rouge */}
          <div className="quote-featured">
            <blockquote className="quote-featured-text">
              « {featured.text} »
            </blockquote>
            <div className="quote-featured-author">— {featured.author}</div>
          </div>
          {rest.map(q => (
            <div key={q.id} className="quote-card-dark">
              <blockquote className="quote-card-dark-text">
                « {q.text} »
              </blockquote>
              <div className="quote-card-dark-author">— {q.author}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stack">
          {/* 1er fait = vedette */}
          <div className="quote-featured">
            <div className="fact-featured-icon">{featured.emoji} LE SAVIEZ-VOUS ?</div>
            <p className="quote-featured-text" style={{ fontStyle: 'normal' }}>
              {featured.text}
            </p>
          </div>
          {rest.map(f => (
            <div key={f.id} className="quote-card-dark">
              <div className="fact-icon-row">
                <span className="fact-emoji">{f.emoji}</span>
                <span className="fact-num">#{f.id}</span>
              </div>
              <p className="quote-card-dark-text" style={{ fontStyle: 'normal' }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
