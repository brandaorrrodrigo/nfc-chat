# 🐍 MediaPipe Service - Análise Biomecânica

Serviço Python Flask para processamento de vídeos com **MediaPipe Pose** e cálculo de ângulos biomecânicos.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Características](#características)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Desenvolvimento](#desenvolvimento)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este serviço é responsável por:

1. **Detectar poses** em frames de vídeo usando MediaPipe Pose
2. **Extrair landmarks 3D** com coordenadas normalizadas
3. **Calcular ângulos biomecânicos** (joelho, quadril, tronco, tornozelo, valgo, etc)
4. **Detectar fases do movimento** (excêntrico, bottom, concêntrico, top)
5. **Fornecer API REST** para integração com o worker BullMQ

---

## ✨ Características

- ✅ **MediaPipe Pose Detection** com model complexity configurável (lite/full/heavy)
- ✅ **Cálculos Biomecânicos** precisos para múltiplos exercícios
- ✅ **Detecção de Fase** automática do movimento
- ✅ **Cálculo de Confiança** baseado em visibilidade dos landmarks
- ✅ **Suporte a múltiplos exercícios**: squat, deadlift, bench press, overhead press
- ✅ **Métricas Prometheus** (opcional)
- ✅ **Health checks** para Kubernetes/Docker
- ✅ **Configuração via variáveis de ambiente**
- ✅ **Containerizado** com Docker
- ✅ **Production-ready** com Gunicorn

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                  Worker BullMQ (Node.js)             │
│                                                      │
│  Stage 2: MediaPipe Pose Detection                  │
└──────────────────┬───────────────────────────────────┘
                   │ HTTP POST /analyze-frames
                   │ { frames: [...], exercise_type }
                   ↓
┌──────────────────────────────────────────────────────┐
│           MediaPipe Service (Python/Flask)           │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  mediapipe_service.py (API)                │    │
│  │  - /health                                  │    │
│  │  - /analyze-frames (main)                  │    │
│  │  - /analyze-single-frame (debug)           │    │
│  │  - /config                                  │    │
│  │  - /metrics (optional)                     │    │
│  └────────────────────────────────────────────┘    │
│                   ↓                                  │
│  ┌────────────────────────────────────────────┐    │
│  │  pose_detector.py                          │    │
│  │  - Wrapper MediaPipe Pose                  │    │
│  │  - Extrai landmarks 3D + normalized        │    │
│  │  - World landmarks (metros)                │    │
│  └────────────────────────────────────────────┘    │
│                   ↓                                  │
│  ┌────────────────────────────────────────────┐    │
│  │  biomechanics_engine.py                    │    │
│  │  - calculate_angles()                      │    │
│  │  - calculate_knee_angle()                  │    │
│  │  - calculate_hip_angle()                   │    │
│  │  - calculate_trunk_angle()                 │    │
│  │  - calculate_ankle_angle()                 │    │
│  │  - calculate_valgus_angle()                │    │
│  │  - calculate_pelvic_tilt()                 │    │
│  │  - detect_phase()                          │    │
│  └────────────────────────────────────────────┘    │
│                   ↓                                  │
│  ┌────────────────────────────────────────────┐    │
│  │  utils.py                                  │    │
│  │  - validate_frame_data()                   │    │
│  │  - calculate_confidence_score()            │    │
│  │  - normalize_landmarks()                   │    │
│  │  - calculate_bilateral_symmetry()          │    │
│  └────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
                   ↓
         Retorna JSON com:
         - landmarks_3d
         - angles (knee, hip, trunk, etc)
         - phase (eccentric, bottom, concentric, top)
         - confidence score
```

---

## 📦 Instalação

### Pré-requisitos

- Python 3.11+
- pip
- (Opcional) Docker

### 1. Instalação Local

```bash
# Navegar para diretório
cd python-services

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### 2. Verificar Instalação

```bash
# Testar import do MediaPipe
python -c "import mediapipe as mp; print(mp.__version__)"

# Testar OpenCV
python -c "import cv2; print(cv2.__version__)"
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Criar arquivo `.env`:

```env
# Flask
FLASK_ENV=development
HOST=0.0.0.0
PORT=5000
DEBUG=true

# MediaPipe Model Settings
MODEL_COMPLEXITY=1              # 0=lite (rápido), 1=full (balanceado), 2=heavy (preciso)
MIN_DETECTION_CONFIDENCE=0.7    # 0.0-1.0
MIN_TRACKING_CONFIDENCE=0.7     # 0.0-1.0

# Performance
MAX_WORKERS=4
TIMEOUT_SECONDS=120
MAX_FRAMES_PER_REQUEST=20

# Logging
LOG_LEVEL=INFO                  # DEBUG, INFO, WARNING, ERROR
LOG_FORMAT="%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Temp directory
TEMP_DIR=/tmp/mediapipe

# Optional: Metrics
ENABLE_METRICS=false
METRICS_PORT=8000
```

### Configurações por Ambiente

O serviço suporta 3 ambientes:

1. **Development** (`FLASK_ENV=development`)
   - Debug: True
   - Log Level: DEBUG
   - Model Complexity: 1 (full)

2. **Production** (`FLASK_ENV=production`)
   - Debug: False
   - Log Level: INFO
   - Model Complexity: 1 (balanceado)
   - Metrics: Enabled

3. **Testing** (`FLASK_ENV=testing`)
   - Debug: True
   - Log Level: DEBUG
   - Model Complexity: 0 (lite - testes rápidos)
   - Max Frames: 5

---

## 🚀 Uso

### 1. Iniciar Serviço (Desenvolvimento)

```bash
# Modo desenvolvimento (Flask dev server)
python mediapipe_service.py
```

### 2. Iniciar Serviço (Produção)

```bash
# Produção com Gunicorn
gunicorn --bind 0.0.0.0:5000 \
         --workers 4 \
         --threads 2 \
         --timeout 120 \
         --log-level info \
         mediapipe_service:app
```

### 3. Verificar Health

```bash
curl http://localhost:5000/health

# Response:
{
  "status": "healthy",
  "service": "mediapipe-biomechanics",
  "version": "1.0.0",
  "config": {
    "model_complexity": 1,
    "max_frames": 20
  }
}
```

---

## 📡 API Endpoints

### 1. Health Check

```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "mediapipe-biomechanics",
  "version": "1.0.0"
}
```

---

### 2. Analyze Frames (Principal)

```bash
POST /analyze-frames
Content-Type: application/json

