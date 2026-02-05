@echo off
REM Setup script para MediaPipe Service (Windows)
REM Facilita instalação e inicialização do serviço

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════╗
echo ║   MediaPipe Service - Setup Script        ║
echo ║   NFC Comunidades                          ║
echo ╚════════════════════════════════════════════╝
echo.

REM Verificar Python
echo [INFO] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python não encontrado. Por favor, instale Python 3.11+
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] Python %PYTHON_VERSION% encontrado

REM Verificar pip
echo [INFO] Verificando pip...
pip --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] pip não encontrado. Por favor, instale pip
    pause
    exit /b 1
)
echo [OK] pip encontrado

REM Criar ambiente virtual
echo [INFO] Criando ambiente virtual...
if not exist "venv" (
    python -m venv venv
    echo [OK] Ambiente virtual criado
) else (
    echo [WARN] Ambiente virtual já existe
)

REM Ativar ambiente virtual
echo [INFO] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo [OK] Ambiente virtual ativado

REM Atualizar pip
echo [INFO] Atualizando pip...
python -m pip install --upgrade pip >nul 2>&1
echo [OK] pip atualizado

REM Instalar dependências
echo [INFO] Instalando dependências...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Falha ao instalar dependências
    pause
    exit /b 1
)
echo [OK] Dependências instaladas

REM Verificar instalações críticas
echo [INFO] Verificando instalações críticas...

REM MediaPipe
python -c "import mediapipe" 2>nul
if errorlevel 1 (
    echo [ERROR] Falha ao verificar MediaPipe
    pause
    exit /b 1
)
for /f "delims=" %%i in ('python -c "import mediapipe; print(mediapipe.__version__)"') do set MEDIAPIPE_VERSION=%%i
echo [OK] MediaPipe %MEDIAPIPE_VERSION% instalado

REM OpenCV
python -c "import cv2" 2>nul
if errorlevel 1 (
    echo [ERROR] Falha ao verificar OpenCV
    pause
    exit /b 1
)
for /f "delims=" %%i in ('python -c "import cv2; print(cv2.__version__)"') do set OPENCV_VERSION=%%i
echo [OK] OpenCV %OPENCV_VERSION% instalado

REM Flask
python -c "import flask" 2>nul
if errorlevel 1 (
    echo [ERROR] Falha ao verificar Flask
    pause
    exit /b 1
)
for /f "delims=" %%i in ('python -c "import flask; print(flask.__version__)"') do set FLASK_VERSION=%%i
echo [OK] Flask %FLASK_VERSION% instalado

REM Criar diretório temporário
echo [INFO] Criando diretório temporário...
if not exist "C:\temp\mediapipe" mkdir "C:\temp\mediapipe"
echo [OK] Diretório C:\temp\mediapipe criado

REM Copiar .env.example se .env não existe
if not exist ".env" (
    echo [INFO] Criando arquivo .env...
    copy .env.example .env >nul
    echo [OK] Arquivo .env criado (edite conforme necessário)
    echo [WARN] Por favor, revise e ajuste o arquivo .env antes de iniciar o serviço
) else (
    echo [WARN] .env já existe (não sobrescrito)
)

REM Resumo
echo.
echo ╔════════════════════════════════════════════╗
echo ║   Setup Concluído com Sucesso!             ║
echo ╚════════════════════════════════════════════╝
echo.
echo [INFO] Para iniciar o serviço em modo desenvolvimento:
echo   venv\Scripts\activate.bat
echo   python mediapipe_service.py
echo.
echo [INFO] Para rodar testes:
echo   pytest test_mediapipe_service.py -v
echo.
echo [INFO] Para verificar health:
echo   curl http://localhost:5000/health
echo.

pause
