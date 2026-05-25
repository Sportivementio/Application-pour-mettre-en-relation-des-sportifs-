// Générateur d'avatars SVG par sport + genre
// Chaque avatar = silhouette tête/épaules + accessoires spécifiques au sport pratiqué
// Reconnaissable visuellement : gants de boxe, kimono, mongkon Muay Thaï, etc.

const SIZE = 400
const RED = '#e63946'
const RED_DARK = '#b91c2c'
const SKIN = '#e0a78c'      // ton chair neutre
const BLACK = '#0a0a0b'
const WHITE = '#f4f4f5'

// ===== Fond commun =====
function bg() {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#0a0a0b"/>
        <stop offset="1" stop-color="#1c1c22"/>
      </linearGradient>
      <radialGradient id="glow" cx="200" cy="180" r="180" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#e63946" stop-opacity="0.20"/>
        <stop offset="1" stop-color="#e63946" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <rect width="400" height="400" fill="url(#glow)"/>
  `
}

// ===== Silhouette de base : tête + cou + épaules (différencié H/F) =====
function bodyMale(torsoColor = RED) {
  return `
    <!-- Épaules (larges) -->
    <path d="M 50 400 Q 50 290 200 275 Q 350 290 350 400 Z" fill="${torsoColor}"/>
    <!-- Cou -->
    <rect x="180" y="220" width="40" height="55" fill="${SKIN}"/>
    <!-- Tête -->
    <ellipse cx="200" cy="170" rx="68" ry="78" fill="${SKIN}"/>
    <!-- Cheveux courts -->
    <path d="M 135 145 Q 135 100 200 95 Q 265 100 265 145 Q 265 130 200 125 Q 135 130 135 145 Z" fill="${BLACK}"/>
    <!-- Yeux -->
    <circle cx="180" cy="175" r="4" fill="${BLACK}"/>
    <circle cx="220" cy="175" r="4" fill="${BLACK}"/>
    <!-- Bouche neutre -->
    <path d="M 185 210 Q 200 215 215 210" stroke="${BLACK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `
}

function bodyFemale(torsoColor = RED) {
  return `
    <!-- Épaules (plus fines) -->
    <path d="M 75 400 Q 75 295 200 280 Q 325 295 325 400 Z" fill="${torsoColor}"/>
    <!-- Cou -->
    <rect x="183" y="220" width="34" height="55" fill="${SKIN}"/>
    <!-- Tête -->
    <ellipse cx="200" cy="170" rx="62" ry="74" fill="${SKIN}"/>
    <!-- Cheveux longs (queue de cheval sur le côté) -->
    <path d="M 138 130 Q 138 90 200 87 Q 262 90 262 130 L 262 200 Q 280 230 300 270 Q 290 280 270 270 Q 262 230 262 200 Z" fill="${BLACK}"/>
    <path d="M 138 130 L 138 215 Q 145 220 155 215 L 155 145 Q 200 110 245 145 Q 245 130 200 125 Q 138 130 138 130 Z" fill="${BLACK}"/>
    <!-- Yeux -->
    <circle cx="180" cy="175" r="4" fill="${BLACK}"/>
    <circle cx="220" cy="175" r="4" fill="${BLACK}"/>
    <!-- Bouche / lèvres rouges -->
    <path d="M 185 210 Q 200 217 215 210" stroke="${RED_DARK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `
}

// ===== Accessoires par sport =====
// Chaque accessoire = couche superposée sur la silhouette de base

