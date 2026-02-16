#!/bin/bash

# Script para re-analisar os 3 vídeos de exemplo
# Requer servidor local rodando em http://localhost:3000

echo "🔄 Re-analisando os 3 vídeos de exemplo..."
echo ""

# Vídeos de exemplo
SQUAT="va_1770817487770_noye0o9k1"
DEADLIFT="va_1770817584163_afof17p9k"
PULLDOWN="va_1770817621743_j5dzbciws"

# Função para re-analisar um vídeo
reanalyze() {
  local videoId=$1
  local name=$2

  echo "📹 Analisando: $name (ID: $videoId)"

  response=$(curl -s -X POST http://localhost:3000/api/biomechanics/analyze \
    -H "Content-Type: application/json" \
    -d "{\"videoId\":\"$videoId\"}" \
    -w "\nHTTP_STATUS:%{http_code}")

  status=$(echo "$response" | grep "HTTP_STATUS" | cut -d':' -f2)
  body=$(echo "$response" | sed '/HTTP_STATUS/d')

  if [ "$status" = "200" ]; then
    echo "✅ $name: Análise concluída com sucesso!"
    # Extrair scores do JSON (se possível)
    overall=$(echo "$body" | grep -o '"overallScore":[0-9.]*' | cut -d':' -f2 || echo "N/A")
    motor=$(echo "$body" | grep -o '"motorScore":[0-9.]*' | cut -d':' -f2 || echo "N/A")
    stab=$(echo "$body" | grep -o '"stabilizerScore":[0-9.]*' | cut -d':' -f2 || echo "N/A")
    echo "   Overall: $overall | Motor: $motor | Stabilizer: $stab"
  else
    echo "❌ $name: Erro na análise (HTTP $status)"
    echo "   Response: $body" | head -c 200
  fi

  echo ""
}

# Re-analisar cada vídeo
reanalyze "$SQUAT" "Agachamento"
sleep 2

reanalyze "$DEADLIFT" "Terra"
sleep 2

reanalyze "$PULLDOWN" "Puxadas"

echo ""
echo "🎉 Re-análise concluída!"
echo ""
echo "📊 Acesse o dashboard para ver os novos resultados:"
echo "   http://localhost:3000/biomechanics/dashboard?videoId=$SQUAT"
echo ""
echo "🔍 Verifique as mudanças:"
echo "   ✓ ROM como diferença: '139° (de 174° a 35°)'"
echo "   ✓ Análise em 3 pontos: startAngle / peakAngle / range"
echo "   ✓ stabilityMode: rigid/controlled/functional"
echo "   ✓ Mensagens contextuais específicas"
