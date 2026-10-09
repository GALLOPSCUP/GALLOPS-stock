@echo off
title Gallops Stock Manager
echo ========================================================
echo    Launching Gallops Menstrual Cup Stock Manager...
echo ========================================================
echo.

:: Try to launch in Microsoft Edge App Mode, Google Chrome App Mode, or default browser
set APP_URL="file:///%CD:\=/%/index.html"

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=%APP_URL%
    goto END
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=%APP_URL%
    goto END
)

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%APP_URL%
    goto END
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=%APP_URL%
    goto END
)

:: Fallback to default browser
start "" "%CD%\index.html"

:END
exit