const SPORT_ACCESSORIES = {
  // 🥊 BOXE — gros gants ronds + casque
  boxe: () => `
    <!-- Casque -->
    <path d="M 128 165 Q 128 95 200 88 Q 272 95 272 165 L 270 200 Q 200 220 130 200 Z"
          fill="#2a2a30" stroke="${BLACK}" stroke-width="2"/>
    <path d="M 128 165 L 130 200 Q 130 215 145 218" fill="none" stroke="${BLACK}" stroke-width="2"/>
    <!-- Gants ronds rouges en bas -->
    <circle cx="95" cy="350" r="32" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <circle cx="305" cy="350" r="32" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <text x="95" y="358" text-anchor="middle" font-family="Impact" font-size="14" fill="${WHITE}">12oz</text>
    <text x="305" y="358" text-anchor="middle" font-family="Impact" font-size="14" fill="${WHITE}">12oz</text>
  `,

  // 🥋 MMA — gants ouverts (mitaines) + shorts cage
  mma: () => `
    <!-- Gants ouverts rectangulaires -->
    <rect x="65" y="330" width="60" height="50" rx="10" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <rect x="275" y="330" width="60" height="50" rx="10" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <!-- Doigts apparents (3 lignes) -->
    <line x1="80" y1="325" x2="80" y2="335" stroke="${SKIN}" stroke-width="6"/>
    <line x1="95" y1="325" x2="95" y2="335" stroke="${SKIN}" stroke-width="6"/>
    <line x1="110" y1="325" x2="110" y2="335" stroke="${SKIN}" stroke-width="6"/>
    <line x1="290" y1="325" x2="290" y2="335" stroke="${SKIN}" stroke-width="6"/>
    <line x1="305" y1="325" x2="305" y2="335" stroke="${SKIN}" stroke-width="6"/>
    <line x1="320" y1="325" x2="320" y2="335" stroke="${SKIN}" stroke-width="6"/>
    <!-- Logo UFC-like sur torse -->
    <text x="200" y="350" text-anchor="middle" font-family="Impact" font-size="22" fill="${WHITE}">MMA</text>
  `,

  // 🦵 MUAY THAÏ — mongkon (couronne) + pra jiad bras + bandages
  'muay-thai': () => `
    <!-- Mongkon (tresse circulaire autour de la tête) -->
    <ellipse cx="200" cy="115" rx="75" ry="20" fill="none" stroke="${RED}" stroke-width="9"/>
    <ellipse cx="200" cy="115" rx="75" ry="20" fill="none" stroke="${RED_DARK}" stroke-width="3" stroke-dasharray="6 4"/>
    <!-- Pendentif central du mongkon -->
    <path d="M 200 130 L 195 145 L 200 158 L 205 145 Z" fill="${RED}"/>
    <!-- Bandages mains -->
    <rect x="70" y="330" width="50" height="45" fill="${WHITE}" stroke="${BLACK}" stroke-width="2"/>
    <rect x="280" y="330" width="50" height="45" fill="${WHITE}" stroke="${BLACK}" stroke-width="2"/>
    <line x1="70" y1="345" x2="120" y2="345" stroke="${BLACK}" stroke-width="1.5"/>
    <line x1="70" y1="360" x2="120" y2="360" stroke="${BLACK}" stroke-width="1.5"/>
    <line x1="280" y1="345" x2="330" y2="345" stroke="${BLACK}" stroke-width="1.5"/>
    <line x1="280" y1="360" x2="330" y2="360" stroke="${BLACK}" stroke-width="1.5"/>
  `,

  // 👊 KICKBOXING — gants + shin guards visibles
  kickboxing: () => `
    <!-- Gants -->
    <ellipse cx="95" cy="345" rx="30" ry="38" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <ellipse cx="305" cy="345" rx="30" ry="38" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <!-- Shin guards (protection tibia) en bas -->
    <rect x="160" y="380" width="30" height="20" rx="4" fill="${WHITE}" stroke="${BLACK}" stroke-width="1.5"/>
    <rect x="210" y="380" width="30" height="20" rx="4" fill="${WHITE}" stroke="${BLACK}" stroke-width="1.5"/>
    <text x="175" y="395" text-anchor="middle" font-family="Impact" font-size="10" fill="${BLACK}">K1</text>
    <text x="225" y="395" text-anchor="middle" font-family="Impact" font-size="10" fill="${BLACK}">K1</text>
  `,

  // 🥋 JJB — kimono col en V + ceinture noire
  jjb: () => `
    <!-- Kimono blanc cassé (recouvre torse) -->
    <path d="M 75 400 Q 75 295 130 275 L 200 320 L 270 275 Q 325 295 325 400 Z"
          fill="#ededed" stroke="${BLACK}" stroke-width="2"/>
    <!-- Col en V -->
    <path d="M 130 275 L 200 360 L 270 275" fill="${SKIN}" stroke="${BLACK}" stroke-width="2.5"/>
    <!-- Ceinture noire -->
    <rect x="105" y="378" width="190" height="20" fill="${BLACK}"/>
    <!-- Bord rouge sur ceinture -->
    <rect x="105" y="396" width="190" height="3" fill="${RED}"/>
    <!-- Patch sur épaule -->
    <rect x="220" y="295" width="35" height="22" fill="${RED}" rx="2"/>
    <text x="237" y="311" text-anchor="middle" font-family="Impact" font-size="12" fill="${WHITE}">JJB</text>
  `,

  // 🥋 JUDO — judogi blanc + ceinture noire (similaire JJB mais sans patch)
  judo: () => `
    <path d="M 75 400 Q 75 295 130 275 L 200 320 L 270 275 Q 325 295 325 400 Z"
          fill="${WHITE}" stroke="${BLACK}" stroke-width="2"/>
    <path d="M 130 275 L 200 365 L 270 275" fill="${SKIN}" stroke="${BLACK}" stroke-width="2.5"/>
    <!-- Ceinture noire avec nœud central -->
    <rect x="105" y="378" width="190" height="22" fill="${BLACK}"/>
    <rect x="185" y="376" width="30" height="28" fill="${BLACK}" stroke="${WHITE}" stroke-width="1"/>
    <!-- JF (Judo France) -->
    <text x="200" y="345" text-anchor="middle" font-family="Impact" font-size="18" fill="${RED}">柔道</text>
  `,

  // 🤼 LUTTE — singlet rouge sans manches
  lutte: () => `
    <!-- Bretelles -->
    <path d="M 145 275 L 130 400" stroke="${RED}" stroke-width="20" stroke-linecap="round"/>
    <path d="M 255 275 L 270 400" stroke="${RED}" stroke-width="20" stroke-linecap="round"/>
    <!-- Corps singlet -->
    <path d="M 145 285 L 255 285 L 280 400 L 120 400 Z" fill="${RED}"/>
    <!-- USA / numéro -->
    <text x="200" y="370" text-anchor="middle" font-family="Impact" font-size="44" fill="${WHITE}">7</text>
  `,

  // 🥋 KARATÉ — karategi blanc léger + ceinture noire
  karate: () => `
    <path d="M 80 400 Q 80 295 130 280 L 200 325 L 270 280 Q 320 295 320 400 Z"
          fill="${WHITE}" stroke="${BLACK}" stroke-width="2"/>
    <path d="M 130 280 L 200 360 L 270 280" fill="${SKIN}" stroke="${BLACK}" stroke-width="2.5"/>
    <rect x="100" y="378" width="200" height="18" fill="${BLACK}"/>
    <text x="200" y="350" text-anchor="middle" font-family="Impact" font-size="22" fill="${RED}">空手</text>
  `,

  // 🦶 TAEKWONDO — dobok blanc col en V noir
  taekwondo: () => `
    <path d="M 80 400 Q 80 295 130 280 L 200 320 L 270 280 Q 320 295 320 400 Z"
          fill="${WHITE}" stroke="${BLACK}" stroke-width="2"/>
    <!-- Col V noir caractéristique -->
    <path d="M 130 280 L 200 360 L 270 280 L 250 270 L 200 320 L 150 270 Z" fill="${BLACK}"/>
    <!-- Ceinture rouge -->
    <rect x="100" y="378" width="200" height="18" fill="${RED}"/>
    <!-- Symbole TKD -->
    <circle cx="200" cy="340" r="14" fill="none" stroke="${RED}" stroke-width="2.5"/>
    <path d="M 186 340 Q 200 326 214 340 Q 200 354 186 340" fill="${BLACK}"/>
  `,

  // 🥋 SAMBO — singlet rouge style soviétique + ceinture
  sambo: () => `
    <!-- Veste sambo (kurtka) rouge -->
    <path d="M 80 400 Q 80 295 130 280 L 200 320 L 270 280 Q 320 295 320 400 Z" fill="${RED}"/>
    <!-- Col -->
    <path d="M 130 280 L 200 350 L 270 280" fill="${BLACK}" stroke="${BLACK}" stroke-width="2"/>
    <!-- Ceinture -->
    <rect x="100" y="380" width="200" height="14" fill="${BLACK}"/>
    <text x="200" y="370" text-anchor="middle" font-family="Impact" font-size="18" fill="${WHITE}">САМБО</text>
  `,

  // 🛡️ KRAV MAGA — t-shirt noir avec logo
  'krav-maga': () => `
    <path d="M 80 400 Q 80 295 130 280 L 200 305 L 270 280 Q 320 295 320 400 Z" fill="${BLACK}"/>
    <!-- Col rond -->
    <path d="M 165 280 Q 200 295 235 280 Q 235 308 200 312 Q 165 308 165 280 Z" fill="${SKIN}"/>
    <!-- Logo étoile rouge sur poitrine -->
    <path d="M 200 330 L 207 350 L 228 350 L 211 363 L 218 383 L 200 370 L 182 383 L 189 363 L 172 350 L 193 350 Z" fill="${RED}"/>
  `,

  // 🥾 SAVATE — gants + chaussures pointues caractéristiques
  savate: () => `
    <!-- Maillot bleu marine ajusté -->
    <path d="M 80 400 Q 80 295 130 280 L 200 305 L 270 280 Q 320 295 320 400 Z" fill="#1e3a8a"/>
    <!-- Col en V -->
    <path d="M 170 280 L 200 320 L 230 280" fill="${SKIN}"/>
    <!-- Gants rouges -->
    <ellipse cx="95" cy="350" rx="25" ry="32" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <ellipse cx="305" cy="350" rx="25" ry="32" fill="${RED}" stroke="${BLACK}" stroke-width="2"/>
    <!-- Chaussures pointues savate -->
    <path d="M 145 380 L 200 380 L 195 400 L 130 400 Z" fill="${BLACK}"/>
    <path d="M 200 380 L 255 380 L 270 400 L 205 400 Z" fill="${BLACK}"/>
    <text x="200" y="370" text-anchor="middle" font-family="Impact" font-size="14" fill="${WHITE}">FR</text>
  `,
}

// ===== Génération de l'avatar complet =====
function generateAvatarSVG(gender, sportId) {
  const accessory = SPORT_ACCESSORIES[sportId]
  const isFemale = gender === 'F'

  // Corps complet (torse rouge + tête + cheveux + visage)
  const body = isFemale ? bodyFemale(RED) : bodyMale(RED)

  // Accessoires DESSUS (gants, casque, kimono qui couvre le torse, etc.)
  const acc = accessory ? accessory() : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${bg()}${body}${acc}</svg>`
}

// btoa-safe pour les caractères unicode (kanji, etc.)
function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

/**
 * Retourne l'URL data: d'un avatar SVG personnalisé selon
 * le sport principal pratiqué + le genre du combattant.
 * Si avatar_url est défini, on le retourne directement.
 */
export function defaultAvatarFor(profile) {
  if (profile?.avatar_url) return profile.avatar_url

  const gender = profile?.gender === 'F' ? 'F' : 'M'  // par défaut M
  const sportId = (profile?.sports || [])[0] || 'mma'  // par défaut mma

  const svg = generateAvatarSVG(gender, sportId)
  return `data:image/svg+xml;base64,${toBase64(svg)}`
}
