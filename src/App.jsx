import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Auth from './pages/Auth'
import Discover from './pages/Discover'
import ProfileView from './pages/ProfileView'
import ProfileEdit from './pages/ProfileEdit'
import Chat from './pages/Chat'
import CityRoom from './pages/CityRoom'
import Conversation from './pages/Conversation'
import Quotes from './pages/Quotes'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="loading" style={{ minHeight: '100vh' }}>Chargement…</div>
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <TopBar user={user} onLogout={handleLogout} />
        <main className="app-main">
          <Routes>
            {!user ? (
              <>
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Discover user={user} />} />
                <Route path="/profile" element={<ProfileView user={user} />} />
                <Route path="/profile/edit" element={<ProfileEdit user={user} />} />
                <Route path="/profile/:id" element={<ProfileView user={user} />} />
                <Route path="/messages" element={<Chat user={user} />} />
                <Route path="/messages/:otherId" element={<Conversation user={user} />} />
                <Route path="/chat/:cityName" element={<CityRoom user={user} />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
        {user && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}
