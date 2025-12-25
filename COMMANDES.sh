#!/bin/bash
# Commandes utiles pour Pharma Scanner
# Copier/coller les lignes dans votre terminal

# ═══════════════════════════════════════════════════
# 🚀 DÉMARRAGE RAPIDE
# ═══════════════════════════════════════════════════

# 1. Première installation (une seule fois)
cd pharma-scanner
npm install

# 2. Développement (avec hot reload)
npm run dev
# → Ouvre http://localhost:5173

# 3. Build production
npm run build
# → Crée dist/ avec fichiers optimisés

# 4. Prévisualiser la build
npm run preview
# → Test en local avant déployer

# ═══════════════════════════════════════════════════
# 🧹 MAINTENANCE
# ═══════════════════════════════════════════════════

# Réinitialiser node_modules (si problèmes)
rm -rf node_modules
npm install

# Nettoyer cache npm
npm cache clean --force

# Mettre à jour les dépendances
npm update

# Vérifier les packages obsolètes
npm outdated

# Audit de sécurité
npm audit
npm audit fix

# ═══════════════════════════════════════════════════
# 🧪 TESTS & VÉRIFICATIONS
# ═══════════════════════════════════════════════════

# Linter (une fois implémenté)
npm run lint

# Vérifier la structure du projet
ls -la
tree src/  # (si tree installé)

# ═══════════════════════════════════════════════════
# 📦 DÉPENDANCES (Si besoin d'ajouter)
# ═══════════════════════════════════════════════════

# Ajouter un package
npm install package-name

# Ajouter un dev dependency
npm install --save-dev package-name

# Exemples utiles:
npm install axios                    # HTTP client (futur)
npm install lodash-es                # Utilitaires
npm install date-fns                 # Dates
npm install recharts                 # Graphiques

# ═══════════════════════════════════════════════════
# 🌍 GIT WORKFLOW
# ═══════════════════════════════════════════════════

# Initialiser git (première fois)
git init
git add .
git commit -m "Initial commit: Pharma Scanner v1.0"

# Créer une branche pour feature
git checkout -b feature/nouvelle-fonctionnalite

# Ajouter fichiers modifiés
git add .
git commit -m "Description du changement"

# Fusionner dans main
git checkout main
git merge feature/nouvelle-fonctionnalite

# Push vers serveur
git push origin main

# Voir l'historique
git log --oneline

# ═══════════════════════════════════════════════════
# 📁 FICHIERS IMPORTANTS
# ═══════════════════════════════════════════════════

# Voir structure
cat STRUCTURE.md     # Arborescence complète
cat README.md        # Documentation
cat CHECKLIST.md     # Statut du développement

# Ouvrir en éditeur
code .               # VS Code
vim src/App.vue      # Vim
nano src/App.vue     # Nano

# ═══════════════════════════════════════════════════
# 🔍 DEBUGGING
# ═══════════════════════════════════════════════════

# Vérifier Vue devtools
# Installer extension browser "Vue DevTools"

# Activer debug dans console navigateur
# F12 → Console → Voir messages

# Voir stockage IndexedDB
# F12 → Application → Indexed DB → PharmaDB

# Voir localStorage
# F12 → Application → Local Storage

# ═══════════════════════════════════════════════════
# 🌐 DÉPLOIEMENT
# ═══════════════════════════════════════════════════

# Copier dist/ sur serveur web
scp -r dist/ user@server:/var/www/pharma-scanner/

# Ou utiliser Netlify/Vercel
# 1. Connecter repo GitHub
# 2. Build command: npm run build
# 3. Publish directory: dist

# ═══════════════════════════════════════════════════
# 💾 SAUVEGARDE & RESTAURATION
# ═══════════════════════════════════════════════════

# Sauvegarder le projet
tar -czf pharma-scanner-backup.tar.gz pharma-scanner/
zip -r pharma-scanner-backup.zip pharma-scanner/

# Restaurer
tar -xzf pharma-scanner-backup.tar.gz
unzip pharma-scanner-backup.zip

# ═══════════════════════════════════════════════════
# 📊 STATS & INFO
# ═══════════════════════════════════════════════════

# Voir taille des fichiers
du -sh src/
du -sh node_modules/
du -sh dist/

# Voir nombre de fichiers
find src/ -type f | wc -l

# Lister tous les fichiers
find src/ -type f -name "*.vue"
find src/ -type f -name "*.js"
find src/ -type f -name "*.json"

# ═══════════════════════════════════════════════════
# 🚨 TROUBLESHOOTING
# ═══════════════════════════════════════════════════

# Port 5173 déjà utilisé?
lsof -i :5173  # Voir quel processus l'utilise
kill -9 <PID>  # Tuer le processus

# Vider le cache Vite
rm -rf .vite/

# Node.js version
node --version

# npm version
npm --version

# Réinstaller tout
rm -rf node_modules package-lock.json
npm install

# ═══════════════════════════════════════════════════
# 📚 RESSOURCES UTILES
# ═══════════════════════════════════════════════════

# Documentation officielle
# Vue 3: https://vuejs.org/
# Vite: https://vitejs.dev/
# Pinia: https://pinia.vuejs.org/
# Vue Router: https://router.vuejs.org/
# Vue-i18n: https://vue-i18n.intlify.dev/

# Aide Vue Devtools
# Installer: Vue DevTools Chrome/Firefox Extension

# ═══════════════════════════════════════════════════
# 🎯 WORKFLOW TYPIQUE
# ═══════════════════════════════════════════════════

# Jour 1: Démarrage
npm install
npm run dev
# → Tester l'app

# Jour 2+: Développement
# 1. Modifier code
# 2. npm run dev regarde les changements (hot reload)
# 3. F12 pour debug
# 4. git add . && git commit

# Avant production:
npm run build
npm run preview
# → Vérifier build final

# Déployer:
# Copier dist/ sur serveur

# ═══════════════════════════════════════════════════
# 💡 TIPS & ASTUCES
# ═══════════════════════════════════════════════════

# Raccourci pour démarrer (Linux/Mac)
chmod +x start.sh
./start.sh

# Raccourci pour démarrer (Windows)
double-clic start.bat

# Hot reload actif automatiquement
# Modifiez un fichier, le navigateur rafraîchit

# Utiliser un .env
# Créer .env à partir de .env.example
# Modifier VITE_* variables

# Commandes NPM rapides
npm i          # Même que npm install
npm run build  # Raccourci pour build

# ═══════════════════════════════════════════════════

echo "✅ Mémos des commandes créés!"
echo "📖 Consultez ce fichier pour la liste complète"
