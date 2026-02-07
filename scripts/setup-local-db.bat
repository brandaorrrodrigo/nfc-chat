@echo off
REM Script para criar banco local PostgreSQL com Docker

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          Setup de Banco Local para Testes                   ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado!
    echo.
    echo Instalar Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ Docker detectado
echo.

REM Parar container existente (se houver)
echo 🛑 Parando container existente (se houver)...
docker stop nfc-postgres >nul 2>&1
docker rm nfc-postgres >nul 2>&1
echo.

REM Criar novo container PostgreSQL
echo 🚀 Criando container PostgreSQL...
docker run --name nfc-postgres ^
  -e POSTGRES_PASSWORD=senha123 ^
  -e POSTGRES_DB=nfc_comunidades ^
  -p 5432:5432 ^
  -d postgres:15-alpine

if %errorlevel% neq 0 (
    echo ❌ Erro ao criar container
    pause
    exit /b 1
)

echo ✅ Container PostgreSQL criado!
echo.
echo 📋 Credenciais:
echo    Host: localhost
echo    Port: 5432
echo    Database: nfc_comunidades
echo    User: postgres
echo    Password: senha123
echo.
echo 📝 Adicione ao .env.local:
echo    DATABASE_URL="postgresql://postgres:senha123@localhost:5432/nfc_comunidades"
echo.

REM Aguardar banco iniciar
echo ⏳ Aguardando banco iniciar (5 segundos)...
timeout /t 5 /nobreak >nul

REM Testar conexão
echo 🔍 Testando conexão...
docker exec nfc-postgres pg_isready -U postgres >nul 2>&1

if %errorlevel% eq 0 (
    echo ✅ Banco está pronto!
    echo.
    echo 🎯 Próximos passos:
    echo    1. Atualizar .env com a URL local
    echo    2. npx prisma db push
    echo    3. npm run avatar:analyze
    echo.
) else (
    echo ⚠️  Banco ainda inicializando, aguarde mais um pouco
    echo.
)

pause
