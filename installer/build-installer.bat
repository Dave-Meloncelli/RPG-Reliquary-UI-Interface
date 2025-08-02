@echo off
echo Building Agent Zero Windows Installer...
echo.

REM Check if Inno Setup is installed
where iscc >nul 2>&1
if errorlevel 1 (
    echo ERROR: Inno Setup is not installed or not in PATH
    echo Please download and install Inno Setup from: https://jrsoftware.org/isinfo.php
    echo After installation, make sure iscc.exe is in your PATH
    pause
    exit /b 1
)

REM Check if required files exist
if not exist "..\dist\*" (
    echo ERROR: Build directory not found. Please run 'npm run build' first.
    pause
    exit /b 1
)

if not exist "..\docker-compose.yml" (
    echo ERROR: docker-compose.yml not found
    pause
    exit /b 1
)

if not exist "..\env.example" (
    echo ERROR: env.example not found
    pause
    exit /b 1
)

REM Create output directory
if not exist "output" mkdir output

REM Build the installer
echo Building installer with Inno Setup...
iscc AgentZeroInstaller.iss

if errorlevel 1 (
    echo ERROR: Failed to build installer
    pause
    exit /b 1
)

echo.
echo SUCCESS: Installer built successfully!
echo Output file: output\AgentZeroSetup.exe
echo.
echo The installer includes:
echo - Wizard-style configuration for API keys and security
echo - Automatic .env file generation
echo - Docker Compose setup
echo - Start/stop scripts
echo - Windows integration (start menu, desktop icons)
echo - File associations
echo.
pause 