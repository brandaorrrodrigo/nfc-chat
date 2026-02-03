#!/bin/bash

# 🚀 Script de Setup Automático - NutriFitCoach Local

set -e

echo "🎯 Iniciando Setup Local do NutriFitCoach..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Função de sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função de warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função de erro
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# 1. Verificar pré-requisitos
echo "📋 Verificando pré-requisitos..."

command -v node >/dev/null 2>&1 || error "Node.js não encontrado"
success "Node.js instalado"

command -v npm >/dev/null 2>&1 || error "npm não encontrado"
success "npm instalado"

command -v docker >/dev/null 2>&1 || error "Docker não encontrado"
success "Docker instalado"

command -v ollama >/dev/null 2>&1 || error "Ollama não encontrado"
success "Ollama instalado"

command -v nvidia-smi >/dev/null 2>&1 || warning "nvidia-smi não encontrado (opcional para monitoramento)"

echo ""

# 2. Verificar modelos Ollama
echo "🤖 Verificando modelos Ollama..."

REQUIRED_MODELS=("llama3.1:70b" "llama3.1:8b" "llava:13b" "nomic-embed-text")
MISSING_MODELS=()

for model in "${REQUIRED_MODELS[@]}"; do
    if ollama list | grep -q "$model"; then
        success "Modelo $model já instalado"
    else
        MISSING_MODELS+=("$model")
        warning "Modelo $model NÃO instalado"
    fi
done

if [ ${#MISSING_MODELS[@]} -gt 0 ]; then
    echo ""
    echo "📥 Modelos faltando detectados!"
    echo "Para instalar manualmente:"
    for model in "${MISSING_MODELS[@]}"; do
        echo "  ollama pull $model"
    done
    echo ""
    read -p "Deseja instalar automaticamente agora? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for model in "${MISSING_MODELS[@]}"; do
            echo "📥 Baixando $model (pode demorar)..."
            ollama pull "$model" || warning "Erro ao baixar $model"
        done
    fi
fi

echo ""

# 3. Configurar .env
echo "⚙️  Configurando variáveis de ambiente..."

if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        success ".env.local criado a partir do template"
        warning "IMPORTANTE: Edite .env.local com suas credenciais!"
    else
        warning ".env.local.example não encontrado"
    fi
else
    success ".env.local já existe"
fi

echo ""

# 4. Instalar dependências
echo "📦 Instalando dependências npm..."
npm install || error "Erro ao instalar dependências"
success "Dependências instaladas"

echo ""

# 5. Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate || error "Erro ao gerar Prisma Client"
success "Prisma Client gerado"

echo ""

# 6. Subir Docker Compose
echo "🐳 Iniciando serviços Docker..."
docker compose up -d || docker-compose up -d || error "Erro ao iniciar Docker Compose"

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços iniciarem (15s)..."
sleep 15

# Verificar containers
if docker ps | grep -q "nfc-postgres"; then
    success "PostgreSQL rodando"
else
    warning "PostgreSQL pode não estar rodando"
fi

if docker ps | grep -q "nfc-redis"; then
    success "Redis rodando"
else
    warning "Redis pode não estar rodando"
fi

if docker ps | grep -q "nfc-chromadb"; then
    success "ChromaDB rodando"
else
    warning "ChromaDB pode não estar rodando"
fi

echo ""

# 7. Rodar migrations
echo "🗄️  Executando migrations do banco de dados..."
npx prisma migrate dev --name init || warning "Erro ao rodar migrations (pode já estar atualizado)"

echo ""

# 8. Seed do banco (opcional)
read -p "Deseja popular o banco com dados iniciais? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Populando banco de dados..."
    npx ts-node prisma/seed.ts || warning "Erro ao popular banco (talvez já populado)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 ${GREEN}SETUP COMPLETO!${NC}"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "  1. Verifique o .env.local e ajuste se necessário"
echo "  2. Inicie a aplicação:"
echo "     ${YELLOW}npm run dev${NC}"
echo ""
echo "  3. Acesse: ${GREEN}http://localhost:3001${NC}"
echo ""
echo "  4. Login padrão:"
echo "     Email: ${YELLOW}admin@nutrifitcoach.com${NC}"
echo "     Senha: ${YELLOW}admin123${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Status dos Serviços:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep nfc || true
echo ""
echo "🎮 GPUs Disponíveis:"
nvidia-smi --query-gpu=index,name,memory.total --format=csv,noheader 2>/dev/null || echo "nvidia-smi não disponível"
echo ""
