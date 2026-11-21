@echo off
echo ========================================
echo        Bug Buddy - Startup
echo ========================================

REM Check if .env exists
if not exist "backend\.env" (
    echo.
    echo [!] backend\.env not found. Copying from .env.example...
    copy "backend\.env.example" "backend\.env" > nul
    echo [!] Please edit backend\.env and add your API keys before continuing.
    echo.
    echo     GEMINI_API_KEY=   (required)
    echo     SERPAPI_API_KEY=  (optional but recommended)
    echo     YDC_API_KEY=      (optional but recommended)
    echo.
    pause
)

echo.
echo [1/2] Starting backend on http://localhost:3001
start "Bug Buddy Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting frontend on http://localhost:5173
start "Bug Buddy Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Bug Buddy is starting up!
echo   Open: http://localhost:5173
echo   API:  http://localhost:3001/api/health
echo ========================================
pause
