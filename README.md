# Défis Quotidiens - Application Next.js

Application de défis quotidiens personnalisés pour sortir de sa zone de confort.

## 🚀 Technologies

- **Next.js 15** avec App Router
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase** (Auth anonyme + Database)
- **PWA Ready**

## 📋 Prérequis

- Node.js 18+
- Compte Supabase

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.local.example .env.local
```

Puis remplir avec vos clés Supabase :
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Configurer la base de données Supabase :
   - Créer un nouveau projet Supabase
   - Exécuter le script SQL dans `supabase/schema.sql` dans l'éditeur SQL de Supabase
   - Créer un bucket de stockage nommé `challenge-photos` pour les photos

4. Lancer le serveur de développement :
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Fonctionnalités

### MVP (Phase 1)
- ✅ Onboarding en 3 étapes (niveau de confort, domaine, vibe)
- ✅ Défi quotidien personnalisé
- ✅ Système de streak et progression
- ✅ Calendrier visuel des 14 derniers jours
- ✅ Mini-journal après complétion
- ✅ Statistiques (taux de complétion, meilleur streak, etc.)
- ✅ Profil et paramètres
- ✅ Notifications (configuration)

### Structure du projet

```
├── app/                    # Pages Next.js App Router
│   ├── api/               # API Routes
│   ├── home/              # Page principale
│   ├── onboarding/        # Onboarding
│   ├── profile/           # Profil utilisateur
│   └── settings/          # Paramètres
├── components/            # Composants React
│   ├── ui/                # Composants shadcn/ui
│   ├── onboarding/        # Composants onboarding
│   ├── challenge/         # Composants défis
│   └── streak/            # Composants streak
├── lib/                   # Utilitaires
│   ├── supabase/          # Client Supabase
│   └── utils/             # Helpers
├── types/                 # Types TypeScript
└── supabase/              # Schéma SQL
```

## 🗄️ Base de données

Le schéma Supabase inclut :
- `users` - Profils utilisateurs
- `challenges` - Catalogue de défis
- `daily_challenges` - Défis assignés par jour
- `challenge_logs` - Journal des complétions
- `streaks` - Statistiques de streak

## 🔐 Authentification

L'application utilise l'authentification anonyme de Supabase. Chaque utilisateur obtient un ID unique sans nécessiter d'email ou mot de passe.

## 📝 Notes

- Les défis sont générés dynamiquement selon le niveau de confort, le domaine et la progression
- Le streak est calculé automatiquement à chaque complétion
- Les photos sont stockées dans Supabase Storage

## 🚧 À venir (Phase 2)

- Archive complète des défis passés
- Citations motivantes
- Système de badges
- Mode sombre
- Widget iOS/Android

