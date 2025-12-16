@echo off
cd backend-python
echo.
echo ================================
echo Starting SimplifiED Backend
echo ================================
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
