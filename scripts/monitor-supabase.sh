#!/bin/bash

# monitor-supabase.sh
#
# Script para monitorar quando Supabase volta online
# Executa automaticamente os testes quando banco estiver disponível
#
# Execução: bash scripts/monitor-supabase.sh

DATABASE_URL="${DATABASE_URL:-}"
CHECK_INTERVAL=30  # segundos

echo "🔍 Monitorando Supabase..."
echo "   Intervalo de verificação: $CHECK_INTERVAL segundos"
echo "   Use Ctrl+C para parar"
echo ""

# Se DATABASE_URL não estiver definida, tentar carregar de .env.local
if [ -z "$DATABASE_URL" ]; then
  if [ -f ".env.local" ]; then
    export $(grep DATABASE_URL .env.local | xargs)
  fi
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não definida!"
  echo "   Configure em .env.local ou exporte a variável"
  exit 1
fi

# Função para testar conexão
test_supabase_connection() {
  # Tentar conectar com timeout de 5 segundos
  timeout 5 node -e "
    const { PrismaClient } = require('./lib/generated/prisma');
    const prisma = new PrismaClient();
    prisma.\$queryRaw\`SELECT 1\`
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
  " 2>/dev/null
  return $?
}

# Loop de monitoramento
attempt=0
while true; do
  attempt=$((attempt + 1))
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  echo -n "[$timestamp] Tentativa #$attempt: "

  if test_supabase_connection; then
    echo "✅ SUPABASE ONLINE!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 Supabase detectado online! Executando testes..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Executar scripts de teste
    echo "1️⃣  Verificando estrutura de HUBs..."
    echo ""
    npx tsx scripts/verify-hub-structure.ts
    hub_check=$?

    echo ""
    echo "2️⃣  Testando endpoints..."
    echo ""
    bash scripts/test-hub-endpoints.sh
    endpoint_check=$?

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ $hub_check -eq 0 ] && [ $endpoint_check -eq 0 ]; then
      echo "✅ TODOS OS TESTES PASSARAM!"
      echo ""
      echo "📋 Próximas ações:"
      echo "   1. Acessar: http://localhost:3000/comunidades/hub/hub-biomecanico"
      echo "   2. Testar navegação (clique em uma arena)"
      echo "   3. Validar responsividade (desktop/tablet/mobile)"
      echo ""
    else
      echo "⚠️  Alguns testes falharam. Verifique a saída acima."
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    break
  else
    echo "❌ Offline (aguardando...)"
  fi

  sleep $CHECK_INTERVAL
done
