import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SPORTS, LEVELS } from '../lib/constants'

export default function ProfileEdit({ user }) {
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    city: '',
    level: 'Débutant',
    sports: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setProfile({ ...profile, ...data })
        setLoading(false)
      })
  }, [user])

  function toggleSport(id) {
    setProfile(p => ({
      ...p,
      sports: p.sports.includes(id)
        ? p.sports.filter(s => s !== id)
        : [...p.sports, id],
    }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
    })
    setSaving(false)
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Profil enregistré ✓')
      setTimeout(() => navigate('/profile'), 800)
    }
  }

  if (loading) return <div className="loading">Chargement…</div>

  return (
    <div>
      <h1 className="hero-title">Mon profil</h1>
      <p className="text-muted" style={{ marginBottom: 28 }}>
        Renseigne tes infos pour que les autres puissent te trouver.
      </p>

      {message && (
        <div className={'alert ' + (message.startsWith('Erreur') ? 'alert-error' : 'alert-info')}>
          {message}
        </div>
      )}

      <form onSubmit={save} className="card-elevated">
        <div className="field">
          <label className="field-label">Nom complet</label>
          <input
            className="input"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label className="field-label">Ville</label>
          <input
            className="input"
            placeholder="ex: Paris"
            value={profile.city || ''}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="field-label">Niveau</label>
          <select
            className="select"
            value={profile.level || 'Débutant'}
            onChange={(e) => setProfile({ ...profile, level: e.target.value })}
          >
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">À propos</label>
          <textarea
            className="textarea"
            placeholder="Quelques mots sur toi et ce que tu cherches…"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="field-label">Disciplines</label>
          <div className="pill-group">
            {SPORTS.map(s => (
              <button
                key={s.id}
                type="button"
                className={'pill' + (profile.sports.includes(s.id) ? ' active' : '')}
                onClick={() => toggleSport(s.id)}
                style={profile.sports.includes(s.id) ? { background: s.color, borderColor: s.color } : {}}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-accent btn-full" disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer mon profil'}
        </button>
      </form>
    </div>
  )
}
