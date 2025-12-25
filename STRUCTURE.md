# 📁 Structure Complète du Projet Pharma Scanner

```
pharma-scanner/
│
├── 📄 Configuration de base
│   ├── package.json                # Dépendances et scripts npm
│   ├── vite.config.js              # Configuration Vite (build tool)
│   ├── tsconfig.json               # Configuration TypeScript
│   ├── tsconfig.node.json          # Config TS pour Vite
│   ├── .gitignore                  # Fichiers à ignorer Git
│   ├── .env.example                # Variables d'environnement exemple
│   │
│   ├── 📜 Scripts de lancement
│   ├── start.sh                    # Démarrage Linux/Mac
│   └── start.bat                   # Démarrage Windows
│
├── 📚 Documentation
│   ├── README.md                   # 📖 Documentation principale
│   ├── QUICKSTART.md               # ⚡ Démarrage rapide (5 min)
│   ├── GUIDE_UTILISATEUR.html      # 👥 Guide pour utilisateurs finaux
│   ├── CHECKLIST.md                # ✅ Checklist développement
│   ├── ARCHITECTURE.md             # (À créer si besoin)
│   └── STRUCTURE.md                # (Ce fichier)
│
├── 🌐 Frontend Web (Principal)
│   ├── index.html                  # Fichier HTML principal
│   │
│   ├── 📁 src/                     # Code source Vue
│   │   ├── main.js                 # Point d'entrée Vue.js
│   │   ├── App.vue                 # Composant racine + Navigation
│   │   ├── style.scss              # 🎨 Styles globaux
│   │   │
│   │   ├── 🧩 components/          # Composants réutilisables
│   │   │   └── ProductForm.vue     # Formulaire produit (modal)
│   │   │
│   │   ├── 📄 views/               # Pages (routing)
│   │   │   ├── Dashboard.vue       # Tableau de bord (statistiques)
│   │   │   ├── Products.vue        # Catalogue produits
│   │   │   ├── ProductDetail.vue   # Fiche détails produit
│   │   │   └── ImportExport.vue    # Sauvegarde/restauration
│   │   │
│   │   ├── 🛣️ router/              # Routage
│   │   │   └── index.js            # Configuration Vue Router
│   │   │
│   │   ├── 💾 stores/              # Gestion d'état (Pinia)
│   │   │   └── productStore.js     # Store produits + logique
│   │   │
│   │   ├── 📦 db/                  # Couche données
│   │   │   └── database.js         # IndexedDB wrapper
│   │   │
│   │   └── 🌍 i18n/                # Multilingue
│   │       ├── index.js            # Configuration Vue-i18n
│   │       └── locales/
│   │           ├── fr.json         # 🇫🇷 Traductions français
│   │           └── en.json         # 🇬🇧 Traductions anglais
│   │
│   ├── 📁 public/                  # Assets statiques
│   │   └── favicon.ico             # Icône navigateur
│   │
│   └── 📁 dist/                    # Build production (généré)
│       ├── index.html
│       ├── js/
│       └── css/
│
├── 🧪 Tests & Outils
│   ├── tests.js                    # Tests unitaires simples
│   └── (À étendre)
│
└── 📁 src-tauri/                   # (Optionnel) Build desktop
    └── (Structure Tauri future)
```

## 📊 Flux de Données

```
┌─────────────────────────────────────┐
│          Navigateur Web             │
├─────────────────────────────────────┤
│   Vue 3 (Composants + Templates)    │
├─────────────────────────────────────┤
│         Pinia Store                 │
│   (productStore.js)                 │
├─────────────────────────────────────┤
│       IndexedDB Database            │
│   (stockage local navigateur)        │
└─────────────────────────────────────┘
         ↑
         │ Pas de réseau!
         │ Offline complete
         ↓
   Fichier local JSON
   (export/import)
```

## 🎯 Points d'Entrée

### Par Fichier
| Fichier | Rôle | Modifié pour |
|---------|------|------------|
| `index.html` | HTML principal | Ajouter head/meta |
| `src/main.js` | Initialisation Vue | Ajouter plugins |
| `src/App.vue` | Layout principal | Menu, langue |
| `package.json` | Scripts & dépendances | Ajouter packages |

