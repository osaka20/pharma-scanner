@echo off
setlocal
cd /d %~dp0
if exist PharmaScanner.exe (
  echo Starting PharmaScanner.exe on :8080
  PharmaScanner.exe
) else if exist server\main.go (
  echo Starting server (Go) on :8080
  go run server\main.go
) else (
  echo Missing PharmaScanner.exe or server\main.go.
  echo Build the exe with build_windows.sh or install Go.
)
