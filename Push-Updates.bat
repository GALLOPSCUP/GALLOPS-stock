@echo off
title Push Updates to GitHub
echo ==============================================
echo   Pushing Gallops Stock Updates to GitHub...
echo ==============================================
git add .
git commit -m "App update %date% %time%"
git push origin main
echo ==============================================
echo   Done! Your mobile app will update in seconds.
echo ==============================================
pause
