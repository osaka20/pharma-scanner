@echo off
chcp 65001 >nul
title PharmaScanner
cls
echo.
echo    ╔════════════════════════════════════════════╗
echo    ║     💊 PharmaScanner - Démarrage          ║
echo    ╚════════════════════════════════════════════╝
echo.

set FILE=PharmaScanner.hta

if not exist "%FILE%" (
    echo ❌ Erreur: %FILE% non trouvé
    echo.
    pause
    exit /b 1
)

echo ✓ Ouverture de PharmaScanner...
echo.
start "" "%FILE%"

echo ✓ L'application s'est lancée
echo.
echo   📂 Fichiers:
echo   • PharmaScanner.hta   ^| Application complète
echo   • pharma-data.json    ^| Données (créé automatiquement)
echo   • Lancer.bat          ^| Ce fichier de lancement
echo.
echo   💾 Stockage: Fichier JSON sur disque dur
echo   🔐 Données: Sauvegarde automatique à chaque modification
echo   📡 Connexion: Pas nécessaire
echo   ✅ Durable: Aucun risque de perte de données
echo.
echo   ℹ️  L'application s'ouvre dans sa propre fenêtre
echo.
pause
