@echo off
setlocal enabledelayedexpansion
chcp 437 >nul
cd /d "%~dp0"

echo ============================================
echo  Zhixin - one-click GitHub Pages deploy
echo ============================================
echo.
echo Step 1: browser will open github.com/new
echo   - Repository name MUST be:  YOURNAME.github.io
echo   - Visibility: Public
echo   - Do NOT add README / .gitignore / license
echo.
start "" https://github.com/new
echo.
set /p GHUSER=Type your GitHub username and press Enter: 
if "%GHUSER%"=="" (
  echo No username entered, aborted.
  pause
  exit /b 1
)

set "GITEXE=git"
if exist "C:\Program Files\Git\cmd\git.exe" set "GITEXE=C:\Program Files\Git\cmd\git.exe"

echo.
echo Step 2: pushing to https://github.com/%GHUSER%/%GHUSER%.github.io
echo   A browser window will pop up for GitHub login. Sign in there.
echo   Credentials are stored by Windows, this script never sees your password.
echo.

"%GITEXE%" remote remove origin >nul 2>&1
"%GITEXE%" remote add origin "https://github.com/%GHUSER%/%GHUSER%.github.io.git"
"%GITEXE%" push -u origin main

if errorlevel 1 (
  echo.
  echo Push failed. Check the repo name and that you are logged in, then run this file again.
  pause
  exit /b 1
)

echo.
echo Step 3: build started. Site will be live in 1-2 minutes at:
echo   https://%GHUSER%.github.io
echo.
start "" "https://github.com/%GHUSER%/%GHUSER%.github.io/actions"
pause