{
  "frames": [
    {
      "path": "/tmp/frame_001.jpg",
      "timestamp_ms": 0
    },
    {
      "path": "/tmp/frame_002.jpg",
      "timestamp_ms": 500
    }
  ],
  "exercise_type": "squat"
}
```

**Response:**
```json
{
  "success": true,
  "frames": [
    {
      "frame_number": 1,
      "timestamp_ms": 0,
      "phase": "top",
      "confidence": 0.952,
      "landmarks_3d": [
        {
          "id": 0,
          "name": "nose",
          "x": 320.5,
          "y": 120.3,
          "z": -0.12,
          "visibility": 0.98,
          "x_norm": 0.501,
          "y_norm": 0.167,
          "z_norm": -0.12
        },
        // ... 32 outros landmarks
      ],
      "angles": {
        "knee_left": 165.3,
        "knee_right": 163.8,
        "hip": 172.1,
        "trunk": 5.2,
        "ankle_left": 85.7,
        "ankle_right": 87.3,
        "knee_valgus_left": 2.1,
        "knee_valgus_right": 1.8,
        "pelvic_tilt": 3.5
      }
    },
    {
      "frame_number": 2,
      "timestamp_ms": 500,
      "phase": "eccentric",
      "confidence": 0.945,
      "angles": {
        "knee_left": 120.5,
        "knee_right": 118.2,
        "hip": 95.3,
        "trunk": 25.7,
        "ankle_left": 72.1,
        "ankle_right": 73.8,
        "knee_valgus_left": 5.3,
        "knee_valgus_right": 4.7,
        "pelvic_tilt": 8.2
      }
    }
  ],
  "duration_ms": 500,
  "processing_time_ms": 1234,
  "statistics": {
    "frames_processed": 2,
    "frames_total": 2,
    "success_rate": 1.0,
    "average_confidence": 0.949
  }
}
```

**Exercícios Suportados:**
- `squat`, `back-squat`, `front-squat`, `goblet-squat`
- `deadlift`, `romanian-deadlift`
- `bench-press`
- `overhead-press`, `military-press`

---

### 3. Analyze Single Frame (Debug)

```bash
POST /analyze-single-frame
Content-Type: application/json

{
  "frame_path": "/tmp/frame_001.jpg",
  "exercise_type": "squat"
}
```

**Response:**
```json
{
  "success": true,
  "landmarks": [...],
  "angles": {
    "knee_left": 165.3,
    "knee_right": 163.8,
    "hip": 172.1,
    "trunk": 5.2,
    "ankle_left": 85.7,
    "ankle_right": 87.3
  },
  "confidence": 0.952,
  "processing_time_ms": 234
}
```

---

### 4. Get Configuration

```bash
GET /config
```

**Response:**
```json
{
  "model_complexity": 1,
  "min_detection_confidence": 0.7,
  "min_tracking_confidence": 0.7,
  "max_frames_per_request": 20,
  "environment": "development"
}
```

---

### 5. Metrics (Opcional)

Se `ENABLE_METRICS=true`:

```bash
GET /metrics
```

**Response:** (Formato Prometheus)
```
# HELP mediapipe_requests_total Total requests
# TYPE mediapipe_requests_total counter
mediapipe_requests_total{endpoint="analyze_frames",status="success"} 1250

# HELP mediapipe_frames_processed_total Total frames processed
# TYPE mediapipe_frames_processed_total counter
mediapipe_frames_processed_total 7500

# HELP mediapipe_request_duration_seconds Request duration
# TYPE mediapipe_request_duration_seconds histogram
mediapipe_request_duration_seconds_bucket{le="0.5"} 120
mediapipe_request_duration_seconds_bucket{le="1.0"} 850
```

---

## 🐳 Docker

### Build

```bash
# Build image
docker build -t nfc-mediapipe-service .

