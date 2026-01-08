#!/usr/bin/env bash
# Crée un installateur Windows (réduit les faux positifs)

set -e
cd "$(dirname "$0")"

# Build l'exécutable d'abord
./build_windows.sh

# Vérifier si NSIS est installé
if ! command -v makensis >/dev/null 2>&1; then
  echo "❌ NSIS n'est pas installé"
  echo ""
  echo "Installation :"
  echo "  Ubuntu/Debian: sudo apt install nsis"
  echo "  Fedora: sudo dnf install mingw32-nsis"
  echo "  macOS: brew install nsis"
  echo ""
  exit 1
fi

# Créer l'installateur
echo "📦 Création de l'installateur..."
makensis installer.nsi

echo ""
echo "✅ Installateur créé: PharmaScanner-Setup.exe"
echo ""
echo "Avantages de l'installateur :"
echo "  • Moins suspect pour les antivirus"
echo "  • Installation propre dans Program Files"
echo "  • Raccourcis automatiques"
echo "  • Désinstallation facile"
