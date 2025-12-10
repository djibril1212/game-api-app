# 🎮 Game Collection API

> **EFREI - M1 DEV2 - NOSQL** | 10 décembre 2025

API RESTful pour gérer une collection de jeux vidéo avec interface graphique.

## 🎬 Démo

![Démo de l'application](./demo.gif)

## ✨ Fonctionnalités

### API RESTful
- ✅ **CRUD complet** - Créer, lire, modifier, supprimer des jeux
- 🔍 **Recherche et filtrage** - Par genre, plateforme, statut, etc.
- 📊 **Statistiques** - Temps de jeu total, score moyen, répartition par genre
- ⭐ **Système de favoris** - Marquer vos jeux préférés
- 📁 **Export JSON** - Télécharger votre collection

### Interface Web
- 📋 Liste des jeux avec cartes visuelles
- ➕ Formulaire d'ajout/modification intuitif
- 🔎 Filtres et recherche en temps réel
- 📈 Dashboard avec statistiques
- 🌙 Thème sombre/clair

## 🛠️ Stack Technique

- **Frontend** : React, TanStack Router, TailwindCSS, shadcn/ui
- **Backend** : Express, TypeScript
- **Base de données** : MongoDB + Mongoose
- **Validation** : Zod

## 🚀 Installation

### Prérequis
- Node.js v18+
- MongoDB (local ou Atlas)

### 1. Cloner et installer

```bash
git clone https://github.com/djibril1212/game-api-app.git
cd game-api-app
npm install
```

### 2. Configuration

Créer les fichiers `.env` :

**apps/server/.env**
```env
PORT=3000
CORS_ORIGIN=http://localhost:3002
DATABASE_URL=mongodb://localhost:27017/game_collection_db
```

**apps/web/.env**
```env
VITE_SERVER_URL=http://localhost:3000
```

### 3. Lancer le projet

```bash
npm run dev
```

- 🌐 **Frontend** : http://localhost:3001
- 🖥️ **API** : http://localhost:3000

## 📚 Documentation API

### Endpoints CRUD

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/games` | Ajouter un jeu |
| `GET` | `/api/games` | Lister tous les jeux |
| `GET` | `/api/games/:id` | Obtenir un jeu |
| `PUT` | `/api/games/:id` | Modifier un jeu |
| `DELETE` | `/api/games/:id` | Supprimer un jeu |

### Endpoints Avancés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/games/:id/favorite` | Toggle favori |
| `GET` | `/api/stats` | Statistiques collection |
| `GET` | `/api/export` | Export JSON |
| `GET` | `/api/filters` | Valeurs pour filtres |

### Filtres de recherche

```
GET /api/games?genre=RPG&plateforme=PC&termine=true&favori=false&search=zelda&sort=metacritic_score&order=desc
```

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `genre` | Filtrer par genre | `RPG`, `Action` |
| `plateforme` | Filtrer par plateforme | `PC`, `PlayStation 5` |
| `termine` | Jeux terminés | `true`, `false` |
| `favori` | Jeux favoris | `true`, `false` |
| `search` | Recherche textuelle | `zelda` |
| `sort` | Champ de tri | `titre`, `annee_sortie`, `metacritic_score` |
| `order` | Ordre de tri | `asc`, `desc` |

### Structure d'un jeu

```json
{
  "_id": "string (auto-généré)",
  "titre": "The Legend of Zelda: Breath of the Wild",
  "genre": ["Action", "Aventure", "RPG"],
  "plateforme": ["Nintendo Switch"],
  "editeur": "Nintendo",
  "developpeur": "Nintendo EPD",
  "annee_sortie": 2017,
  "metacritic_score": 97,
  "temps_jeu_heures": 85,
  "termine": true,
  "favori": true,
  "date_ajout": "2025-12-10T14:00:00.000Z",
  "date_modification": "2025-12-10T14:00:00.000Z"
}
```

### Validation des données

| Champ | Type | Requis | Contraintes |
|-------|------|--------|-------------|
| `titre` | string | ✅ | min 1 caractère |
| `genre` | string[] | ✅ | min 1 élément |
| `plateforme` | string[] | ✅ | min 1 élément |
| `editeur` | string | ✅ | min 1 caractère |
| `developpeur` | string | ✅ | min 1 caractère |
| `annee_sortie` | number | ✅ | 1970 - année actuelle |
| `metacritic_score` | number | ❌ | 0 - 100 |
| `temps_jeu_heures` | number | ❌ | min 0 |
| `termine` | boolean | ❌ | défaut: false |

## 📁 Structure du projet

```
game-api-app/
├── apps/
│   ├── web/                 # Frontend React
│   │   └── src/
│   │       ├── components/  # Composants UI
│   │       ├── lib/         # API client
│   │       └── routes/      # Pages
│   └── server/              # Backend Express
│       └── src/
│           └── index.ts     # Routes API
└── packages/
    └── db/                  # Schémas Mongoose + Zod
        └── src/
            └── index.ts
```

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer tout en développement |
| `npm run dev:web` | Lancer le frontend seul |
| `npm run dev:server` | Lancer le backend seul |
| `npm run build` | Build de production |
| `npm run check-types` | Vérifier les types TypeScript |

## 👨‍💻 Auteur

**Djibril Abaltou** 
