@echo off
echo ================================================
echo  NutriFitCoach - Inicializacao Rapida
echo ================================================
echo.

echo [1/4] Verificando Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERRO: Docker Desktop nao esta rodando!
    echo Por favor, inicie o Docker Desktop e execute este script novamente.
    pause
    exit /b 1
)
echo OK - Docker rodando

echo.
echo [2/4] Subindo containers (PostgreSQL, Redis, ChromaDB)...
docker compose up -d
if errorlevel 1 (
    echo ERRO ao subir containers!
    pause
    exit /b 1
)

echo.
echo [3/4] Aguardando servicos ficarem prontos (10s)...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Iniciando aplicacao...
start "NFC Dev Server" cmd /k "npm run dev"

echo.
echo ================================================
echo  Setup Completo!
echo ================================================
echo.
echo  App estara disponivel em: http://localhost:3001
echo.
echo  Login padrao:
echo    Email: admin@nutrifitcoach.com
echo    Senha: admin123
echo.
echo  Para parar: docker compose down
echo ================================================
echo.
pause
