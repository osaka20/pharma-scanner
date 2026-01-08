#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if ! command -v go >/dev/null 2>&1; then
  echo "Go is required to build the Windows executable."
  echo "Install Go: https://go.dev/dl/"
  exit 1
fi

# Installation de goversioninfo si nécessaire (pour les métadonnées)
if ! command -v goversioninfo >/dev/null 2>&1; then
  echo "📦 Installation de goversioninfo pour ajouter les métadonnées..."
  go install github.com/josephspurrier/goversioninfo/cmd/goversioninfo@latest
fi

# Génération des métadonnées (réduit les faux positifs)
if [ -f "server/versioninfo.json" ]; then
  echo "📝 Ajout des métadonnées à l'exécutable..."
  cd server
  goversioninfo -o resource.syso
  cd ..
fi

# Build avec optimisations anti-détection
GOOS=windows GOARCH=amd64 go build \
  -ldflags "-H=windowsgui -s -w -X main.version=1.0.0" \
  -trimpath \
  -buildmode=exe \
  -o PharmaScanner.exe ./server/main.go

# Nettoyage
rm -f server/resource.syso

echo "✅ Built PharmaScanner.exe in $(pwd)"
echo ""
echo "💡 Conseils pour réduire les blocages antivirus :"
echo "1. Distribuez INSTALLATION.md avec le .exe"
echo "2. Soumettez comme faux positif : https://www.microsoft.com/en-us/wdsi/filesubmission"
echo "3. Téléchargez sur VirusTotal pour analyse : https://www.virustotal.com"
