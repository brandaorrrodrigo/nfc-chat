# 🏠 GUIA DE SETUP LOCAL - HARDWARE DEDICADO

## 🎯 VISÃO GERAL

Este projeto foi configurado para rodar **100% LOCAL** usando seu hardware:
- **2x Intel i9** (CPUs)
- **3x NVIDIA RTX 3090** (GPUs com 24GB VRAM cada)
- **0 APIs pagas** (sem OpenAI, Anthropic, Pinecone)

---

## 📦 STACK LOCAL

| Componente | Tecnologia | Localização |
|------------|-----------|-------------|
| **LLM Principal** | Llama 3.1 70B | GPU 0 (via Ollama) |
| **LLM Rápido** | Llama 3.1 8B | GPU 1 (via Ollama) |
| **Vision AI** | LLaVA 13B | GPU 2 (via Ollama) |
| **Embeddings** | nomic-embed-text | CPU/GPU compartilhado |
| **Vector DB** | ChromaDB | Docker (localhost:8000) |
| **Cache** | Redis | Docker (localhost:6379) |
| **Database** | PostgreSQL | Docker (localhost:5432) |

---

## 🚀 INSTALAÇÃO PASSO A PASSO

### **PASSO 1: Instalar Ollama (Gerenciador de LLMs)**

```bash
# Windows (PowerShell como Admin)
winget install Ollama.Ollama

# OU baixar instalador:
# https://ollama.com/download/windows

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Verificar instalação
ollama --version
```

### **PASSO 2: Pull dos Modelos de IA**

```bash
# LLM Principal (Llama 3.1 70B) - ~40GB
ollama pull llama3.1:70b

# LLM Rápido (Llama 3.1 8B) - ~4.7GB
ollama pull llama3.1:8b

# Vision (LLaVA 13B) - ~8GB
ollama pull llava:13b

# Embeddings (Nomic Embed) - ~274MB
ollama pull nomic-embed-text
```

**⚠️ IMPORTANTE:**
- O download total é ~53GB
- O Llama 70B precisa de ~48GB de VRAM livre (2x RTX 3090)
- Deixe os downloads rodando (pode levar 30-60 min)

### **PASSO 3: Configurar Variáveis de Ambiente**

```bash
# Copiar template
cp .env.local.example .env.local

# Editar .env.local com suas configurações
```

**Variáveis principais:**
```bash
# Database
DATABASE_URL="postgresql://nfc:sua_senha@localhost:5432/nfc_admin"

# Ollama
OLLAMA_URL="http://localhost:11434"
DEFAULT_LLM_MODEL="llama3.1:70b"
FAST_LLM_MODEL="llama3.1:8b"
VISION_MODEL="llava:13b"

# ChromaDB
CHROMADB_URL="http://localhost:8000"

# GPUs
CUDA_VISIBLE_DEVICES="0,1,2"
GPU_LLM_MAIN="0"
GPU_LLM_FAST="1"
GPU_VISION="2"
```

### **PASSO 4: Iniciar Serviços (Docker)**

```bash
# Subir PostgreSQL + Redis + ChromaDB
docker-compose up -d

# Verificar que todos estão rodando
docker-compose ps
```

**Serviços esperados:**
- ✅ `nfc-postgres` (porta 5432)
- ✅ `nfc-redis` (porta 6379)
- ✅ `nfc-chromadb` (porta 8000)

### **PASSO 5: Setup do Banco de Dados**

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar database e tabelas
npx prisma migrate dev --name init

# Popular com dados iniciais
npx ts-node prisma/seed.ts
```

### **PASSO 6: Iniciar Aplicação**

```bash
# Desenvolvimento
npm run dev

# Aplicação estará em: http://localhost:3001
```

**Login padrão:**
- Email: `admin@nutrifitcoach.com`
- Senha: `admin123`

---

## 🎮 GERENCIAMENTO DE GPUs

### **Distribuição Recomendada**

```
GPU 0 (24GB) → Llama 3.1 70B (Modelo Principal)
GPU 1 (24GB) → Llama 3.1 8B (Respostas Rápidas)
GPU 2 (24GB) → LLaVA 13B (Análise de Imagens)
```

### **Configurar Ollama para usar GPUs específicas**

```bash
# Windows (PowerShell)
$env:CUDA_VISIBLE_DEVICES="0,1"
ollama serve

# Linux/Mac
CUDA_VISIBLE_DEVICES=0,1 ollama serve
```

### **Monitorar GPUs em Tempo Real**

```bash
# Comando nvidia-smi watch
watch -n 1 nvidia-smi

# OU use o Dashboard (widget GPU Monitor)
```

---

## 🧪 TESTAR COMPONENTES

### **1. Testar Ollama**

```bash
# Testar Llama 70B
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:70b",
  "prompt": "Explique proteína em 3 linhas",
  "stream": false
}'

