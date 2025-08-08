@echo off
echo ============================================================
echo 🚀 AZ Interface Quick Start
echo ============================================================
echo.

echo 📦 Starting Backend Server...
start "AZ Interface Backend" cmd /k "cd backend && npm start"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo 📦 Starting Frontend Server...
start "AZ Interface Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 🌐 The application will be available at:
echo    - Frontend: http://localhost:5173
echo    - Backend: http://localhost:3001
echo.
echo 🔑 Default Login:
echo    Username: admin
echo    Password: password
echo.
echo 📋 Press any key to open the application...
pause > nul
start http://localhost:5173
