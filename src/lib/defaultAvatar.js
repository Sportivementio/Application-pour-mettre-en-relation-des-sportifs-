// Génération d'avatars combattants IA via Pollinations
// Pour les profils sans photo, on génère une image IA cohérente
// basée sur le genre + l'ID utilisateur (toujours la même image pour un user donné)

// Prompts variés pour avoir de la diversité visuelle
const PROMPTS_FEMALE = [
  'Female%20MMA%20fighter%20portrait%2C%20fierce%20look%2C%20dramatic%20lighting%2C%20dark%20moody%20background%2C%20cinematic%2C%20photorealistic',
  'Female%20boxer%20portrait%2C%20intense%20eyes%2C%20boxing%20gloves%2C%20dark%20gym%2C%20cinematic%20red%20lighting',
  'Female%20muay%20thai%20fighter%2C%20strong%20pose%2C%20training%20wraps%2C%20dramatic%20portrait%2C%20gritty',
  'Female%20BJJ%20fighter%20in%20black%20gi%2C%20serious%20expression%2C%20dark%20background%2C%20cinematic',
  'Female%20kickboxer%20portrait%2C%20focused%20gaze%2C%20red%20accent%20lighting%2C%20moody%20atmosphere',
]

const PROMPTS_MALE = [
  'Male%20MMA%20fighter%20portrait%2C%20fierce%20look%2C%20dramatic%20lighting%2C%20dark%20moody%20background%2C%20cinematic%2C%20photorealistic',
  'Male%20boxer%20portrait%2C%20intense%20stare%2C%20boxing%20gloves%2C%20dark%20gym%2C%20cinematic%20red%20lighting',
  'Male%20muay%20thai%20fighter%2C%20warrior%20stance%2C%20training%20wraps%2C%20dramatic%20portrait%2C%20gritty',
  'Male%20BJJ%20fighter%20in%20black%20gi%2C%20serious%20expression%2C%20dark%20background%2C%20cinematic',
  'Male%20karate%20fighter%2C%20warrior%20pose%2C%20red%20accent%20lighting%2C%20moody%20atmosphere',
]

const PROMPTS_DEFAULT = [
  'Combat%20sports%20fighter%20portrait%2C%20silhouette%2C%20dark%20background%2C%20red%20accent%20lighting%2C%20cinematic',
  'Martial%20artist%20portrait%2C%20dramatic%20lighting%2C%20dark%20moody%20atmosphere%2C%20cinematic',
]

// Hash simple pour mapper un user ID vers un index de prompt
function hashCode(str) {
  if (!str) return 0
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Retourne l'URL d'un avatar par défaut généré par IA
 * - Si gender = 'F' → image femme combat
 * - Si gender = 'H' → image homme combat
 * - Sinon → image neutre
 * Toujours la même image pour un user donné (basée sur son ID).
 */
export function defaultAvatarFor(profile) {
  if (profile?.avatar_url) return profile.avatar_url

  const gender = profile?.gender
  const pool =
    gender === 'F' ? PROMPTS_FEMALE :
    gender === 'H' ? PROMPTS_MALE :
    PROMPTS_DEFAULT

  const h = hashCode(profile?.id || profile?.username || 'default')
  const prompt = pool[h % pool.length]
  // Pollinations AI : génère une image stable basée sur le seed
  const seed = h
  return `https://image.pollinations.ai/prompt/${prompt}?width=600&height=600&nologo=true&seed=${seed}`
}
