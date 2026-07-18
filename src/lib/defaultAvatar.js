// Avatars cinématiques pré-générés (script scripts/generate-avatars.mjs)
// Servis statiquement depuis /public/avatars/ → chargement instantané

const SPORTS_AVAILABLE = new Set([
  'mma', 'boxe', 'muay-thai', 'kickboxing', 'jjb', 'judo',
  'lutte', 'karate', 'taekwondo', 'sambo', 'krav-maga', 'savate',
])

/**
 * Retourne l'URL d'un avatar pré-généré localement.
 * → Photo perso si uploadée, sinon avatar IA cinématique selon (sport, genre).
 */
export function defaultAvatarFor(profile) {
  if (profile?.avatar_url) return profile.avatar_url

  const gender = profile?.gender === 'F' ? 'F' : 'M'
  // Premier sport pratiqué = sport principal pour l'avatar
  const sportRaw = (profile?.sports || [])[0]
  const sportId = SPORTS_AVAILABLE.has(sportRaw) ? sportRaw : 'mma'

  return `/avatars/${sportId}_${gender}.png`
}
