@echo off
REM Build script for Windows - No admin rights needed
REM Requires: Go installed (https://go.dev/dl/)

setlocal enabledelayedexpansion

REM Check if Go is installed
where go >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Go is not installed or not in PATH
    echo.
    echo Install Go from: https://go.dev/dl/
    echo.
    pause
    exit /b 1
)

REM Display Go version
echo.
echo [INFO] Go version:
go version
echo.

REM Build directory
set BUILD_DIR=%~dp0
cd /d "%BUILD_DIR%"

REM Build the executable
echo [BUILD] Building PharmaScanner.exe...
echo.

set GOOS=windows
set GOARCH=amd64

go build ^
    -ldflags "-H=windowsgui -s -w -X main.version=1.0.0" ^
    -trimpath ^
    -buildmode=exe ^
    -o PharmaScanner.exe ^
    .\server\main.go

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] PharmaScanner.exe created successfully!
echo.
echo Location: %BUILD_DIR%PharmaScanner.exe
echo.
echo Next steps:
echo   1. Double-click PharmaScanner.exe to run
echo   2. The app will open in your browser
echo   3. Data is saved in pharma-data.json
echo.
echo Troubleshooting:
echo   - If antivirus blocks it, see INSTALLATION.md
echo   - No admin rights needed
echo.
pause
