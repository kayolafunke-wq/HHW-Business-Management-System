@echo off
echo ========================================
echo HHW Business Database Setup
echo ========================================
echo.
echo This script will help you set up PostgreSQL database
echo.
echo OPTION 1: Create database using psql command line
echo Run this command:
echo   psql -U postgres -c "CREATE DATABASE hhw_business;"
echo.
echo OPTION 2: Use pgAdmin
echo   1. Open pgAdmin
echo   2. Right-click on 'Databases'
echo   3. Click 'Create' -^> 'Database...'
echo   4. Enter name: hhw_business
echo   5. Click 'Save'
echo.
echo After creating the database, update server/.env file with:
echo   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hhw_business
echo.
echo Press any key to try creating database now (requires psql in PATH)...
pause >nul

echo.
echo Attempting to create database...
psql -U postgres -c "CREATE DATABASE hhw_business;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database created successfully!
    echo.
    echo Next steps:
    echo 1. Update server/.env with your PostgreSQL password
    echo 2. Run: cd server
    echo 3. Run: npm run prisma:migrate
) else (
    echo.
    echo ✗ Failed to create database automatically.
    echo.
    echo Please create it manually using pgAdmin:
    echo   - Database name: hhw_business
    echo   - Owner: postgres
    echo.
)

echo.
pause
