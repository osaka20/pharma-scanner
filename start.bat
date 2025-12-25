@echo off
REM Script de lancement pour Pharma Scanner (Windows)
REM Double-cliquez sur ce fichier pour démarrer

echo ═══════════════════════════════════════════
echo 🚀 Pharma Scanner - Démarrage
echo ═══════════════════════════════════════════

REM Vérifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non trouvé. Veuillez installer Node.js 16+
    echo 📥 Téléchargez depuis: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Version: %NODE_VERSION%

REM Vérifier si node_modules existe
if not exist "node_modules\" (
    echo.
    echo 📦 Installation des dépendances...
    call npm install
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
)

echo.
echo ═══════════════════════════════════════════
echo ✅ Application prête!
echo ═══════════════════════════════════════════
echo.
echo 🌐 Ouverture sur http://localhost:5173
echo 💡 Appuyez sur Ctrl+C puis confirmer pour arrêter
echo.

REM Lancer Vite
call npm run dev
pause
