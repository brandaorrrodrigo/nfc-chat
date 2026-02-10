#!/bin/bash

# Monitor Seeds Execution Script
# ==============================
#
# Este script monitora o Supabase e executa os 4 scripts seed
# quando o banco voltar online.
#
# USO:
#   bash scripts/monitor-seeds.sh
#   OU
#   npm run monitor:seeds

set -e

cd "$(dirname "$0")/.."

# ========================================
# CORES E EMOJIS
# ========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ========================================
# CONFIGURAÇÃO
# ========================================

CHECK_INTERVAL=10
MAX_ATTEMPTS=1000
ATTEMPT=0

SCRIPTS=(
  "seed-peptideos-farmacologia.ts:Peptídeos & Farmacologia:42"
  "seed-performance-biohacking.ts:Performance & Biohacking:40"
  "seed-receitas-alimentacao.ts:Receitas & Alimentação:41"
  "seed-exercicios-tecnica.ts:Exercícios & Técnica:40"
)

# ========================================
# FUNÇÕES
# ========================================

log_info() {
  echo -e "${BLUE}ℹ️  [$(date +'%H:%M:%S')] $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ [$(date +'%H:%M:%S')] $1${NC}"
}

log_error() {
  echo -e "${RED}❌ [$(date +'%H:%M:%S')] $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  [$(date +'%H:%M:%S')] $1${NC}"
}

log_pending() {
  echo -e "${YELLOW}⏳ [$(date +'%H:%M:%S')] $1${NC}"
}

check_supabase() {
  # Tentar conectar ao Supabase via Node.js
  node -e "
    const { createClient } = require('@supabase/supabase-js');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      process.exit(1);
    }

    const supabase = createClient(url, key);
    supabase.from('Arena').select('id').limit(1)
      .then(({ error }) => process.exit(error ? 1 : 0))
      .catch(() => process.exit(1));
  " 2>/dev/null
  return $?
}

execute_script() {
  local script=$1
  local name=$2
  local posts=$3

  log_pending "Iniciando: $name"

  if npx tsx "scripts/$script" > "logs/${script%.ts}.log" 2>&1; then
    log_success "$name executado com sucesso ($posts posts)"
    return 0
  else
    log_error "$name falhou. Veja logs/${script%.ts}.log para detalhes"
    return 1
  fi
}

execute_all_seeds() {
  echo ""
  echo "════════════════════════════════════════════════════════════"
  log_success "🚀 EXECUTANDO 4 SCRIPTS SEED"
  echo "════════════════════════════════════════════════════════════"
  echo ""

  local success_count=0
  local total_posts=0
  local total_scripts=${#SCRIPTS[@]}

  for script_info in "${SCRIPTS[@]}"; do
    IFS=':' read -r script name posts <<< "$script_info"

    if execute_script "$script" "$name" "$posts"; then
      ((success_count++))
      ((total_posts += posts))
    fi

    # Aguardar 2 segundos entre scripts
    sleep 2
  done

  # Relatório final
  echo ""
  echo "════════════════════════════════════════════════════════════"
  log_success "📊 RELATÓRIO FINAL"
  echo "════════════════════════════════════════════════════════════"
  echo ""

  log_info "Scripts executados: $success_count/$total_scripts"
  log_info "Posts criados: $total_posts (de 163 esperados)"
  echo ""

  if [ $success_count -eq $total_scripts ]; then
    log_success "🎉 TODOS OS SCRIPTS EXECUTADOS COM SUCESSO!"
    echo ""
    log_info "➜ Próximos passos:"
    log_info "   1. curl \"https://chat.nutrifitcoach.com.br/api/arenas?flush=true\""
    log_info "   2. Executar SQL UPDATE statements para associar arenas aos HUBs"
    log_info "   3. Testar rotas em https://chat.nutrifitcoach.com.br"
    echo ""
    return 0
  else
    log_warning "⚠️  Alguns scripts falharam. Verifique os logs."
    echo ""
    return 1
  fi
}

# ========================================
# MAIN
# ========================================

# Criar diretório de logs
mkdir -p logs

echo "════════════════════════════════════════════════════════════"
log_info "🔍 MONITOR DE SUPABASE - SCRIPTS SEED"
echo "════════════════════════════════════════════════════════════"
log_pending "Aguardando Supabase ficar online..."
log_info "Checando a cada $CHECK_INTERVAL segundos"
log_info "Timeout: $(($MAX_ATTEMPTS * $CHECK_INTERVAL / 60)) minutos"
echo ""

while true; do
  ((ATTEMPT++))

  # Mostrar progresso a cada 12 tentativas (2 minutos)
  if [ $((ATTEMPT % 12)) -eq 1 ]; then
    ELAPSED=$((($ATTEMPT * $CHECK_INTERVAL) / 60))
    log_pending "⏳ Tentativa $ATTEMPT/$MAX_ATTEMPTS (${ELAPSED} min decorridos)"
  fi

  if check_supabase; then
    log_success "✨ Supabase está ONLINE! Iniciando execução dos scripts..."
    echo ""
    sleep 1

    if execute_all_seeds; then
      exit 0
    else
      exit 1
    fi
  fi

  if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    echo ""
    log_error "Timeout: Supabase não ficou online no tempo limite"
    exit 1
  fi

  sleep $CHECK_INTERVAL
done
