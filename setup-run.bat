@echo off
REM Complete setup and run script

cls
echo ============================================
echo   PharmaScanner - Setup & Run
echo ============================================
echo.

REM Check Go
where go >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Go not installed
    echo Install from: https://go.dev/dl/
    echo.
    pause
    exit /b 1
)

echo [✓] Go is installed
go version
echo.

REM Check if exe exists
if exist "PharmaScanner.exe" (
    echo [✓] PharmaScanner.exe found
    goto :launch
) else (
    echo [!] PharmaScanner.exe not found - compiling...
    call build.bat
    if errorlevel 1 exit /b 1
)

:launch
echo.
echo ============================================
echo   Launching PharmaScanner...
echo ============================================
echo.
echo The app will open in your browser.
echo.

start "" PharmaScanner.exe
timeout /t 2 /nobreak
exit /b 0
