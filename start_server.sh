#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if command -v go >/dev/null 2>&1; then
  echo "Starting server (Go) on :8080"
  (cd server && go run main.go)
else
  echo "Go is not installed. Install Go or run the binary on Windows."
  echo "On Windows, run PharmaScanner.exe (to be built) in this folder."
fi
