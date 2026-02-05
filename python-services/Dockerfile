# Dockerfile para MediaPipe Service
# Multi-stage build para otimizar tamanho da imagem

# ===== Stage 1: Builder =====
FROM python:3.11-slim as builder

# Instalar dependências de sistema necessárias para compilação
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    cmake \
    libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /build

# Copiar requirements e instalar dependências
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ===== Stage 2: Runtime =====
FROM python:3.11-slim

# Metadados
LABEL maintainer="NFC Comunidades <contato@nfc.com>"
LABEL description="MediaPipe Pose Analysis Service"
LABEL version="1.0.0"

# Instalar dependências de runtime
RUN apt-get update && apt-get install -y \
    libgomp1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root para segurança
RUN useradd -m -u 1000 mediapipe && \
    mkdir -p /app /tmp/mediapipe && \
    chown -R mediapipe:mediapipe /app /tmp/mediapipe

# Copiar dependências Python do builder
COPY --from=builder /root/.local /home/mediapipe/.local

# Configurar PATH
ENV PATH=/home/mediapipe/.local/bin:$PATH

# Definir diretório de trabalho
WORKDIR /app

# Copiar código da aplicação
COPY --chown=mediapipe:mediapipe . .

# Trocar para usuário não-root
USER mediapipe

# Variáveis de ambiente
ENV FLASK_APP=mediapipe_service.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=5000
ENV MODEL_COMPLEXITY=1
ENV MIN_DETECTION_CONFIDENCE=0.7
ENV MIN_TRACKING_CONFIDENCE=0.7
ENV MAX_FRAMES_PER_REQUEST=20
ENV TEMP_DIR=/tmp/mediapipe
ENV LOG_LEVEL=INFO

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')"

# Expor porta
EXPOSE 5000

# Comando padrão (production com gunicorn)
CMD ["gunicorn", \
     "--bind", "0.0.0.0:5000", \
     "--workers", "4", \
     "--threads", "2", \
     "--worker-class", "sync", \
     "--timeout", "120", \
     "--keep-alive", "5", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "mediapipe_service:app"]

# Para desenvolvimento, usar:
# CMD ["python", "mediapipe_service.py"]
