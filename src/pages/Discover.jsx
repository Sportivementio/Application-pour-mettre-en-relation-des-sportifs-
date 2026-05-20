import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SPORTS, CATEGORIES } from '../lib/constants'
import ProfileCard from '../components/ProfileCard'

export default function Discover({ user }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sportFilter, setSportFilter] = useState(null)
  const [city, setCity] = useState('')

  useEffect(() => {
    loadProfiles()
  }, [sportFilter, city])

  async function loadProfiles() {
    setLoading(true)
    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', user?.id || '00000000-0000-0000-0000-000000000000')
      .order('created_at', { ascending: false })
      .limit(50)

    if (sportFilter) {
      query = query.contains('sports', [sportFilter])
    }
    if (city) {
      query = query.ilike('city', `%${city}%`)
    }
    const { data, error } = await query
    if (!error) setProfiles(data || [])
    setLoading(false)
  }

  return (
    <div>
      <h1 className="hero-title">
        Trouve ton <span className="hero-accent">partenaire</span>
      </h1>
      <p className="text-muted" style={{ marginBottom: 28 }}>
        Découvre des sportifs près de chez toi.
      </p>

      <div className="field">
        <input
          className="input"
          placeholder="Filtrer par ville…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {Object.entries(CATEGORIES).map(([cat, label]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <div className="field-label" style={{ marginBottom: 10 }}>{label}</div>
          <div className="pill-group">
            {SPORTS.filter(s => s.category === cat).map(s => (
              <button
                key={s.id}
                className={'pill' + (sportFilter === s.id ? ' active' : '')}
                onClick={() => setSportFilter(sportFilter === s.id ? null : s.id)}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <h2 className="section-title" style={{ marginTop: 32 }}>
        {profiles.length} {profiles.length > 1 ? 'sportifs' : 'sportif'}
      </h2>

      {loading ? (
        <div className="loading">Chargement…</div>
      ) : profiles.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🤷</div>
          <div>Aucun profil ne correspond à ta recherche pour le moment.</div>
        </div>
      ) : (
        <div className="stack">
          {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  )
}
