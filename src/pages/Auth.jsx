import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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

  async function handleGoogleSignIn() {
    setError('')
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/',
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // En cas de succès, le navigateur est redirigé vers Google.
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

      {/* Google OAuth */}
      <button
        type="button"
        className="btn-google btn-full"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
        {googleLoading ? 'Redirection…' : 'CONTINUER AVEC GOOGLE'}
      </button>

      <div className="auth-divider">
        <span>OU</span>
      </div>

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
        <button type="submit" className="btn btn-accent btn-full" disabled={loading || googleLoading}>
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
