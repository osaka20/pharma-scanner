@echo off
REM Simple launcher for PharmaScanner - No admin rights

REM Check if exe exists
if not exist "PharmaScanner.exe" (
    echo.
    echo [ERROR] PharmaScanner.exe not found!
    echo.
    echo Please compile first:
    echo   - Double-click build.bat
    echo   OR
    echo   - Run: go build -o PharmaScanner.exe ./server/main.go
    echo.
    pause
    exit /b 1
)

REM Launch the app
echo [INFO] Starting PharmaScanner...
start "" PharmaScanner.exe
exit /b 0
