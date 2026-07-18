import { useState } from 'react'
import { SPORTS, CITIES } from '../lib/constants'
import { createSession } from '../lib/sessions'

// Générer une date par défaut : demain à 18h00 (local)
function defaultDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(18, 0, 0, 0)
  return d.toISOString().slice(0, 16) // format datetime-local
}

export default function CreateSessionModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({
    city: 'Paris',
    location_details: '',
    sport: 'mma',
    session_at: defaultDate(),
    duration_minutes: 60,
    max_participants: 4,
    equipment_provided: false,
    equipment_details: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const city = CITIES.find(c => c.name === form.city)
    if (!city) {
      setError('Ville invalide')
      setSaving(false)
      return
    }

    const payload = {
      creator_id: user.id,
      city: form.city,
      latitude: city.lat,
      longitude: city.lng,
      location_details: form.location_details.trim() || null,
      sport: form.sport,
      session_at: new Date(form.session_at).toISOString(),
      duration_minutes: Number(form.duration_minutes),
      max_participants: Number(form.max_participants),
      equipment_provided: form.equipment_provided,
      equipment_details: form.equipment_details.trim() || null,
      status: 'open',
    }

    const { data, error } = await createSession(payload)
    setSaving(false)
    if (error) {
      setError('Erreur : ' + error.message)
      return
    }
    onCreated?.(data)
    onClose?.()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Créer une session</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-grid-2">
            <div className="field">
              <label className="field-label">Ville</label>
              <select
                className="select"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                required
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Discipline</label>
              <select
                className="select"
                value={form.sport}
                onChange={e => setForm({ ...form, sport: e.target.value })}
                required
              >
                {SPORTS.map(s => (
                  <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Lieu précis</label>
            <input
              className="input"
              placeholder="ex: Gym Elite, 24 rue de la Boxe"
              value={form.location_details}
              onChange={e => setForm({ ...form, location_details: e.target.value })}
              maxLength={200}
            />
          </div>

          <div className="field-grid-2">
            <div className="field">
              <label className="field-label">Date & heure</label>
              <input
                type="datetime-local"
                className="input"
                value={form.session_at}
                onChange={e => setForm({ ...form, session_at: e.target.value })}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="field">
              <label className="field-label">Durée</label>
              <select
                className="select"
                value={form.duration_minutes}
                onChange={e => setForm({ ...form, duration_minutes: e.target.value })}
              >
                <option value={30}>30 min</option>
                <option value={60}>1 h</option>
                <option value={90}>1 h 30</option>
                <option value={120}>2 h</option>
                <option value={180}>3 h</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Places max</label>
            <select
              className="select"
              value={form.max_participants}
              onChange={e => setForm({ ...form, max_participants: e.target.value })}
            >
              {[2, 3, 4, 6, 8, 10, 12, 16, 20].map(n => (
                <option key={n} value={n}>{n} personnes</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Équipement</label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <button
                type="button"
                className={'pill' + (form.equipment_provided ? ' active' : '')}
                style={form.equipment_provided ? { background: '#22c55e', borderColor: '#22c55e' } : {}}
                onClick={() => setForm({ ...form, equipment_provided: true })}
              >✓ Fourni sur place</button>
              <button
                type="button"
                className={'pill' + (!form.equipment_provided ? ' active' : '')}
                onClick={() => setForm({ ...form, equipment_provided: false })}
              >📦 Apporter le sien</button>
            </div>
            <input
              className="input"
              placeholder={form.equipment_provided
                ? "Précisions (ex: gants dispo, kimonos loués…)"
                : "Ce qu'il faut apporter (gants, kimono, protège-dents…)"}
              value={form.equipment_details}
              onChange={e => setForm({ ...form, equipment_details: e.target.value })}
              maxLength={200}
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent btn-full btn-lg"
            disabled={saving}
          >
            {saving ? 'CRÉATION…' : '🥊 CRÉER LA SESSION'}
          </button>
        </form>
      </div>
    </div>
  )
}
