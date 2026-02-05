#!/bin/bash

# Setup script para MediaPipe Service
# Facilita instalação e inicialização do serviço

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║   MediaPipe Service - Setup Script        ║"
echo "║   NFC Comunidades                          ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar Python
print_info "Verificando Python..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 não encontrado. Por favor, instale Python 3.11+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
print_success "Python $PYTHON_VERSION encontrado"

# Verificar pip
print_info "Verificando pip..."
if ! command -v pip3 &> /dev/null; then
    print_error "pip não encontrado. Por favor, instale pip"
    exit 1
fi
print_success "pip encontrado"

# Criar ambiente virtual
print_info "Criando ambiente virtual..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Ambiente virtual criado"
else
    print_warning "Ambiente virtual já existe"
fi

# Ativar ambiente virtual
print_info "Ativando ambiente virtual..."
source venv/bin/activate
print_success "Ambiente virtual ativado"

# Atualizar pip
print_info "Atualizando pip..."
pip install --upgrade pip > /dev/null 2>&1
print_success "pip atualizado"

# Instalar dependências
print_info "Instalando dependências..."
pip install -r requirements.txt
print_success "Dependências instaladas"

# Verificar instalações críticas
print_info "Verificando instalações críticas..."

# MediaPipe
if python3 -c "import mediapipe" 2>/dev/null; then
    MEDIAPIPE_VERSION=$(python3 -c "import mediapipe; print(mediapipe.__version__)")
    print_success "MediaPipe $MEDIAPIPE_VERSION instalado"
else
    print_error "Falha ao instalar MediaPipe"
    exit 1
fi

# OpenCV
if python3 -c "import cv2" 2>/dev/null; then
    OPENCV_VERSION=$(python3 -c "import cv2; print(cv2.__version__)")
    print_success "OpenCV $OPENCV_VERSION instalado"
else
    print_error "Falha ao instalar OpenCV"
    exit 1
fi

# Flask
if python3 -c "import flask" 2>/dev/null; then
    FLASK_VERSION=$(python3 -c "import flask; print(flask.__version__)")
    print_success "Flask $FLASK_VERSION instalado"
else
    print_error "Falha ao instalar Flask"
    exit 1
fi

# Criar diretório temporário
print_info "Criando diretório temporário..."
mkdir -p /tmp/mediapipe
print_success "Diretório /tmp/mediapipe criado"

# Copiar .env.example se .env não existe
if [ ! -f ".env" ]; then
    print_info "Criando arquivo .env..."
    cp .env.example .env
    print_success "Arquivo .env criado (edite conforme necessário)"
    print_warning "⚠ Por favor, revise e ajuste o arquivo .env antes de iniciar o serviço"
else
    print_warning ".env já existe (não sobrescrito)"
fi

# Resumo
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Setup Concluído com Sucesso! ✓           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
print_info "Para iniciar o serviço em modo desenvolvimento:"
echo -e "  ${BLUE}source venv/bin/activate${NC}"
echo -e "  ${BLUE}python mediapipe_service.py${NC}"
echo ""
print_info "Para iniciar em modo produção (com Gunicorn):"
echo -e "  ${BLUE}source venv/bin/activate${NC}"
echo -e "  ${BLUE}gunicorn --bind 0.0.0.0:5000 --workers 4 mediapipe_service:app${NC}"
echo ""
print_info "Para rodar testes:"
echo -e "  ${BLUE}pytest test_mediapipe_service.py -v${NC}"
echo ""
print_info "Para verificar health:"
echo -e "  ${BLUE}curl http://localhost:5000/health${NC}"
echo ""
