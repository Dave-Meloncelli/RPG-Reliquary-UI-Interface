@echo off
echo ============================================================
echo 🚀 AZ Interface Installation Script
echo ============================================================
echo.

echo 📦 Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo 🔧 Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Installation Complete!
echo.
echo 🚀 To start the system:
echo    1. Start Backend: cd backend && npm start
echo    2. Start Frontend: npm run dev
echo.
echo 🌐 The application will be available at:
echo    - Frontend: http://localhost:5173
echo    - Backend: http://localhost:3001
echo.
echo 🔑 Default Login:
echo    Username: admin
echo    Password: password
echo.
pause
