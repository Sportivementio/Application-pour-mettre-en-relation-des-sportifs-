import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SPORTS } from '../lib/constants'
import { countAttendees } from '../lib/sessions'

// Centre par défaut = France centrale
const FRANCE_CENTER = [46.5, 2.5]
const DEFAULT_ZOOM = 6

// Icône custom rouge pour chaque pin
function makeIcon(session) {
  const sport = SPORTS.find(s => s.id === session.sport)
  const count = countAttendees(session)
  const isFull = session.status === 'full'
  const color = isFull ? '#71717a' : (sport?.color || '#e63946')

  const html = `
    <div style="
      position: relative;
      background: ${color};
      width: 40px;
      height: 40px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #0a0a0b;
      box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-family: 'Oswald', Impact, sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.03em;
      ">${count}/${session.max_participants}</span>
    </div>
  `
  return L.divIcon({
    html,
    className: 'custom-session-icon',
    iconSize: [40, 52],
    iconAnchor: [20, 48],
    popupAnchor: [0, -46],
  })
}

// Adapte le zoom pour afficher tous les pins
function FitBounds({ sessions }) {
  const map = useMap()
  useEffect(() => {
    if (!sessions.length) return
    const bounds = L.latLngBounds(sessions.map(s => [s.latitude, s.longitude]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 })
  }, [sessions, map])
  return null
}

export default function SessionMap({ sessions, onSessionClick }) {
  return (
    <div className="session-map-wrap">
      <MapContainer
        center={FRANCE_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        <FitBounds sessions={sessions} />
        {sessions.map(s => {
          const sport = SPORTS.find(sp => sp.id === s.sport)
          return (
            <Marker
              key={s.id}
              position={[s.latitude, s.longitude]}
              icon={makeIcon(s)}
              eventHandlers={{
                click: () => onSessionClick?.(s),
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'DM Sans, sans-serif', minWidth: 180 }}>
                  <div style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: 14, fontWeight: 700,
                    textTransform: 'uppercase', marginBottom: 4,
                  }}>
                    {sport?.emoji} {sport?.label} · {s.city}
                  </div>
                  <div style={{ fontSize: 12, color: '#555' }}>
                    {new Date(s.session_at).toLocaleString('fr-FR', {
                      weekday: 'short', day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                  <div style={{
                    marginTop: 6,
                    fontSize: 11, fontWeight: 700,
                    color: s.status === 'full' ? '#71717a' : '#e63946',
                    textTransform: 'uppercase',
                  }}>
                    {countAttendees(s)}/{s.max_participants} places · {s.status === 'full' ? 'COMPLET' : 'OUVERT'}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
