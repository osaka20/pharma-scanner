# Pharma Scanner (Standalone)

A single-file pharmacy management app with server-backed JSON persistence. Runs locally with a tiny Go server and stores data in `pharma-data.json` next to the app. English by default with Arabic UI option.

## Run (Linux/macOS)
- `./start_server.sh`
- Open `http://localhost:8080`

## Run (Windows)
- If you have the compiled binary:
  - Place `PharmaScanner.exe` and `app-standalone.html` in the same folder.
  - Double‑click `PharmaScanner.exe` then open `http://localhost:8080`.
- If you have Go installed:
  - `start_server.bat` will run `server\main.go` directly.

## Build Windows Executable
Requires Go installed on your dev machine.
- `./build_windows.sh`
- Outputs `PharmaScanner.exe` in the project root.

## Data Persistence
- The server reads/writes `pharma-data.json` in the working directory via the `/data` endpoint.
- The app prefers server persistence; optional file-based fallback via the File System Access API.

## Features
- Product catalog (CRUD), Sell and Undo.
- Margin realized tracking with reset offset (history preserved).
- Sales history with filters and PDF export.
- English default, Arabic UI option.