### Par Fonctionnalité
| Fonctionnalité | Fichiers | Localisation |
|----------------|----------|------------|
| Tableau de bord | Dashboard.vue | `src/views/` |
| Produits | Products.vue | `src/views/` |
| Formulaire | ProductForm.vue | `src/components/` |
| Données | database.js | `src/db/` |
| État | productStore.js | `src/stores/` |
| Langues | i18n/*.json | `src/i18n/locales/` |

## 🔄 Architecture Couches

```
┌─────────────────────────────────────┐
│         PRÉSENTATION                │
│   Vue Components (UI/UX)            │
├─────────────────────────────────────┤
│         LOGIQUE MÉTIER              │
│   productStore.js (Pinia)           │
├─────────────────────────────────────┤
│         ACCÈS DONNÉES               │
│   database.js (IndexedDB)           │
├─────────────────────────────────────┤
│         STOCKAGE LOCAL              │
│   IndexedDB + localStorage          │
└─────────────────────────────────────┘
```

## 📱 Composants Vue

### Composants Pages (Views)
```
App.vue
├── Dashboard.vue      (Tableau statistiques)
├── Products.vue       (Liste + search/filter)
├── ProductDetail.vue  (Détails complets)
└── ImportExport.vue   (Sauvegarde/restauration)
```

### Composants Réutilisables
```
ProductForm.vue       (Modal d'ajout/édition)
```

### Composants Globaux (Auto)
- (Aucun pour l'instant, utilise composants inline)

## 🎨 Styles

### Architecture CSS
```
style.scss (Global)
├── Reset (* { })
├── Typography (body, h1-h6)
├── Buttons (.btn-*)
├── Forms (.form-group)
├── Cards (.card)
├── Alerts (.alert-*)
├── Modal (.modal)
├── Tables (table)
└── Utilities (.text-*, .mt-*, etc)
```

### Par Composant
Chaque .vue a son `<style scoped>` pour isolation CSS

## 🌍 Multilingue

### Fichiers i18n
```
src/i18n/
├── index.js              # Config vue-i18n
└── locales/
    ├── fr.json           # Clés français
    └── en.json           # Clés anglais
```

### Clés Traduction Principales
```
nav.*              → Navigation
dashboard.*        → Tableau de bord
products.*         → Produits
productForm.*      → Formulaire
importExport.*     → Import/Export
validation.*       → Messages erreur
common.*           → Termes communs
```

## 📦 Dépendances Principales

```
Production:
  - vue: ^3.4.0              (Framework)
  - vue-router: ^4.2.0       (Routing)
  - pinia: ^2.1.0            (State management)
  - vue-i18n: ^9.8.0         (Traductions)
  - @tauri-apps/api: ^1.5.3  (API Tauri, optionnel)

Dev:
  - vite: ^5.0.0             (Build tool)
  - @vitejs/plugin-vue: ^5.0 (Plugin Vue)
  - sass: ^1.70.0            (SCSS)
```

## 🚀 Cycle de Build

```
npm run dev
  ↓
Vite dev server
  ↓
Localhost:5173 (hot reload)

npm run build
  ↓
Vite build
  ↓
Minification + Optimization
  ↓
dist/ folder (production ready)
```

## 📂 Fichiers Générés (À Ignorer)

```
node_modules/       # Dépendances installées
dist/               # Build production
.tauri/             # Cache Tauri
.env                # Variables locales (ne pas commit)
```

## 🎯 Points Clés pour Navigation

| Besoin | Aller à |
|--------|---------|
| Ajouter fonctionnalité UI | `src/views/` ou `src/components/` |
| Modifier logique produit | `src/stores/productStore.js` |
| Changer stockage données | `src/db/database.js` |
| Ajouter langue | `src/i18n/locales/*.json` |
| Modifier style global | `src/style.scss` |
| Ajouter route | `src/router/index.js` |
| Ajouter plugin Vue | `src/main.js` |

---

**Créé avec**: Vue 3 + Vite + Pinia + Vue-i18n + IndexedDB  
**Designed pour**: Développement rapide et maintenance facile  
**Version**: 1.0.0
