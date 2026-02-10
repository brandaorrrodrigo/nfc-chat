#!/bin/bash

# test-hub-endpoints.sh
#
# Script para testar todos os endpoints de HUBs
# Execução: bash scripts/test-hub-endpoints.sh
#
# Pré-requisitos:
# - Next.js rodando em http://localhost:3000
# - Supabase online

BASE_URL="http://localhost:3000"

echo "🧪 TESTANDO ENDPOINTS DE HUBs"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
  local endpoint=$1
  local description=$2

  echo "🔍 Testando: $description"
  echo "   URL: $BASE_URL$endpoint"

  response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [ "$http_code" = "200" ]; then
    echo -e "   ${GREEN}✅ Status: $http_code${NC}"
    # Tentar fazer pretty print do JSON
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
  elif [ "$http_code" = "404" ]; then
    echo -e "   ${YELLOW}⚠️  Status: $http_code (Não encontrado)${NC}"
  else
    echo -e "   ${RED}❌ Status: $http_code${NC}"
  fi

  echo ""
}

# 1. Testar API de HUBs
echo "📌 ENDPOINTS DE API"
echo "-------------------"
echo ""

test_endpoint "/api/hubs/hub-biomecanico" "GET /api/hubs/hub-biomecanico"

# 2. Testar endpoint geral de arenas
test_endpoint "/api/arenas" "GET /api/arenas"

# 3. Testar páginas
echo "📌 PÁGINAS"
echo "----------"
echo ""

echo "🔍 Testando: Página HUB"
echo "   URL: $BASE_URL/comunidades/hub/hub-biomecanico"
http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/comunidades/hub/hub-biomecanico")
if [ "$http_code" = "200" ]; then
  echo -e "   ${GREEN}✅ Status: $http_code${NC}"
else
  echo -e "   ${RED}❌ Status: $http_code${NC}"
fi
echo ""

echo "🔍 Testando: Página Arena Individual"
echo "   URL: $BASE_URL/comunidades/analise-agachamento"
http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/comunidades/analise-agachamento")
if [ "$http_code" = "200" ]; then
  echo -e "   ${GREEN}✅ Status: $http_code${NC}"
else
  echo -e "   ${RED}❌ Status: $http_code${NC}"
fi
echo ""

# 4. Resumo
echo "================================"
echo "✅ Teste de endpoints completo!"
echo ""
echo "Próximos passos:"
echo "1. Verificar estrutura: npx tsx scripts/verify-hub-structure.ts"
echo "2. Acessar browser: http://localhost:3000/comunidades/hub/hub-biomecanico"
echo "3. Validar navegação e responsividade"
