import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        })
        if (error) throw error
        // Crée le profil
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            username,
            full_name: username,
          })
        }
        navigate('/profile/edit')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 460, margin: '0 auto' }}>
      <div className="hero-banner">
        <div className="hero-banner-content">
          <span className="hero-banner-badge">⚡ Sports de combat</span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(36px, 8vw, 56px)', margin: 0 }}>
            {mode === 'signup'
              ? <>Rejoins<br/>l'<span className="hero-accent">arène</span></>
              : <>Heureux<br/>de te <span className="hero-accent">revoir</span></>}
          </h1>
        </div>
      </div>
      <p className="text-muted" style={{ marginBottom: 28, fontSize: 15 }}>
        {mode === 'signup'
          ? 'Crée ton compte et trouve un partenaire pour ton prochain sparring, cours ou compétition.'
          : 'Connecte-toi pour retrouver ta communauté de combattants.'}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card-elevated">
        {mode === 'signup' && (
          <div className="field">
            <label className="field-label">Nom d'utilisateur</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: marie_boxe"
              required
              minLength={3}
            />
          </div>
        )}
        <div className="field">
          <label className="field-label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="field-label">Mot de passe</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-accent btn-full" disabled={loading}>
          {loading ? '…' : (mode === 'signup' ? 'Créer mon compte' : 'Se connecter')}
        </button>
      </form>

      <p className="text-center text-muted" style={{ marginTop: 20 }}>
        {mode === 'signup' ? 'Déjà inscrit ?' : 'Pas encore de compte ?'}{' '}
        <button
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          style={{ color: 'var(--accent)', fontWeight: 600 }}
        >
          {mode === 'signup' ? 'Se connecter' : 'S\'inscrire'}
        </button>
      </p>
    </div>
  )
}
