import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SPORTS } from '../lib/constants'
import ProfileCard from '../components/ProfileCard'
import QuoteBanner from '../components/QuoteBanner'

// Filtres : "Tout" + sports
const SPORT_FILTERS = [
  { id: 'all', label: 'Tout', color: '#e63946', emoji: '' },
  ...SPORTS,
]

export default function Discover({ user }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sportFilter, setSportFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProfiles()
  }, [sportFilter, search])

  async function loadProfiles() {
    setLoading(true)
    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', user?.id || '00000000-0000-0000-0000-000000000000')
      .order('created_at', { ascending: false })
      .limit(50)

    if (sportFilter && sportFilter !== 'all') {
      query = query.contains('sports', [sportFilter])
    }
    if (search.trim()) {
      const s = search.trim()
      query = query.or(`city.ilike.%${s}%,username.ilike.%${s}%,full_name.ilike.%${s}%`)
    }
    const { data, error } = await query
    if (!error) setProfiles(data || [])
    setLoading(false)
  }

  return (
    <div>
      <div className="search-bar">
        <span className="search-icon">🔎</span>
        <input
          className="search-input"
          placeholder="VILLE, PSEUDO, NOM…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-filter-btn" aria-label="Filtres">⌃</button>
      </div>

      <div className="filter-row">
        {SPORT_FILTERS.map(s => (
          <button
            key={s.id}
            className={'filter-pill' + (sportFilter === s.id ? ' active' : '')}
            onClick={() => setSportFilter(s.id)}
            style={sportFilter === s.id ? { background: s.color, borderColor: s.color } : {}}
          >
            {s.label.toUpperCase()}
          </button>
        ))}
      </div>

      <QuoteBanner />

      <div className="row" style={{ marginTop: 24, marginBottom: 16, justifyContent: 'space-between' }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          {profiles.length} {profiles.length > 1 ? 'combattants' : 'combattant'}
        </h2>
        <Link to="/quotes" className="link-accent">+ DE CITATIONS →</Link>
      </div>

      {loading ? (
        <div className="loading">Chargement…</div>
      ) : profiles.length === 0 ? (
        <div className="empty empty-card">
          <div style={{ marginBottom: 8 }}>AUCUN COMBATTANT TROUVÉ.</div>
          <div style={{ fontSize: 13, color: 'var(--text-mute)' }}>Élargis ta recherche ou invite tes potes du gym.</div>
        </div>
      ) : (
        <div className="stack">
          {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  )
}
