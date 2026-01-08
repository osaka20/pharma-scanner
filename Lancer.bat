@echo off
REM PharmaScanner - Lanceur ultra-simple
REM Double-cliquez sur ce fichier, c'est tout !

title PharmaScanner
color 0A
cls

echo.
echo   ╔═══════════════════════════════════════╗
echo   ║      PHARMASCANNER v1.0               ║
echo   ║   Application 100%% locale             ║
echo   ╚═══════════════════════════════════════╝
echo.

if exist "PharmaScanner.exe" (
    echo   ✓ Application trouvée
    echo   ✓ Lancement en cours...
    echo.
    start "" "PharmaScanner.exe"
    
    timeout /t 2 /nobreak >nul
    echo   ✓ Accédez à : http://localhost:8080
    echo   ✓ Fenêtre navigateur en cours d'ouverture...
    echo.
) else (
    echo   ✗ ERREUR : PharmaScanner.exe introuvable !
    echo   Assurez-vous que ce fichier est dans le même dossier
    echo.
    pause
    exit /b 1
)

echo   Application lancée avec succès !
echo.
timeout /t 3 /nobreak >nul
