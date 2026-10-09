@echo off
echo ========================================
echo   HHW Business Management System
echo   Starting Frontend...
echo ========================================
echo.

cd client

echo [1/2] Checking if dependencies are installed...
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    echo This will take 2-3 minutes...
    npm install
) else (
    echo Dependencies already installed!
)

echo.
echo [2/2] Starting development server...
echo.
echo Opening http://localhost:5173 in your browser...
echo.
echo Press Ctrl+C to stop the server
echo ========================================
npm run dev

pause
