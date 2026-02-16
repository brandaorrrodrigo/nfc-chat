# 🚀 Quick Start - Docker Local com Ollama

Guia rápido para rodar o NFC/NFV completo no seu PC com Docker, Ollama e IAs locais.

---

## ✅ Pré-requisitos

Certifique-se que você tem instalado:

- ✅ Docker Desktop for Windows
- ✅ Docker Compose
- ✅ Ollama rodando localmente
- ✅ Modelo `llama3.1` baixado no Ollama

### Verificar Ollama

```bash
# Verificar se Ollama está rodando
ollama list

# Se não tiver llama3.1, baixar:
ollama pull llama3.1
```

---

## 🎯 Iniciar Sistema Completo

### Opção 1: Com Makefile (Recomendado)

```bash
cd docker
make start
```

### Opção 2: Docker Compose Manual

```bash
cd docker
docker-compose up -d
```

---

## 🔧 Serviços Disponíveis

Após iniciar, você terá:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface Next.js |
| **API** | http://localhost:3000/api | Endpoints REST |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache e filas |
| **MinIO** | http://localhost:9001 | Object storage (console) |
| **MinIO API** | http://localhost:9000 | Storage API |
| **Ollama** | http://localhost:11434 | LLM local |

---

## 📊 Análise Biomecânica

### Como Funciona Localmente

1. **Upload de Vídeo**
   - Acesse: http://localhost:3000/biomechanics/videos
   - Faça upload do vídeo de exercício

2. **Análise Automática**
   - Sistema extrai frames com FFmpeg
   - Python + MediaPipe detecta pose (33 landmarks)
   - Calcula ROM, ângulos, métricas motoras/estabilizadoras
   - Ollama (llama3.1) gera relatório textual

3. **Resultado**
   - ROM como diferença: "139° (de 174° a 35°)"
   - 3 pontos de análise: start/peak/range
   - Classificação: excellent/good/acceptable/warning/danger
   - Mensagens contextuais por stabilityMode

### Exercícios Suportados (V2)

1. ✅ back_squat - Agachamento Livre
2. ✅ deadlift_conventional - Levantamento Terra
3. ✅ chest_supported_row - Remada com Apoio
4. ✅ lateral_raise - Elevação Lateral
5. ✅ bench_press - Supino Reto
6. ✅ hip_thrust - Elevação Pélvica
7. ✅ barbell_row - Remada Curvada
8. ✅ cable_row - Remada no Cabo

---

## 🔄 Re-analisar Vídeos Antigos

Para atualizar os 3 vídeos de exemplo com novo formato:

### Via API

```bash
# Agachamento
curl -X POST http://localhost:3000/api/biomechanics/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoId":"va_1770817487770_noye0o9k1"}'

# Terra
curl -X POST http://localhost:3000/api/biomechanics/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoId":"va_1770817584163_afof17p9k"}'

# Puxadas
curl -X POST http://localhost:3000/api/biomechanics/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoId":"va_1770817621743_j5dzbciws"}'
```

### Via Dashboard

1. Acesse: http://localhost:3000/biomechanics/dashboard
2. Clique em "Re-analisar" para cada vídeo
3. Aguarde ~42s por vídeo

---

## 🛠️ Comandos Úteis

### Ver Logs

```bash
# Todos os serviços
make logs

# Apenas API
make logs-api

# Apenas Worker
make logs-worker

# Apenas Postgres
docker-compose logs -f postgres
```

### Health Check

```bash
# Verificar saúde de todos os serviços
make health

# OU manualmente
curl http://localhost:3000/api/health
```

### Parar Sistema

```bash
# Parar todos os serviços
make stop

# OU
docker-compose down
```

### Reiniciar

```bash
make restart
```

### Backup Database

```bash
./scripts/backup.sh
```

### Limpar Tudo

```bash
make clean
```

---

## 🐛 Troubleshooting

### Porta 3000 já em uso

```bash
# Ver processo usando porta 3000
netstat -ano | findstr :3000

# Matar processo (no Task Manager ou via PID)
```

### Ollama não conecta

Verifique se Ollama está rodando:
```bash
ollama list
```

Se não estiver, inicie:
```bash
# Windows: Abra "Ollama" no menu iniciar
```

### FFmpeg não encontrado

Verifique se FFmpeg está no PATH:
```bash
ffmpeg -version
```

Se não estiver, reinstale ou adicione ao PATH.

### Python/MediaPipe erro

Verifique instalação Python:
```bash
python --version  # Deve ser 3.11.9
pip list | grep mediapipe  # Deve mostrar 0.10.31
```

### Erro de permissão no Windows

Execute PowerShell como Administrador e rode:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📦 Estrutura de Dados

### Novo Formato de Resultado

```json
{
  "overallScore": 7.8,
  "motorScore": 9.3,
  "stabilizerScore": 5.5,
  "stabilityMode": "rigid",
  "motorMetrics": [
    {
      "joint": "knee",
      "rom": {
        "value": 139,
        "startAngle": 174,
        "peakAngle": 35,
        "classification": "excellent"
      }
    },
    {
      "joint": "hip",
      "rom": {
        "value": 95,
        "startAngle": 168,
        "peakAngle": 74,
        "classification": "good"
      }
    }
  ],
  "contextualMessages": [
    "Excelente profundidade! ROM de joelho de 139° indica agachamento completo.",
    "Modo de estabilidade 'rigid': foco em manter posição fixa do tronco."
  ]
}
```

---

## 🎯 Próximos Passos

1. ✅ Inicie o sistema: `make start`
2. ✅ Acesse dashboard: http://localhost:3000/biomechanics/dashboard
3. ✅ Re-analise os 3 vídeos de exemplo
4. ✅ Faça upload de novos vídeos
5. ✅ Veja resultados com novo formato (ROM diferença, 3 pontos, stabilityMode)

---

## 📞 Suporte

Se tiver problemas:
1. Verifique logs: `make logs`
2. Verifique health: `make health`
3. Consulte TROUBLESHOOTING.md
4. Verifique MONITORING.md para métricas

---

**Sistema 100% funcional localmente!** 🎉

Análise biomecânica com:
- ✅ ROM como diferença
- ✅ Análise em 3 pontos
- ✅ stabilityMode contextual
- ✅ 8 exercícios V2
- ✅ Ollama + IAs locais
