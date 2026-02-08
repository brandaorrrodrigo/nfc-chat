#!/bin/bash

echo "🔧 Preparando PostgreSQL local para migração..."
echo ""

# 1. Resetar senha do postgres
echo "1️⃣  Resetando senha do usuário postgres..."
docker exec unified-postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
echo "✅ Senha resetada para 'postgres'"
echo ""

# 2. Criar database se não existir
echo "2️⃣  Verificando database nutrifitcoach..."
docker exec unified-postgres psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'nutrifitcoach';" | grep -q 1
if [ $? -eq 0 ]; then
    echo "✅ Database nutrifitcoach já existe"
else
    echo "📦 Criando database nutrifitcoach..."
    docker exec unified-postgres psql -U postgres -c "CREATE DATABASE nutrifitcoach;"
    echo "✅ Database criada"
fi
echo ""

# 3. Configurar pg_hba.conf para aceitar conexões com senha
echo "3️⃣  Configurando autenticação do PostgreSQL..."
docker exec unified-postgres sh -c "sed -i 's/trust/scram-sha-256/g' /var/lib/postgresql/data/pg_hba.conf"
docker exec unified-postgres psql -U postgres -c "SELECT pg_reload_conf();" > /dev/null
echo "✅ Autenticação configurada"
echo ""

# 4. Aplicar migrations do Prisma
echo "4️⃣  Aplicando schema do Prisma..."
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nutrifitcoach"
npx prisma migrate deploy
if [ $? -eq 0 ]; then
    echo "✅ Schema aplicado com sucesso"
else
    echo "⚠️  Erro ao aplicar schema - tentando prisma db push..."
    npx prisma db push --skip-generate
fi
echo ""

echo "🎉 Banco local preparado!"
echo ""
echo "Próximo passo: node scripts/migrate-supabase-to-docker.js"
