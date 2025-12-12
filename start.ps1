# SimplifiED - PowerShell Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SimplifiED - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Refresh environment PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "[1/3] Starting Ollama service..." -ForegroundColor Yellow
Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Python Backend (port 8000)..." -ForegroundColor Yellow
Set-Location "backend-python"
Start-Process python -ArgumentList "-m", "uvicorn", "main:app", "--port", "8000" -NoNewWindow
Start-Sleep -Seconds 3

Write-Host "[3/3] Starting React Frontend (port 5173)..." -ForegroundColor Yellow
Set-Location "..\frontend"
Start-Process cmd -ArgumentList "/k", "npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
