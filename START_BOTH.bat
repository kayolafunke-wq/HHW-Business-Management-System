@echo off
echo ========================================
echo   HHW Business Management System
echo   Starting Frontend and Backend
echo ========================================
echo.

echo IMPORTANT: Make sure you have configured:
echo   1. client\.env (Firebase config)
echo   2. server\.env (Database and Firebase Admin)
echo.
echo If not configured yet, press Ctrl+C and follow QUICKSTART.md
echo.
pause

echo Starting both servers...
echo.
npm run dev

pause