# Testar Vision (LLaVA)
ollama run llava:13b
# >>> /help para comandos
```

### **2. Testar ChromaDB**

```bash
curl http://localhost:8000/api/v1/heartbeat

# Deve retornar: {"nanosecond heartbeat": ...}
```

### **3. Testar Embeddings**

```bash
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "teste de embedding"
}'
```

---

## 📊 PERFORMANCE ESPERADA

| Modelo | VRAM Usada | Tokens/seg | Latência (primeira resposta) |
|--------|-----------|------------|------------------------------|
| **Llama 70B** | ~45GB | 15-20 | ~3-5s |
| **Llama 8B** | ~5GB | 80-100 | <1s |
| **LLaVA 13B** | ~12GB | 10-15 | ~5-8s |

**Dicas de Otimização:**
- Use `llama3.1:8b` para respostas rápidas (flag `useFastModel: true`)
- Configure `aiCooldown` nas Arenas para evitar spam de GPU
- Cache de embeddings no Redis reduz carga

---

## 🐛 TROUBLESHOOTING

### **Problema: "Ollama not available"**

```bash
# Verificar se Ollama está rodando
ollama list

# Reiniciar Ollama
# Windows: Fechar pela bandeja e abrir novamente
# Linux:
sudo systemctl restart ollama
```

### **Problema: "CUDA out of memory"**

**Causa:** Modelo muito grande para a VRAM disponível.

**Soluções:**
1. Usar modelo menor: `llama3.1:8b` em vez de `70b`
2. Fechar outros processos usando GPU
3. Configurar quantização:
   ```bash
   # Pull versão quantizada (menor precisão, menos VRAM)
   ollama pull llama3.1:70b-q4_0
   ```

### **Problema: Respostas lentas**

1. **Verificar uso de GPU:**
   ```bash
   nvidia-smi
   # GPU Util deve estar 90-100% durante geração
   ```

2. **Usar modelo mais rápido:**
   ```typescript
   // No código, flag para usar Llama 8B
   useFastModel: true
   ```

3. **Reduzir `num_predict` (max tokens):**
   ```typescript
   // lib/ai/llm.ts
   options: {
     num_predict: 300 // era 500
   }
   ```

### **Problema: ChromaDB não conecta**

```bash
# Verificar se container está rodando
docker ps | grep chromadb

# Ver logs
docker logs nfc-chromadb

# Reiniciar
docker-compose restart chromadb
```

---

## 🔧 COMANDOS ÚTEIS

### **Ollama**
```bash
ollama list                    # Listar modelos instalados
ollama rm llama3.1:70b        # Remover modelo
ollama ps                      # Ver modelos em execução
ollama serve                   # Iniciar servidor manualmente
```

### **Docker**
```bash
docker-compose up -d           # Subir todos os serviços
docker-compose down            # Parar todos
docker-compose logs -f         # Ver logs em tempo real
docker-compose restart redis   # Reiniciar serviço específico
```

### **GPU Monitoring**
```bash
nvidia-smi                     # Status instantâneo
watch -n 1 nvidia-smi         # Update a cada 1s
nvidia-smi dmon               # Device monitoring contínuo
```

---

## 📈 PRÓXIMAS OTIMIZAÇÕES

- [ ] Implementar **vLLM** para inferência ainda mais rápida
- [ ] Usar **TensorRT** para otimizar modelos
- [ ] Configurar **KV cache** para respostas sequenciais
- [ ] Load balancing automático entre GPUs
- [ ] Quantização dinâmica baseada em carga

---

## 🆘 SUPORTE

**Documentação:**
- Ollama: https://ollama.com/docs
- ChromaDB: https://docs.trychroma.com
- LLaVA: https://llava-vl.github.io

**Troubleshooting:**
- Ver logs: `docker-compose logs`
- Dashboard: GPU Monitor widget
- Healthcheck: `/api/hardware/gpu`

---

## ✅ CHECKLIST FINAL

Antes de começar a usar:

- [ ] Ollama instalado e rodando
- [ ] Modelos baixados (llama3.1:70b, 8b, llava, nomic-embed)
- [ ] Docker Compose rodando (postgres, redis, chromadb)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado e populado
- [ ] Aplicação rodando em localhost:3001
- [ ] GPU Monitor mostrando 3 GPUs

**Status esperado no Dashboard:**
- ✅ Database: Operacional
- ✅ Redis Cache: Operacional
- ✅ Ollama (Llama 3.1 70B): Local - GPU 0
- ✅ ChromaDB (RAG): Local - Docker
- ✅ LLaVA Vision: Local - GPU 2

---

🎉 **Setup Completo! Você agora tem um sistema de IA 100% local e poderoso!**
