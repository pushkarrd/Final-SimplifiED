@echo off
echo ========================================
echo SimplifiED - Startup Script
echo ========================================
echo.

echo [1/3] Starting Ollama service...
start /B ollama serve 2>nul
timeout /t 2 >nul

echo [2/3] Starting Python Backend (port 8000)...
cd backend-python
start "SimplifiED Backend" python -m uvicorn main:app --port 8000
timeout /t 3 >nul

echo [3/3] Starting React Frontend (port 5173)...
cd ..\frontend
start "SimplifiED Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
