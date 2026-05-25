// Avatars par défaut générés via IA (Pollinations)
// 1 image fixe par (sport, genre) → 24 combinaisons total
// Pose d'action spécifique au sport pour qu'on reconnaisse la discipline d'un coup d'œil

const POLLI_BASE = 'https://image.pollinations.ai/prompt/'
const POLLI_OPTS = 'width=600&height=800&nologo=true&model=flux'

// Prompts par sport + genre
// Chaque prompt décrit une pose d'action caractéristique de la discipline
const SPORT_PROMPTS = {
  boxe: {
    M: 'Male boxer throwing right cross punch, full body action pose, boxing gloves, boxing shorts, training wraps, dark moody gym background, dramatic red lighting, photorealistic, cinematic',
    F: 'Female boxer throwing right cross punch, full body action pose, boxing gloves, sports bra and shorts, training wraps, dark moody gym background, dramatic red lighting, photorealistic, cinematic',
  },
  mma: {
    M: 'Male MMA fighter in fighting stance with open fingerless gloves, full body action pose, fight shorts, athletic body, dark octagon cage background, dramatic red lighting, photorealistic, cinematic',
    F: 'Female MMA fighter in fighting stance with open fingerless gloves, full body action pose, sports bra and fight shorts, dark octagon cage background, dramatic red lighting, photorealistic, cinematic',
  },
  'muay-thai': {
    M: 'Male muay thai fighter throwing high knee strike, full body action pose, mongkon headband, traditional thai shorts, hand wraps, dark gym background, dramatic red lighting, photorealistic, cinematic',
    F: 'Female muay thai fighter throwing high knee strike, full body action pose, mongkon headband, traditional thai shorts, sports bra, hand wraps, dark gym background, dramatic red lighting, photorealistic, cinematic',
  },
  kickboxing: {
    M: 'Male kickboxer throwing high roundhouse kick, full body action pose, shin guards, gloves, athletic shorts, dark gym background, dramatic red lighting, photorealistic, cinematic',
    F: 'Female kickboxer throwing high roundhouse kick, full body action pose, shin guards, gloves, sports bra and shorts, dark gym background, dramatic red lighting, photorealistic, cinematic',
  },
  jjb: {
    M: 'Male brazilian jiu jitsu fighter in closed guard position on ground, full body action pose, black gi kimono with black belt, dark mat background, dramatic lighting, photorealistic, cinematic',
    F: 'Female brazilian jiu jitsu fighter in closed guard position on ground, full body action pose, black gi kimono with black belt, dark mat background, dramatic lighting, photorealistic, cinematic',
  },
  judo: {
    M: 'Male judoka performing ippon seoi nage shoulder throw, full body action pose, white judogi with black belt, dramatic dark dojo background, photorealistic, cinematic, dynamic motion',
    F: 'Female judoka performing ippon seoi nage shoulder throw, full body action pose, white judogi with black belt, dramatic dark dojo background, photorealistic, cinematic, dynamic motion',
  },
  lutte: {
    M: 'Male wrestler attempting double leg takedown, full body action pose, red wrestling singlet, wrestling shoes, dark gym mat background, dramatic lighting, photorealistic, cinematic',
    F: 'Female wrestler attempting double leg takedown, full body action pose, red wrestling singlet, wrestling shoes, dark gym mat background, dramatic lighting, photorealistic, cinematic',
  },
  karate: {
    M: 'Male karateka in front stance throwing front kick mae geri, full body action pose, white karategi with black belt, dark dojo background, dramatic lighting, photorealistic, cinematic',
    F: 'Female karateka in front stance throwing front kick mae geri, full body action pose, white karategi with black belt, dark dojo background, dramatic lighting, photorealistic, cinematic',
  },
  taekwondo: {
    M: 'Male taekwondo fighter throwing high flying side kick, full body action pose, white dobok uniform with V neck and red belt, dark dojo background, dramatic lighting, photorealistic, cinematic, dynamic motion',
    F: 'Female taekwondo fighter throwing high flying side kick, full body action pose, white dobok uniform with V neck and red belt, dark dojo background, dramatic lighting, photorealistic, cinematic, dynamic motion',
  },
  sambo: {
    M: 'Male sambo fighter attempting leg lock submission on opponent, full body action pose, red sambo kurtka jacket, wrestling shoes, dark mat background, dramatic lighting, photorealistic, cinematic',
    F: 'Female sambo fighter attempting leg lock submission on opponent, full body action pose, red sambo kurtka jacket, wrestling shoes, dark mat background, dramatic lighting, photorealistic, cinematic',
  },
  'krav-maga': {
    M: 'Male krav maga practitioner in defensive blocking stance, full body action pose, black tactical t-shirt, tactical pants, dark urban background, dramatic red lighting, photorealistic, military style, cinematic',
    F: 'Female krav maga practitioner in defensive blocking stance, full body action pose, black tactical t-shirt, tactical pants, dark urban background, dramatic red lighting, photorealistic, military style, cinematic',
  },
  savate: {
    M: 'Male french savate boxer throwing high front kick with boxing boot, full body action pose, tight fitting uniform, gloves, savate boots, dark gym background, dramatic red lighting, photorealistic, cinematic, dynamic',
    F: 'Female french savate boxer throwing high front kick with boxing boot, full body action pose, tight fitting uniform, gloves, savate boots, dark gym background, dramatic red lighting, photorealistic, cinematic, dynamic',
  },
}

const DEFAULT_PROMPT = {
  M: 'Male martial artist in fighting stance, full body action pose, athletic build, dark moody background, dramatic red lighting, photorealistic, cinematic',
  F: 'Female martial artist in fighting stance, full body action pose, athletic build, dark moody background, dramatic red lighting, photorealistic, cinematic',
}

// Génère un seed stable depuis une string (pour avoir toujours la même image)
function stableSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function getPrompt(sportId, gender) {
  const sp = SPORT_PROMPTS[sportId]
  if (sp) return sp[gender] || sp.M
  return DEFAULT_PROMPT[gender] || DEFAULT_PROMPT.M
}

/**
 * Retourne l'URL d'un avatar IA basé sur (sport principal, genre).
 * Tous les combattants d'un même sport + genre partagent la même image.
 * → Browser cache + Pollinations cache = chargement instantané après 1ère génération.
 */
export function defaultAvatarFor(profile) {
  if (profile?.avatar_url) return profile.avatar_url

  const gender = profile?.gender === 'F' ? 'F' : 'M'
  const sportId = (profile?.sports || [])[0] || 'mma'

  const prompt = getPrompt(sportId, gender)
  // Seed dépend uniquement de (sport, gender) → image identique pour tous
  const seed = stableSeed(`${sportId}_${gender}_v2`)

  return `${POLLI_BASE}${encodeURIComponent(prompt)}?${POLLI_OPTS}&seed=${seed}`
}
