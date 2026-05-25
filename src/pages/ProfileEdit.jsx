import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SPORTS, LEVELS } from '../lib/constants'
import PageHeader from '../components/PageHeader'
import { defaultAvatarFor } from '../lib/defaultAvatar'

export default function ProfileEdit({ user }) {
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    city: '',
    level: 'Débutant',
    sports: [],
    age: '',
    gender: '',
    years_practice: '',
    weight: '',
    avatar_url: '',
    favorite_fighter: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Erreur : la photo dépasse 5 Mo.')
      return
    }

    setUploading(true)
    setMessage('')
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
      setProfile(p => ({ ...p, avatar_url: pub.publicUrl }))
      setMessage('Photo importée ✓ pense à enregistrer.')
    } catch (err) {
      setMessage('Erreur upload : ' + (err.message || 'inconnue'))
    } finally {
      setUploading(false)
    }
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    // Nettoyage : nombres ou null
    const payload = {
      ...profile,
      id: user.id,
      age: profile.age ? Number(profile.age) : null,
      years_practice: profile.years_practice ? Number(profile.years_practice) : null,
      weight: profile.weight ? Number(profile.weight) : null,
    }
    const { error } = await supabase.from('profiles').upsert(payload)
    setSaving(false)
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Profil enregistré ✓')
      setTimeout(() => navigate('/profile'), 800)
    }
  }

  if (loading) return <div className="loading">Chargement…</div>

  const initials = (profile.full_name || profile.username || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div>
      <PageHeader title="Mon profil" back />

      {message && (
        <div className={'alert ' + (message.startsWith('Erreur') ? 'alert-error' : 'alert-success')}>
          {message}
        </div>
      )}

      <form onSubmit={save}>
        <div className="field">
          <label className="field-label">Pseudo <span style={{ color: 'var(--accent)' }}>*</span></label>
          <input
            className="input"
            value={profile.username || ''}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            required
            minLength={3}
          />
        </div>

        <div className="field">
          <label className="field-label">Nom complet</label>
          <input
            className="input"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
        </div>

        <div className="field-grid-2">
          <div className="field">
            <label className="field-label">Âge</label>
            <input
              type="number"
              min="13"
              max="99"
              className="input"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-label">Genre</label>
            <select
              className="select"
              value={profile.gender || ''}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            >
              <option value="">—</option>
              <option value="H">Homme</option>
              <option value="F">Femme</option>
              <option value="X">Non binaire</option>
            </select>
          </div>
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

        <div className="field-grid-2">
          <div className="field">
            <label className="field-label">Discipline principale</label>
            <select
              className="select"
              value={profile.sports?.[0] || ''}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return
                setProfile(p => ({
                  ...p,
                  sports: [v, ...p.sports.filter(s => s !== v)],
                }))
              }}
            >
              <option value="">—</option>
              {SPORTS.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
            </select>
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
        </div>

        <div className="field-grid-2">
          <div className="field">
            <label className="field-label">Années de pratique</label>
            <input
              type="number"
              min="0"
              max="80"
              className="input"
              value={profile.years_practice || ''}
              onChange={(e) => setProfile({ ...profile, years_practice: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-label">Poids (kg)</label>
            <input
              type="number"
              min="30"
              max="250"
              className="input"
              value={profile.weight || ''}
              onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label">Photo de profil</label>
          <div className="upload-row">
            <div
              className="avatar avatar-lg"
              style={{
                width: 72, height: 72, fontSize: 26,
                backgroundImage: `url(${defaultAvatarFor({ ...profile, id: user?.id })})`,
              }}
            />
            <label className="upload-btn">
              <span className="upload-btn-icon">⤴</span>
              {uploading ? 'IMPORT…' : 'IMPORTER UNE PHOTO'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
          {!profile.avatar_url && (
            <div className="field-help">
              Pas de photo ? On utilise une image IA de combattant{profile.gender === 'F' ? 'e' : ''} à ta place 🤖🥊
            </div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Combattant préféré</label>
          <input
            className="input"
            placeholder="ex: Mike Tyson, Khabib, Teddy Riner…"
            value={profile.favorite_fighter || ''}
            onChange={(e) => setProfile({ ...profile, favorite_fighter: e.target.value })}
            maxLength={80}
          />
        </div>

        <div className="field">
          <label className="field-label">Bio</label>
          <textarea
            className="textarea"
            placeholder="Décris ton style, tes objectifs…"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="field-label">Autres disciplines</label>
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

        <button type="submit" className="btn btn-accent btn-full btn-lg" disabled={saving}>
          {saving ? 'ENREGISTREMENT…' : <>💾 ENREGISTRER</>}
        </button>
      </form>
    </div>
  )
}
