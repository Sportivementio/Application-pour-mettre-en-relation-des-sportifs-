// scripts/generate-avatars.mjs
// Télécharge les 24 avatars cinématiques depuis Pollinations IA
// et les sauve dans public/avatars/ pour servir statiquement en prod
//
// Utilisation : node scripts/generate-avatars.mjs

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'avatars')

const SPORTS = [
  'mma', 'boxe', 'muay-thai', 'kickboxing', 'jjb', 'judo',
  'lutte', 'karate', 'taekwondo', 'sambo', 'krav-maga', 'savate',
]
const GENDERS = ['M', 'F']

// Style commun cinematic painterly
const STYLE_BASE =
  'dark silhouette fighter character full body standing pose, ' +
  'cinematic dramatic backlighting, painterly digital art illustration, ' +
  'faceless shadowed face, moody atmosphere, professional combat sports poster, ' +
  'high contrast, rim lighting, athletic build, no text, no logo'

const GENDER_PROMPTS = {
  M: 'muscular male athletic fighter, broad shoulders, short hair or buzzcut, masculine build',
  F: 'female fighter, athletic toned body, hair in ponytail or bun or braids, feminine athletic build',
}

const SPORT_PROMPTS = {
  boxe: 'wearing boxing gloves and boxing shorts, boxing ring rope visible, blue dramatic backlighting, classic boxing gym atmosphere',
  mma: 'wearing MMA fingerless gloves and fight shorts, dark octagon cage background with chain link, blue and red dramatic lighting',
  'muay-thai': 'wearing muay thai shorts and gloves and mongkon traditional headband, golden warm backlighting, thai gym atmosphere',
  kickboxing: 'wearing kickboxing gloves shin guards and boxing boots, athletic shorts, dark gym background, dramatic lighting',
  jjb: 'wearing black brazilian jiu jitsu gi kimono with black belt tied around waist, arms crossed pose, dark mat training room atmosphere',
  judo: 'wearing white judogi kimono with black belt tied around waist, traditional stance, dramatic dojo lighting',
  karate: 'wearing white karategi kimono with black belt, traditional karate stance, dramatic dojo backlighting',
  taekwondo: 'wearing white taekwondo dobok uniform with V neck collar and red belt, athletic stance, dramatic dojo lighting',
  lutte: 'wearing red wrestling singlet and wrestling shoes, athletic stance, dramatic mat lighting',
  sambo: 'wearing red sambo kurtka jacket and shorts and wrestling shoes, athletic stance, dark dramatic lighting',
  'krav-maga': 'wearing black tactical t-shirt and tactical pants, defensive stance, dark urban dramatic red lighting',
  savate: 'wearing tight fitting french savate boxing uniform with gloves and distinctive savate boxing boots, dramatic gym backlighting',
}

function stableSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function buildUrl(sport, gender) {
  const prompt = `${GENDER_PROMPTS[gender]}, ${SPORT_PROMPTS[sport]}, ${STYLE_BASE}`
  const seed = stableSeed(`${sport}_${gender}_silhouette_v3`)
  // model=flux pour la meilleure qualité (le script tourne UNE fois, on s'en fout du temps)
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=800&nologo=true&model=flux&seed=${seed}`
}

async function downloadOne(sport, gender) {
  const url = buildUrl(sport, gender)
  const filename = `${sport}_${gender}.png`
  const filepath = path.join(OUT_DIR, filename)

  try {
    // Skip si déjà téléchargé
    await fs.access(filepath)
    console.log(`  ⏭  ${filename} existe déjà — skip`)
    return { ok: true, skipped: true }
  } catch {}

  console.log(`  ⏳  Téléchargement ${filename}…`)
  const startTime = Date.now()
  const res = await fetch(url, { signal: AbortSignal.timeout(120000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(filepath, buffer)
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const sizeKB = (buffer.length / 1024).toFixed(1)
  console.log(`  ✅  ${filename} sauvé (${sizeKB} KB, ${elapsed}s)`)
  return { ok: true }
}

async function main() {
  console.log('🥊 Génération des 24 avatars cinématiques Sportivementio…\n')
  await fs.mkdir(OUT_DIR, { recursive: true })

  let success = 0, skipped = 0, failed = 0
  for (const sport of SPORTS) {
    for (const gender of GENDERS) {
      try {
        const r = await downloadOne(sport, gender)
        if (r.skipped) skipped++
        else success++
      } catch (err) {
        failed++
        console.error(`  ❌  ${sport}_${gender}.png : ${err.message}`)
      }
    }
  }

  console.log(`\n🏁  Terminé : ${success} générées, ${skipped} déjà présents, ${failed} échecs`)
  if (failed > 0) console.log(`\n⚠️  Relance le script pour réessayer les images échouées.`)
}

main().catch(err => {
  console.error('Erreur fatale :', err)
  process.exit(1)
})
