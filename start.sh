#!/bin/bash
# Script de lancement pour Pharma Scanner
# Utilisation: ./start.sh

echo "═══════════════════════════════════════════"
echo "🚀 Pharma Scanner - Démarrage"
echo "═══════════════════════════════════════════"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trouvé. Veuillez installer Node.js 16+"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"
echo "✅ npm détecté: $(npm --version)"

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

echo ""
echo "═══════════════════════════════════════════"
echo "✅ Application prête!"
echo "═══════════════════════════════════════════"
echo ""
echo "🌐 Ouverture sur http://localhost:5173"
echo "💡 Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Lancer Vite
npm run dev
