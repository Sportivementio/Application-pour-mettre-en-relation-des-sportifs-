// 100 faits surprenants sur les sports de combat
// sport : boxe | mma | jjb | judo | karate | muay-thai | lutte | kickboxing | general

export const FACTS = [
  // ===== BOXE =====
  { id: 1, text: "Le plus long combat de boxe officiel a duré 7 heures et 19 minutes, en 1893 entre Andy Bowen et Jack Burke.", sport: "boxe", emoji: "🥊" },
  { id: 2, text: "Le record du plus rapide KO en boxe pro est de 4 secondes (Mike Collins vs Pat Brownson, 1947).", sport: "boxe", emoji: "🥊" },
  { id: 3, text: "Muhammad Ali a refusé d'aller au Vietnam en 1967 et a perdu 4 ans de carrière au sommet de son art.", sport: "boxe", emoji: "🥊" },
  { id: 4, text: "Mike Tyson est devenu champion du monde poids lourds à 20 ans, le plus jeune de l'histoire.", sport: "boxe", emoji: "🥊" },
  { id: 5, text: "Un boxeur peut perdre jusqu'à 4 kg pendant un seul combat à cause de la sueur.", sport: "boxe", emoji: "🥊" },
  { id: 6, text: "Le coup de poing le plus rapide enregistré était à 72 km/h, par Keith Liddell.", sport: "boxe", emoji: "🥊" },
  { id: 7, text: "Floyd Mayweather a terminé sa carrière invaincue : 50 victoires - 0 défaite.", sport: "boxe", emoji: "🥊" },
  { id: 8, text: "Le ring de boxe est carré… mais on l'appelle 'ring' (cercle) car les combats se déroulaient en cercle avant 1838.", sport: "boxe", emoji: "🥊" },
  { id: 9, text: "Un gant de boxe pèse entre 8 et 16 oz (230 à 450 g) selon la catégorie.", sport: "boxe", emoji: "🥊" },
  { id: 10, text: "Avant 1865, la boxe se pratiquait à mains nues, sans gants ni rounds définis.", sport: "boxe", emoji: "🥊" },
  { id: 11, text: "Bernard Hopkins a remporté un titre mondial à 49 ans, devenant le plus vieux champion du monde.", sport: "boxe", emoji: "🥊" },
  { id: 12, text: "Le combat Ali vs Frazier 'Thrilla in Manila' de 1975 est considéré comme le plus brutal de l'histoire.", sport: "boxe", emoji: "🥊" },
  { id: 13, text: "Manny Pacquiao est l'unique boxeur à avoir gagné des titres dans 8 catégories de poids différentes.", sport: "boxe", emoji: "🥊" },
  { id: 14, text: "Les femmes ont été interdites de boxe olympique jusqu'en… 2012 à Londres.", sport: "boxe", emoji: "🥊" },
  { id: 15, text: "Un combat de boxe pro dure jusqu'à 12 rounds de 3 minutes, soit 36 min d'action max.", sport: "boxe", emoji: "🥊" },

  // ===== MMA / UFC =====
  { id: 16, text: "L'UFC 1 en 1993 n'avait quasiment aucune règle : pas de catégories de poids, pas de rounds, pas de gants.", sport: "mma", emoji: "🥋" },
  { id: 17, text: "Royce Gracie, 78 kg, a battu des adversaires de 100 kg+ aux premiers UFC grâce au JJB.", sport: "mma", emoji: "🥋" },
  { id: 18, text: "Le record du plus rapide KO en UFC est de 5 secondes (Jorge Masvidal vs Ben Askren, 2019).", sport: "mma", emoji: "🥋" },
  { id: 19, text: "Khabib Nurmagomedov a pris sa retraite invaincu : 29 victoires - 0 défaite.", sport: "mma", emoji: "🥋" },
  { id: 20, text: "Une cage d'UFC mesure 9 mètres de diamètre et 1,80 mètres de hauteur.", sport: "mma", emoji: "🥋" },
  { id: 21, text: "Conor McGregor est le 1er athlète de l'UFC à avoir détenu 2 ceintures simultanément.", sport: "mma", emoji: "🥋" },
  { id: 22, text: "Anderson Silva détient le record de la plus longue série de victoires en UFC : 16 combats.", sport: "mma", emoji: "🥋" },
  { id: 23, text: "Le terme 'MMA' (Mixed Martial Arts) n'a été popularisé qu'à partir de 2002.", sport: "mma", emoji: "🥋" },
  { id: 24, text: "Avant 2001, l'UFC était illégal dans la plupart des États américains.", sport: "mma", emoji: "🥋" },
  { id: 25, text: "Amanda Nunes a battu 5 anciennes championnes UFC dans 2 catégories différentes.", sport: "mma", emoji: "🥋" },
  { id: 26, text: "Les combattants MMA pratiquent en moyenne 3 disciplines différentes pour être complets.", sport: "mma", emoji: "🥋" },
  { id: 27, text: "Jon Jones a perdu son seul combat… par disqualification, jamais battu réellement.", sport: "mma", emoji: "🥋" },
  { id: 28, text: "Israel Adesanya a une danse de victoire qu'il a apprise en regardant Naruto.", sport: "mma", emoji: "🥋" },
  { id: 29, text: "Le combat MMA féminin n'a été légalisé dans les grands événements US qu'en 2013.", sport: "mma", emoji: "🥋" },
  { id: 30, text: "Stipe Miocic était pompier à temps plein pendant qu'il était champion poids lourds UFC.", sport: "mma", emoji: "🥋" },

  // ===== JJB =====
  { id: 31, text: "Le JJB est né au Brésil dans les années 1920 grâce à Hélio Gracie, malingre, qui adapta le judo.", sport: "jjb", emoji: "🥋" },
  { id: 32, text: "La famille Gracie a relevé pendant des décennies des 'Gracie Challenges' contre n'importe quel art martial.", sport: "jjb", emoji: "🥋" },
  { id: 33, text: "Une ceinture noire de JJB demande en moyenne 10 à 15 ans de pratique régulière.", sport: "jjb", emoji: "🥋" },
  { id: 34, text: "Le système des barrettes (degrés) sur la ceinture vient du judo, adapté au JJB.", sport: "jjb", emoji: "🥋" },
  { id: 35, text: "On dit que 'le kimono ne fait pas le combattant'... mais un kimono de compétition coûte 100 à 300 €.", sport: "jjb", emoji: "🥋" },
  { id: 36, text: "Le JJB se pratique aussi sans kimono (no-gi), avec des règles légèrement différentes.", sport: "jjb", emoji: "🥋" },
  { id: 37, text: "Marcelo Garcia, célèbre champion, pèse 75 kg et bat régulièrement des poids lourds.", sport: "jjb", emoji: "🥋" },
  { id: 38, text: "Le tournoi le plus prestigieux du JJB est le Mundial (championnat du monde IBJJF).", sport: "jjb", emoji: "🥋" },
  { id: 39, text: "Hélio Gracie a continué à entraîner et combattre jusqu'à 90 ans passés.", sport: "jjb", emoji: "🥋" },
  { id: 40, text: "Au JJB, on n'apprend pas à frapper : c'est 100% lutte au sol et soumissions.", sport: "jjb", emoji: "🥋" },

  // ===== JUDO =====
  { id: 41, text: "Le judo a été créé en 1882 par Jigoro Kano au Japon, en simplifiant le jiu-jitsu traditionnel.", sport: "judo", emoji: "🥋" },
  { id: 42, text: "Le judo est devenu sport olympique en 1964 aux Jeux de Tokyo.", sport: "judo", emoji: "🥋" },
  { id: 43, text: "Teddy Riner a remporté 11 titres mondiaux, un record absolu.", sport: "judo", emoji: "🥋" },
  { id: 44, text: "Teddy Riner a passé plus de 10 ans sans perdre un seul combat (154 victoires consécutives).", sport: "judo", emoji: "🥋" },
  { id: 45, text: "Le judo a été le 1er sport oriental admis aux JO.", sport: "judo", emoji: "🥋" },
  { id: 46, text: "Au Japon, le judo est enseigné obligatoirement à l'école.", sport: "judo", emoji: "🥋" },
  { id: 47, text: "Le 'ippon' (point parfait) met fin immédiatement au combat de judo.", sport: "judo", emoji: "🥋" },
  { id: 48, text: "Le kimono de judo s'appelle 'judogi' et est plus épais que celui du karaté.", sport: "judo", emoji: "🥋" },
  { id: 49, text: "Anton Geesink (NL) fut en 1964 le premier non-japonais champion olympique de judo.", sport: "judo", emoji: "🥋" },
  { id: 50, text: "Vladimir Poutine est ceinture noire 8e dan de judo.", sport: "judo", emoji: "🥋" },

  // ===== KARATÉ =====
  { id: 51, text: "Le karaté est né à Okinawa (Japon) sous influence chinoise au 17e siècle.", sport: "karate", emoji: "🥋" },
  { id: 52, text: "Le mot 'karaté' signifie littéralement 'main vide'.", sport: "karate", emoji: "🥋" },
  { id: 53, text: "Mas Oyama, fondateur du Kyokushin, a tué plusieurs taureaux à mains nues pour démontrer la puissance.", sport: "karate", emoji: "🥋" },
  { id: 54, text: "Mas Oyama s'est isolé en montagne pendant 18 mois pour s'entraîner intensivement.", sport: "karate", emoji: "🥋" },
  { id: 55, text: "Le karaté n'a fait ses débuts olympiques qu'en 2020 (Tokyo).", sport: "karate", emoji: "🥋" },
  { id: 56, text: "Il existe plus de 80 styles de karaté différents (Shotokan, Goju-ryu, Wado-ryu...).", sport: "karate", emoji: "🥋" },
  { id: 57, text: "Pour casser une planche en karaté, il faut frapper avec une vitesse de ~9 m/s.", sport: "karate", emoji: "🥋" },
  { id: 58, text: "Le kiai (cri du karatéka) augmente la puissance du coup en contractant les abdominaux.", sport: "karate", emoji: "🥋" },

  // ===== MUAY THAÏ =====
  { id: 59, text: "Le Muay Thaï est appelé 'l'art des huit membres' car il utilise poings, pieds, coudes et genoux.", sport: "muay-thai", emoji: "🦵" },
  { id: 60, text: "Le Muay Thaï est sport national de Thaïlande et a plus de 2000 ans d'histoire.", sport: "muay-thai", emoji: "🦵" },
  { id: 61, text: "Les boxeurs thaï commencent souvent à combattre dès l'âge de 6-8 ans en Thaïlande.", sport: "muay-thai", emoji: "🦵" },
  { id: 62, text: "Avant chaque combat, le Muay Thaï impose un rituel sacré : le Wai Khru Ram Muay.", sport: "muay-thai", emoji: "🦵" },
  { id: 63, text: "Buakaw Banchamek, légende thaï, possédait à 20 ans déjà plus de 200 combats pro.", sport: "muay-thai", emoji: "🦵" },
  { id: 64, text: "Un coup de genou bien placé en Muay Thaï peut générer plus de 1000 newtons d'impact.", sport: "muay-thai", emoji: "🦵" },

  // ===== LUTTE =====
  { id: 65, text: "La lutte est le sport le plus ancien : représentée dans des grottes datant de 15 000 ans avant J-C.", sport: "lutte", emoji: "🤼" },
  { id: 66, text: "La lutte gréco-romaine et la lutte libre sont 2 disciplines distinctes aux JO.", sport: "lutte", emoji: "🤼" },
  { id: 67, text: "Aleksandr Karelin (Russie) a dominé la lutte gréco-romaine pendant 13 ans sans perdre.", sport: "lutte", emoji: "🤼" },
  { id: 68, text: "Dan Gable (USA) a perdu son seul match en carrière universitaire... 117 victoires - 1 défaite.", sport: "lutte", emoji: "🤼" },
  { id: 69, text: "La lutte était déjà présente aux premiers JO antiques de 776 av. J-C.", sport: "lutte", emoji: "🤼" },
  { id: 70, text: "Beaucoup de combattants UFC dominants viennent de la lutte (Khabib, GSP, Cormier...).", sport: "lutte", emoji: "🤼" },

  // ===== KICKBOXING =====
  { id: 71, text: "Le kickboxing moderne est né dans les années 1970 aux USA, mix de karaté + boxe.", sport: "kickboxing", emoji: "👊" },
  { id: 72, text: "Le K-1 (compétition japonaise mythique) a popularisé le kickboxing dans les années 1990-2000.", sport: "kickboxing", emoji: "👊" },
  { id: 73, text: "Le kickboxing est aujourd'hui une excellente base pour passer au MMA.", sport: "kickboxing", emoji: "👊" },
  { id: 74, text: "Ramon Dekkers (NL), surnommé 'Diamond', est considéré comme l'un des plus grands non-thaï à briller en Muay Thaï.", sport: "kickboxing", emoji: "👊" },

  // ===== GÉNÉRAL / DIVERS =====
  { id: 75, text: "Bruce Lee pouvait faire des pompes uniquement sur deux doigts (le pouce et l'index).", sport: "general", emoji: "🐉" },
  { id: 76, text: "Bruce Lee est mort à 32 ans, mais son influence sur les arts martiaux modernes est colossale.", sport: "general", emoji: "🐉" },
  { id: 77, text: "Le mot 'judo' signifie 'voie de la souplesse' en japonais.", sport: "general", emoji: "🐉" },
  { id: 78, text: "Les gladiateurs romains s'entraînaient dans des écoles spécialisées appelées 'ludi'.", sport: "general", emoji: "🐉" },
  { id: 79, text: "Au Japon, devenir samouraï demandait la maîtrise de plusieurs arts martiaux.", sport: "general", emoji: "🐉" },
  { id: 80, text: "Les ceintures de couleur ont été inventées au judo, puis reprises par tous les arts martiaux.", sport: "general", emoji: "🐉" },
  { id: 81, text: "Une ceinture noire ne signifie pas qu'on est expert : c'est la fin du début.", sport: "general", emoji: "🐉" },
  { id: 82, text: "La pratique des arts martiaux réduit le stress et augmente la confiance en soi (étude Harvard 2018).", sport: "general", emoji: "🐉" },
  { id: 83, text: "30 minutes de boxe brûlent en moyenne 400 à 500 calories.", sport: "general", emoji: "🐉" },
  { id: 84, text: "Le Krav Maga est un art martial créé par l'armée israélienne dans les années 1940.", sport: "general", emoji: "🐉" },
  { id: 85, text: "La capoeira (Brésil) est un mélange unique de danse et art martial né dans les plantations d'esclaves.", sport: "general", emoji: "🐉" },
  { id: 86, text: "Le sumo japonais a plus de 1500 ans d'histoire et reste un sport sacré shinto.", sport: "general", emoji: "🐉" },
  { id: 87, text: "Le taekwondo est devenu olympique en 2000 à Sydney.", sport: "general", emoji: "🐉" },
  { id: 88, text: "Le sambo (URSS) a été créé pour former l'Armée Rouge dans les années 1920.", sport: "general", emoji: "🐉" },
  { id: 89, text: "La savate (boxe française) date du 18e siècle et utilise pieds + poings.", sport: "general", emoji: "🐉" },
  { id: 90, text: "Le terme 'kung-fu' désigne en réalité 'maîtrise acquise par le travail', pas un art martial spécifique.", sport: "general", emoji: "🐉" },
  { id: 91, text: "Les samouraïs maîtrisaient en moyenne 18 disciplines martiales (le 'bugei juhappan').", sport: "general", emoji: "🐉" },
  { id: 92, text: "Le ninjutsu n'était pas un art martial mais un ensemble de techniques d'espionnage et survie.", sport: "general", emoji: "🐉" },
  { id: 93, text: "Le rocky balboa de Sylvester Stallone est inspiré du vrai boxeur Chuck Wepner.", sport: "general", emoji: "🐉" },
  { id: 94, text: "Pratiquer un art martial régulièrement améliore la concentration de 40% (étude japonaise 2015).", sport: "general", emoji: "🐉" },
  { id: 95, text: "L'âge moyen pour débuter en MMA pro est de 25 ans aujourd'hui.", sport: "general", emoji: "🐉" },
  { id: 96, text: "Une ceinture noire 10e dan en judo a été décernée à seulement 15 personnes dans l'histoire.", sport: "general", emoji: "🐉" },
  { id: 97, text: "En Thaïlande, les enfants âgés de 5 ans peuvent déjà avoir leur premier combat officiel.", sport: "general", emoji: "🐉" },
  { id: 98, text: "Les femmes représentent 30 % des pratiquants d'arts martiaux dans le monde, en hausse constante.", sport: "general", emoji: "🐉" },
  { id: 99, text: "L'aïkido est l'un des seuls arts martiaux où l'objectif n'est pas de blesser l'adversaire.", sport: "general", emoji: "🐉" },
  { id: 100, text: "Plus de 200 millions de personnes pratiquent un art martial dans le monde aujourd'hui.", sport: "general", emoji: "🐉" },
]

// Filtrer les faits par sport
export function factsBySport(sportId) {
  if (!sportId || sportId === 'all') return FACTS
  return FACTS.filter(f => f.sport === sportId)
}

// Fait aléatoire
export function randomFact() {
  return FACTS[Math.floor(Math.random() * FACTS.length)]
}
