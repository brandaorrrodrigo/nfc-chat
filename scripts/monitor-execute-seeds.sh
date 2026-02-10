#!/bin/bash

# Script para monitorar Supabase e executar seeds quando online

SCRIPTS=(
  "seed-peptideos-farmacologia.ts"
  "seed-performance-biohacking.ts"
  "seed-receitas-alimentacao.ts"
  "seed-exercicios-tecnica.ts"
)

MAX_ATTEMPTS=30
INTERVAL=10  # 10 segundos entre tentativas
ATTEMPT=0

echo "🔄 Monitorando Supabase PostgreSQL..."
echo "Tentando a cada ${INTERVAL}s (máximo ${MAX_ATTEMPTS} tentativas)"
echo ""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))

  # Testa conexão com Supabase
  if timeout 5 npx tsx scripts/test-db-connection.ts 2>/dev/null; then
    echo ""
    echo "✅ Supabase PostgreSQL está ONLINE!"
    echo ""

    # Executa scripts em sequência
    for script in "${SCRIPTS[@]}"; do
      echo "▶️ Executando: $script"
      npx tsx scripts/$script
      if [ $? -eq 0 ]; then
        echo "✅ $script completado"
      else
        echo "❌ Erro em $script"
      fi
      echo ""
    done

    exit 0
  fi

  echo "⏳ Tentativa $ATTEMPT/$MAX_ATTEMPTS: Supabase ainda offline... aguardando ${INTERVAL}s"
  sleep $INTERVAL
done

echo ""
echo "❌ Supabase não conectou em $MAX_ATTEMPTS tentativas."
echo "Tente novamente manualmente: npx tsx scripts/seed-peptideos-farmacologia.ts"