# Verificar tamanho
docker images nfc-mediapipe-service
```

### Run

```bash
# Run container
docker run -d \
  --name mediapipe-service \
  -p 5000:5000 \
  -e MODEL_COMPLEXITY=1 \
  -e LOG_LEVEL=INFO \
  nfc-mediapipe-service

# Ver logs
docker logs -f mediapipe-service

# Verificar health
curl http://localhost:5000/health
```

### Docker Compose

```bash
# Iniciar todos os serviços (MediaPipe + Redis)
docker-compose up -d

# Ver logs
docker-compose logs -f mediapipe-service

# Parar serviços
docker-compose down

# Com Redis Commander (debug UI)
docker-compose --profile debug up -d
# Acessar: http://localhost:8081
```

---

## 🔧 Desenvolvimento

### Estrutura de Arquivos

```
python-services/
├── mediapipe_service.py       # API Flask principal
├── pose_detector.py           # Wrapper MediaPipe Pose
├── biomechanics_engine.py     # Cálculos biomecânicos
├── utils.py                   # Funções auxiliares
├── config.py                  # Configurações
├── requirements.txt           # Dependências
├── Dockerfile                 # Container
├── docker-compose.yml         # Orquestração
├── .dockerignore             # Otimização build
└── README.md                  # Este arquivo
```

### Adicionar Novo Exercício

1. **Adicionar cálculo de ângulos** em `biomechanics_engine.py`:

```python
def _calculate_my_exercise_angles(self, landmarks: List[Dict]) -> Dict[str, float]:
    angles = {}
    angles['custom_angle'] = self.calculate_custom_angle(landmarks)
    return angles
```

2. **Adicionar detecção de fase**:

```python
def _detect_my_exercise_phase(self, angles: Dict, frame_number: int, total_frames: int) -> str:
    # Lógica de detecção de fase
    if angles['custom_angle'] > 150:
        return 'top'
    # ...
```

3. **Registrar no método principal**:

```python
def calculate_angles(self, landmarks, exercise_type):
    if exercise_type == 'my-exercise':
        return self._calculate_my_exercise_angles(landmarks)
```

### Testing

```bash
# Instalar pytest
pip install pytest pytest-cov requests

# Criar test_mediapipe_service.py
# Rodar testes
pytest tests/ -v --cov=.

# Coverage report
pytest --cov=. --cov-report=html
```

---

## 🐛 Troubleshooting

### Erro: "No pose detected in image"

**Causa:** MediaPipe não conseguiu detectar pessoa na imagem

**Soluções:**
- Verificar se pessoa está visível e de corpo inteiro
- Reduzir `MIN_DETECTION_CONFIDENCE` (ex: 0.5)
- Verificar qualidade da imagem (resolução, iluminação)

---

### Erro: "Failed to load image"

**Causa:** Caminho do arquivo inválido ou imagem corrompida

**Soluções:**
- Verificar se arquivo existe: `ls -la /tmp/frame_001.jpg`
- Validar formato (JPG, PNG, BMP)
- Verificar permissões de leitura

---

### Performance Lenta

**Causa:** Model complexity muito alto ou hardware limitado

**Soluções:**
- Reduzir `MODEL_COMPLEXITY` para 0 (lite)
- Reduzir `MAX_FRAMES_PER_REQUEST`
- Aumentar workers do Gunicorn
- Usar GPU (requer versão GPU do MediaPipe)

---

### Memory Leak

**Causa:** MediaPipe não está sendo fechado corretamente

**Solução:**
```python
# Adicionar em pose_detector.py
def __del__(self):
    if hasattr(self, 'pose'):
        self.pose.close()
```

---

### Docker Build Falha

**Causa:** Falta de memória durante build

**Solução:**
```bash
# Aumentar memória do Docker
# Docker Desktop > Settings > Resources > Memory: 8GB

# Build com menos workers
docker build --memory=4g -t nfc-mediapipe-service .
```

---

## 📊 Performance

### Tempos Esperados (por frame)

| Model Complexity | Tempo Médio | Uso de CPU | Uso de RAM |
|------------------|-------------|------------|------------|
| 0 (lite)         | ~200ms      | 40%        | 500MB      |
| 1 (full)         | ~350ms      | 70%        | 800MB      |
| 2 (heavy)        | ~600ms      | 100%       | 1.5GB      |

### Otimizações

1. **Processar em lote**: Enviar múltiplos frames no mesmo request
2. **Usar lite model**: Para protótipos e testes
3. **Paralelizar workers**: Gunicorn com múltiplos workers
4. **GPU**: Versão GPU do MediaPipe (requer CUDA)

---

## 📚 Referências

- [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [OpenCV Python](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)

---

## 📝 Licença

Propriedade de NFC Comunidades © 2025

---

## 🤝 Suporte

Para issues e suporte:
- Email: contato@nfc.com
- Documentação: [WORKER_SETUP_GUIDE.md](../WORKER_SETUP_GUIDE.md)
