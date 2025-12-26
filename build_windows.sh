#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v go >/dev/null 2>&1; then
  echo "Go is required to build the Windows executable."
  echo "Install Go: https://go.dev/dl/"
  exit 1
fi
GOOS=windows GOARCH=amd64 go build -o PharmaScanner.exe ./server/main.go
echo "Built PharmaScanner.exe in $(pwd)"
