export const SPORTS = [
  { id: 'mma',        label: 'MMA',          category: 'combat', emoji: '🥋', color: '#e63946' },
  { id: 'boxe',       label: 'Boxe',         category: 'combat', emoji: '🥊', color: '#ef4444' },
  { id: 'muay-thai',  label: 'Muay Thaï',    category: 'combat', emoji: '🦵', color: '#f97316' },
  { id: 'kickboxing', label: 'Kickboxing',   category: 'combat', emoji: '👊', color: '#f59e0b' },
  { id: 'jjb',        label: 'Jiu-Jitsu Brésilien', category: 'combat', emoji: '🥋', color: '#3b82f6' },
  { id: 'judo',       label: 'Judo',         category: 'combat', emoji: '🥋', color: '#6366f1' },
  { id: 'lutte',      label: 'Lutte',        category: 'combat', emoji: '🤼', color: '#8b5cf6' },
  { id: 'karate',     label: 'Karaté',       category: 'combat', emoji: '🥋', color: '#10b981' },
  { id: 'taekwondo',  label: 'Taekwondo',    category: 'combat', emoji: '🦶', color: '#14b8a6' },
  { id: 'sambo',      label: 'Sambo',        category: 'combat', emoji: '🥋', color: '#a855f7' },
  { id: 'krav-maga',  label: 'Krav Maga',    category: 'combat', emoji: '🛡️', color: '#0ea5e9' },
  { id: 'savate',     label: 'Savate',       category: 'combat', emoji: '🥾', color: '#ec4899' },
]

export const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Compétiteur']

export const GOALS = ['Sparring', 'Cours communs', 'Coaching', 'Compétitions']

export const CATEGORIES = {
  combat: 'Sports de combat',
}

// Map id → color pour usage rapide
export const SPORT_COLORS = SPORTS.reduce((acc, s) => {
  acc[s.id] = s.color
  return acc
}, {})

// Grandes villes françaises (lat/lng pour la carte)
export const CITIES = [
  { name: 'Paris',           lat: 48.8566, lng: 2.3522 },
  { name: 'Marseille',       lat: 43.2965, lng: 5.3698 },
  { name: 'Lyon',            lat: 45.7640, lng: 4.8357 },
  { name: 'Toulouse',        lat: 43.6047, lng: 1.4442 },
  { name: 'Nice',            lat: 43.7102, lng: 7.2620 },
  { name: 'Nantes',          lat: 47.2184, lng: -1.5536 },
  { name: 'Strasbourg',      lat: 48.5734, lng: 7.7521 },
  { name: 'Montpellier',     lat: 43.6109, lng: 3.8772 },
  { name: 'Bordeaux',        lat: 44.8378, lng: -0.5792 },
  { name: 'Lille',           lat: 50.6292, lng: 3.0573 },
  { name: 'Rennes',          lat: 48.1173, lng: -1.6778 },
  { name: 'Reims',           lat: 49.2583, lng: 4.0317 },
  { name: 'Le Havre',        lat: 49.4944, lng: 0.1079 },
  { name: 'Saint-Étienne',   lat: 45.4397, lng: 4.3872 },
  { name: 'Toulon',          lat: 43.1242, lng: 5.9280 },
  { name: 'Grenoble',        lat: 45.1885, lng: 5.7245 },
  { name: 'Dijon',           lat: 47.3220, lng: 5.0415 },
  { name: 'Angers',          lat: 47.4784, lng: -0.5632 },
  { name: 'Nîmes',           lat: 43.8367, lng: 4.3601 },
  { name: 'Clermont-Ferrand',lat: 45.7772, lng: 3.0870 },
]
