@echo off
echo CommsItumo uygulaması başlatılıyor...

:: Backend'i başlat
start cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: Frontend'i başlat
start cmd /k "cd frontend && npm run dev"

echo Uygulama başlatıldı!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo 
echo Çıkmak için herhangi bir tuşa basın...
pause > nul 