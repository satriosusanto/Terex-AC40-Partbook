@echo off
setlocal
cd /d "%~dp0"
where powershell >nul 2>&1
if errorlevel 1 (
  echo PowerShell tidak ditemukan.
  pause
  exit /b 1
)
powershell -ExecutionPolicy Bypass -File "%~dp0setup-github.ps1"
pause
