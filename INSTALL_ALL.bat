@echo off
echo ========================================
echo   HHW Business Management System
echo   Installing All Dependencies
echo ========================================
echo.

echo [1/3] Installing root dependencies...
call npm install
echo.

echo [2/3] Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo [3/3] Installing server dependencies...
cd server
call npm install
cd ..
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env files (see QUICKSTART.md)
echo 2. Run START_FRONTEND.bat to see the UI
echo 3. Follow QUICKSTART.md for full setup
echo.
pause
