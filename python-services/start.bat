@echo off
REM Script de inicialização rápida do MediaPipe Service (Windows)
REM Uso: start.bat [dev|prod]

setlocal enabledelayedexpansion

set MODE=%1
if "%MODE%"=="" set MODE=dev

echo Starting MediaPipe Service in %MODE% mode...

REM Verificar se venv existe
if not exist "venv" (
    echo Virtual environment not found. Running setup...
    call setup.bat
    if errorlevel 1 exit /b 1
)

REM Ativar venv
call venv\Scripts\activate.bat

REM Carregar variáveis de ambiente do .env
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        set "line=%%a"
        if not "!line:~0,1!"=="#" (
            set "%%a=%%b"
        )
    )
)

REM Iniciar baseado no modo
if /i "%MODE%"=="prod" goto production
if /i "%MODE%"=="production" goto production
if /i "%MODE%"=="dev" goto development
if /i "%MODE%"=="development" goto development
if /i "%MODE%"=="test" goto test

echo Unknown mode: %MODE%
echo Usage: start.bat [dev^|prod^|test]
echo   dev  - Development mode with Flask dev server (default)
echo   prod - Production mode with Gunicorn
echo   test - Run tests
exit /b 1

:production
echo Starting in PRODUCTION mode with Gunicorn...
set FLASK_ENV=production
set DEBUG=false

if "%HOST%"=="" set HOST=0.0.0.0
if "%PORT%"=="" set PORT=5000
if "%MAX_WORKERS%"=="" set MAX_WORKERS=4
if "%TIMEOUT_SECONDS%"=="" set TIMEOUT_SECONDS=120
if "%LOG_LEVEL%"=="" set LOG_LEVEL=info

gunicorn ^
    --bind %HOST%:%PORT% ^
    --workers %MAX_WORKERS% ^
    --threads 2 ^
    --worker-class sync ^
    --timeout %TIMEOUT_SECONDS% ^
    --keep-alive 5 ^
    --log-level %LOG_LEVEL% ^
    --access-logfile - ^
    --error-logfile - ^
    mediapipe_service:app

goto end

:development
echo Starting in DEVELOPMENT mode with Flask dev server...
set FLASK_ENV=development
set DEBUG=true

python mediapipe_service.py

goto end

:test
echo Running tests...
pytest test_mediapipe_service.py -v --cov=. --cov-report=term-missing

goto end

:end
endlocal
