# 💊 Pharma Scanner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Enabled-success.svg)](https://web.dev/progressive-web-apps/)
[![Offline](https://img.shields.io/badge/Offline-Ready-green.svg)](/)

Progressive Web App moderne pour scanner et gérer des produits pharmaceutiques - **100% offline**

[🇫🇷 Français](#français) | [🇬🇧 English](#english)

---

## Français

### 📖 Description

Pharma Scanner est une Progressive Web App (PWA) complète et moderne permettant de scanner, gérer et organiser vos produits pharmaceutiques. L'application fonctionne entièrement hors ligne sans aucun serveur externe requis.

### ✨ Fonctionnalités

#### 🔐 Multi-utilisateurs (Local)
- Création de compte utilisateur (stocké localement)
- Connexion/Déconnexion sécurisée
- Hash des mots de passe avec Web Crypto API
- Option "Se souvenir de moi"
- Gestion de profil avec photo

#### 📷 Scanner de Code-Barres
- Scan en temps réel avec la caméra
- Support EAN-13, EAN-8, UPC-A, Code-128, QR Code
- Overlay visuel avec animations
- Feedback visuel et sonore
- Flash/Torche activable
- Switch caméra avant/arrière

#### 📦 Gestion des Produits
- Ajouter, modifier, supprimer des produits
- Photos avec compression automatique
- Catégorisation avec 12 catégories
- Recherche en temps réel
- Filtres par catégorie
- Tri multiple (nom, prix, date)
- Système de favoris
- Vue cartes ou liste

#### 📊 Dashboard & Statistiques
- Statistiques en temps réel
- Graphique de répartition par catégorie
- Produits récents
- Alertes produits expirant bientôt
- Prix moyen et valeur totale

#### 🌍 Multilingue
- Français et Anglais
- Détection automatique de la langue
- Switch facile dans les paramètres

#### 🎨 Design Moderne
- Interface clean et professionnelle
- Dark mode / Light mode / Auto
- Animations fluides
- Design responsive (mobile-first)
- Glassmorphism effects

#### 💾 Import/Export
- Export des données en JSON
- Import de données
- Sauvegarde complète de l'inventaire

#### 📱 PWA Features
- Installation sur l'appareil
- Fonctionne 100% offline
- Notifications (optionnel)
- Service Worker pour le cache

### 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Database**: IndexedDB (stockage local)
- **Barcode Scanning**: ZXing.js
- **Charts**: Chart.js
- **PWA**: Service Worker, Web App Manifest
- **Security**: Web Crypto API

### 📂 Structure du Projet

```
pharma-scanner/
├── index.html              # Page principale
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker pour offline
├── assets/
│   ├── icons/              # Icônes PWA
│   ├── images/             # Images et logos
│   └── sounds/             # Sons (beep scan)
├── css/
│   ├── styles.css          # Styles globaux
│   ├── themes.css          # Thèmes clair/sombre
│   ├── animations.css      # Animations
│   └── responsive.css      # Responsive design
├── js/
│   ├── app.js              # Application principale
│   ├── auth.js             # Authentification
│   ├── db.js               # IndexedDB wrapper
│   ├── scanner.js          # Scanner code-barres
│   ├── products.js         # Gestion produits
│   ├── ui.js               # Composants UI
│   ├── i18n.js             # Internationalisation
│   ├── stats.js            # Statistiques
│   └── utils.js            # Utilitaires
├── locales/
│   ├── fr.json             # Traductions françaises
│   └── en.json             # Traductions anglaises
└── README.md
```

### 🚀 Installation Locale

1. Clonez le repository:
```bash
git clone https://github.com/osaka20/pharma-scanner.git
cd pharma-scanner
```

2. Servez l'application avec un serveur HTTP local:
```bash
# Avec Python 3
python -m http.server 8000

# Ou avec Node.js
npx http-server -p 8000

# Ou avec PHP
php -S localhost:8000
```

3. Ouvrez votre navigateur à `http://localhost:8000`

### 🌐 Déploiement

#### GitHub Pages
```bash
# Activez GitHub Pages dans les paramètres du repository
# Sélectionnez la branche main et le dossier root
```

#### Vercel
```bash
vercel --prod
```

#### Netlify
```bash
netlify deploy --prod --dir=.
```

### 📱 Installation PWA

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Installer" dans la barre d'adresse
3. Ou utilisez le menu "Ajouter à l'écran d'accueil" sur mobile

### 🎯 Utilisation

1. **Première visite**: Sélectionnez votre langue
2. **Créer un compte**: Inscrivez-vous avec email et mot de passe
3. **Scanner un produit**: Cliquez sur "Scanner" et pointez la caméra vers le code-barres
4. **Ajouter un produit**: Remplissez le formulaire avec les informations
5. **Gérer l'inventaire**: Recherchez, filtrez et organisez vos produits
6. **Statistiques**: Consultez le dashboard pour voir vos statistiques

### 🔒 Sécurité & Confidentialité

- ✅ Toutes les données sont stockées localement (IndexedDB)
- ✅ Aucune donnée n'est envoyée à un serveur externe
- ✅ Mots de passe hashés avec SHA-256
- ✅ Pas de tracking, pas d'analytics
- ✅ Code source open-source auditable

### 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer:

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### 👥 Auteur

**osaka** - [GitHub](https://github.com/osaka20)

### 🙏 Remerciements

- [ZXing](https://github.com/zxing-js/library) - Barcode scanning
- [Chart.js](https://www.chartjs.org/) - Graphiques
- [idb](https://github.com/jakearchibald/idb) - IndexedDB wrapper

---

## English

### 📖 Description

Pharma Scanner is a complete and modern Progressive Web App (PWA) for scanning, managing and organizing your pharmaceutical products. The application works entirely offline without any external server required.

### ✨ Features

#### 🔐 Multi-user (Local)
- User account creation (stored locally)
- Secure login/logout
- Password hashing with Web Crypto API
- "Remember me" option
- Profile management with photo

#### 📷 Barcode Scanner
- Real-time scanning with camera
- Support for EAN-13, EAN-8, UPC-A, Code-128, QR Code
- Visual overlay with animations
- Visual and sound feedback
- Flash/Torch toggle
- Front/back camera switch

#### 📦 Product Management
- Add, edit, delete products
- Photos with automatic compression
- Categorization with 12 categories
- Real-time search
- Category filters
- Multiple sorting (name, price, date)
- Favorites system
- Card or list view

#### 📊 Dashboard & Statistics
- Real-time statistics
- Category distribution chart
- Recent products
- Expiring soon alerts
- Average price and total value

#### 🌍 Multilingual
- French and English
- Automatic language detection
- Easy switch in settings

#### 🎨 Modern Design
- Clean and professional interface
- Dark mode / Light mode / Auto
- Smooth animations
- Responsive design (mobile-first)
- Glassmorphism effects

#### 💾 Import/Export
- Export data to JSON
- Import data
- Complete inventory backup

#### 📱 PWA Features
- Install on device
- 100% offline functionality
- Notifications (optional)
- Service Worker for caching

### 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Database**: IndexedDB (local storage)
- **Barcode Scanning**: ZXing.js
- **Charts**: Chart.js
- **PWA**: Service Worker, Web App Manifest
- **Security**: Web Crypto API

### 🚀 Local Installation

1. Clone the repository:
```bash
git clone https://github.com/osaka20/pharma-scanner.git
cd pharma-scanner
```

2. Serve the application with a local HTTP server:
```bash
# With Python 3
python -m http.server 8000

# Or with Node.js
npx http-server -p 8000

# Or with PHP
php -S localhost:8000
```

3. Open your browser at `http://localhost:8000`

### 📱 PWA Installation

1. Open the application in your browser
2. Click "Install" in the address bar
3. Or use the "Add to Home Screen" menu on mobile

### 🎯 Usage

1. **First visit**: Select your language
2. **Create account**: Sign up with email and password
3. **Scan product**: Click "Scan" and point camera at barcode
4. **Add product**: Fill in the form with product information
5. **Manage inventory**: Search, filter and organize your products
6. **Statistics**: Check the dashboard to see your statistics

### 🔒 Security & Privacy

- ✅ All data stored locally (IndexedDB)
- ✅ No data sent to external servers
- ✅ Passwords hashed with SHA-256
- ✅ No tracking, no analytics
- ✅ Open-source auditable code

### 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### 👥 Author

**osaka** - [GitHub](https://github.com/osaka20)

---

**Made with ❤️ for better pharmaceutical management**
