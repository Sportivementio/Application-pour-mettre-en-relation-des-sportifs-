# 🥊 Sportivement.io

Application web (PWA) qui met en relation des sportifs : sports de combat, sports de raquette, et plus.

---

## 🚀 Guide de déploiement de A à Z

> **Temps total estimé : 1h30 si tu n'as jamais codé.**

### 📋 Prérequis (à installer une seule fois)

1. **Node.js** — Va sur https://nodejs.org et installe la version **LTS**.
2. **Un compte sur 3 services** (tous gratuits) :
   - [GitHub](https://github.com) — pour héberger le code
   - [Supabase](https://supabase.com) — la base de données + chat temps réel
   - [Vercel](https://vercel.com) — l'hébergement du site (connecte-toi avec GitHub)

---

### ÉTAPE 1 — Configurer Supabase (15 min)

1. Sur [supabase.com](https://supabase.com), clique sur **New Project**.
2. Donne-lui un nom (`sportivement`), choisis une région **proche de chez toi** (`Europe West - Paris`), et un mot de passe fort pour la base de données (note-le quelque part).
3. Attends ~2 min que le projet se crée.
4. Dans le menu de gauche, va dans **SQL Editor** → **New query**.
5. Copie-colle **tout le contenu du fichier `sql/schema.sql`** de ce projet et clique sur **Run**. Tu dois voir "Success".
6. Toujours dans Supabase, va dans **Project Settings → API**. Copie ces deux valeurs (tu en auras besoin) :
   - `Project URL`
   - `anon public` key

---

### ÉTAPE 2 — Récupérer le code et le configurer (10 min)

1. Décompresse cette archive sur ton ordinateur.
2. Ouvre un terminal et place-toi dans le dossier :
   ```bash
   cd sportivement
   ```
3. Installe les dépendances :
   ```bash
   npm install
   ```
4. Crée un fichier `.env` à la racine (copie le `.env.example` et renomme-le `.env`), puis remplace les valeurs par celles de Supabase :
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
5. Lance le projet en local pour tester :
   ```bash
   npm run dev
   ```
   Ouvre http://localhost:5173 → tu dois voir l'écran d'inscription. Crée un compte et teste tout.

---

### ÉTAPE 3 — Mettre le code sur GitHub (10 min)

1. Sur GitHub, clique sur **+ → New repository**, nomme-le `sportivement`, et clique sur **Create**.
2. Dans ton terminal (toujours dans le dossier du projet) :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TON-USERNAME/sportivement.git
   git push -u origin main
   ```
   (Remplace `TON-USERNAME` par ton pseudo GitHub.)

---

### ÉTAPE 4 — Déployer sur Vercel (10 min)

1. Sur [vercel.com](https://vercel.com), clique **Add New → Project**.
2. Importe ton repository `sportivement` depuis GitHub.
3. Vercel détecte automatiquement Vite. **Avant de déployer**, ouvre la section **Environment Variables** et ajoute :
   - `VITE_SUPABASE_URL` = ton URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = ta clé anon Supabase
4. Clique **Deploy**. Au bout d'~1 min, ton site est en ligne sur une URL `xxx.vercel.app`.

---

### ÉTAPE 5 — Connecter ton domaine sportivement.io (15 min)

1. Sur Vercel, ouvre ton projet → **Settings → Domains** → ajoute `sportivement.io`.
2. Vercel te donne des valeurs DNS à configurer (généralement un enregistrement `A` et un `CNAME`).
3. Va chez ton registrar (OVH, Gandi, Namecheap…) et ajoute ces DNS sur ton domaine.
4. Attends quelques minutes/heures (max 24h). Vercel installe automatiquement le HTTPS.

---

## ✅ C'est en ligne !

Sur Android comme sur iPhone, tes utilisateurs peuvent maintenant ouvrir ton site dans leur navigateur et faire **"Ajouter à l'écran d'accueil"** → il s'installera comme une vraie app.

---

## 📁 Structure du projet

```
sportivement/
├── public/              ← icônes, manifest PWA, service worker
├── src/
│   ├── components/      ← TopBar, BottomNav, ProfileCard
│   ├── pages/           ← Auth, Discover, Profile, Messages, Conversation
│   ├── lib/             ← client Supabase, constantes (sports)
│   ├── styles/          ← CSS global (design system)
│   ├── App.jsx          ← routing + auth
│   └── main.jsx
├── sql/schema.sql       ← schéma base de données à exécuter dans Supabase
├── .env.example         ← variables d'environnement à renseigner
└── vercel.json          ← configuration du déploiement
```

---

## 🛠️ Évolutions possibles (phase 2)

- Upload de photos de profil (Supabase Storage)
- Géolocalisation pour matcher par distance
- Système de "match" (swipe) avant d'autoriser le chat
- Notifications push (via Supabase + Web Push)
- Création d'événements/séances ouvertes

---

## 🐛 Problèmes fréquents

**"Variables Supabase manquantes"** → Tu as oublié le fichier `.env`, ou tu n'as pas redémarré `npm run dev` après l'avoir créé.

**Le chat ne se met pas à jour en temps réel** → Vérifie dans Supabase → **Database → Replication** que la table `messages` est bien activée pour le realtime (le script SQL le fait automatiquement, mais à vérifier).

**Erreur "row-level security"** → Le script SQL n'a pas été exécuté entièrement. Relance-le.

---

Bonne route avec Sportivement.io 💪
