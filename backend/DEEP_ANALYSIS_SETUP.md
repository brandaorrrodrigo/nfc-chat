# 🚀 Deep Analysis - Guia de Setup Completo

Guia passo-a-passo para configurar e testar o sistema Deep Analysis + RAG.

---

## ✅ Pré-requisitos

- Node.js 18+
- Docker (para Qdrant)
- Ollama instalado
- Redis rodando

---

## 📦 Passo 1: Instalar Dependências

```bash
cd backend
npm install @qdrant/js-client-rest ioredis
```

---

## 🐳 Passo 2: Iniciar Serviços

### 2.1 Qdrant (Vector Database)

```bash
# Opção 1: Docker (recomendado)
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant

# Opção 2: Download binário
# https://qdrant.tech/documentation/quick-start/

# Verificar
curl http://localhost:6333/collections
```

### 2.2 Ollama (LLM)

```bash
# Instalar Ollama
# Linux/Mac
curl https://ollama.ai/install.sh | sh

# Windows
# Download: https://ollama.ai/download

# Iniciar Ollama
ollama serve

# Pull modelos necessários
ollama pull llama3.1:8b        # LLM principal
ollama pull nomic-embed-text   # Embeddings

# Verificar
ollama list
```

### 2.3 Redis

```bash
# Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Ou local
# Ubuntu: sudo apt-get install redis-server
# Mac: brew install redis

# Verificar
redis-cli ping
# Esperado: PONG
```

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

Adicionar ao `backend/.env`:

```env
# ===== Qdrant =====
QDRANT_URL=http://localhost:6333

# ===== Ollama =====
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3.1:8b
OLLAMA_MAX_RETRIES=3
OLLAMA_TIMEOUT=120000

# ===== Embeddings =====
EMBEDDING_MODEL=nomic-embed-text
EMBEDDING_CACHE_ENABLED=true
EMBEDDING_CACHE_TTL=86400

# ===== Redis (Cache) =====
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 📚 Passo 4: Adicionar Documentos Científicos

### 4.1 Criar Diretório

```bash
mkdir -p backend/scientific-papers
```

### 4.2 Adicionar Documentos JSON

Copiar documentos no formato:

```json
{
  "title": "Study Title",
  "authors": "Author A, Author B",
  "year": 2020,
  "journal": "Journal Name",
  "doi": "10.1234/example",
  "content": "Full study text...",
  "metadata": {
    "evidence_level": "rct",
    "deviation_types": ["knee_valgus"],
    "exercise_categories": ["lower_body_compound"]
  }
}
```

**Exemplos já inclusos:**
- `example-knee-valgus.json`
- `example-butt-wink.json`

### 4.3 Popular RAG

```bash
# Executar script de população
npx ts-node backend/scripts/populate-rag.ts

# Ou adicionar ao package.json:
# "populate-rag": "ts-node scripts/populate-rag.ts"
npm run populate-rag
```

**Output esperado:**
```
🚀 Starting RAG population...
📊 Checking Qdrant connection...
✓ Qdrant connection OK
📁 Documents path: /path/to/scientific-papers
📈 Current status: 0 chunks in database
⚙️  Processing documents...
✓ Processed: Dynamic Knee Valgus: Prevention... (42 chunks)
✓ Processed: Lumbar Flexion During Deep Squatting... (38 chunks)
✅ RAG population completed!
📊 Total chunks in database: 80
➕ Chunks added: 80
```

---

## 🧪 Passo 5: Testar Sistema

### 5.1 Teste Rápido (Componentes)

```bash
# Teste individual
curl http://localhost:6333/collections  # Qdrant
curl http://localhost:11434/api/tags    # Ollama
redis-cli ping                           # Redis
```

### 5.2 Teste Completo (Script)

```bash
npx ts-node backend/scripts/test-deep-analysis.ts

# Ou adicionar ao package.json:
# "test-deep-analysis": "ts-node scripts/test-deep-analysis.ts"
npm run test-deep-analysis
```

**Output esperado:**
```
🧪 Starting Deep Analysis Integration Test

1️⃣  Testing Qdrant connection...
✅ Qdrant OK - 80 chunks available

2️⃣  Testing Ollama connection...
✅ Ollama OK - 3 models available
   Models: llama3.1:8b, nomic-embed-text, ...

3️⃣  Testing RAG search...
✅ RAG Search OK
   Found: 3 chunks from 2 sources
   Top source: "Dynamic Knee Valgus: Prevention..."
   Relevance: 0.875

4️⃣  Testing LLM generation...
✅ LLM Generation OK
   Response: "Hello from Deep Analysis Test! ..."

5️⃣  Testing full Deep Analysis pipeline...
✅ Deep Analysis OK
   Processing time: 34567ms
   Sources used: 2
   Deviations analyzed: knee_valgus, butt_wink
   Narrative length: 1823 chars

📄 Narrative Preview:
────────────────────────────────────────────────────────────
## Resumo Executivo

A análise biomecânica identificou dois desvios críticos...
(truncated)
────────────────────────────────────────────────────────────

✨ All tests passed!
🎉 Deep Analysis system is fully operational!
```

---

## 🔧 Passo 6: Integrar com Worker

Adicionar no `hybrid-analysis.worker.ts`:

```typescript
// Stage 5: Deep Analysis (CONDITIONAL)
if (decision.shouldRun) {
  await job.progress(60);
  this.logger.log('Starting deep analysis with RAG + LLM');

  const deepResult = await this.deepAnalysisService.analyze({
    quickAnalysis: quickResult,
    exerciseId: job.data.exerciseId,
    userId: job.data.userId,
    estimatedTime: 35000,
  });

  if (deepResult) {
    // Salvar resultado no banco
    await this.prisma.deepAnalysisResult.create({
      data: {
        video_analysis_id: videoAnalysis.id,
        rag_sources_used: deepResult.rag_sources_used,
        llm_narrative: deepResult.llm_narrative,
        scientific_context: deepResult.scientific_context,
        processing_time_ms: deepResult.processing_time_ms,
      },
    });

    this.logger.log(`Deep analysis completed - ${deepResult.rag_sources_used.length} sources used`);
  }
}
```

---

## 📊 Passo 7: Monitorar Performance

### Logs Importantes

```typescript
// Deep Analysis
logger.log('Starting deep analysis...');
logger.log('RAG retrieved X chunks from Y sources');
logger.log('Deep analysis completed in Xms');

// RAG
logger.debug('RAG query: "..."');
logger.log('RAG found X chunks from Y sources');

// Ollama
logger.debug('Ollama generate attempt X/Y');
logger.log('Ollama generation completed in Xms');
```

### Métricas

1. **Processing Time**: Deve ser ~30-40s para deep analysis
2. **RAG Sources**: Deve encontrar 2-5 fontes por desvio
3. **Cache Hit Rate**: ~70% após algumas execuções
4. **LLM Retry Rate**: Deve ser <5%

---

## 🐛 Troubleshooting

### Erro: "Qdrant connection refused"

```bash
# Verificar se está rodando
docker ps | grep qdrant

# Iniciar se necessário
docker start qdrant

# Ou criar novo
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
```

### Erro: "Ollama not found"

```bash
# Verificar instalação
ollama --version

# Verificar se está rodando
curl http://localhost:11434/api/tags

# Iniciar Ollama
ollama serve &
```

### Erro: "Model not found"

```bash
# Pull modelo
ollama pull llama3.1:8b
ollama pull nomic-embed-text

# Verificar
ollama list
```

### Erro: "No scientific context found"

```bash
# Verificar se RAG foi populado
curl http://localhost:6333/collections/biomechanics_knowledge

# Se vazio, popular novamente
npm run populate-rag
```

### Performance Lenta

**Problema**: Deep analysis demora >60s

**Soluções**:
1. Usar modelo Ollama mais leve: `ollama pull llama3.1:7b`
2. Reduzir topK: `topK: 2` (menos chunks por desvio)
3. Habilitar cache: `EMBEDDING_CACHE_ENABLED=true`
4. Verificar hardware: Ollama precisa de boa CPU/GPU

---

## ✅ Checklist Final

- [ ] Qdrant rodando (port 6333)
- [ ] Ollama rodando (port 11434)
- [ ] Modelos baixados (llama3.1:8b, nomic-embed-text)
- [ ] Redis rodando (port 6379)
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas
- [ ] Documentos científicos adicionados
- [ ] RAG populado (>50 chunks)
- [ ] Teste de integração passou
- [ ] Logs aparecem corretamente
- [ ] Performance aceitável (<40s)

---

## 📚 Próximos Passos

1. ✅ **Setup completo** (você está aqui!)
2. 🔄 Adicionar mais documentos científicos
3. 🔄 Ajustar prompts para melhor qualidade
4. 🔄 Monitorar performance em produção
5. 🔄 Implementar cache L3 para RAG results
6. 🚀 Deploy em produção

---

## 🎉 Sucesso!

Se todos os checks passaram, seu sistema Deep Analysis está **pronto para produção**! 🚀

Para mais detalhes, consulte:
- `DEEP_ANALYSIS_README.md` - Documentação completa
- `scripts/populate-rag.ts` - Script de população
- `scripts/test-deep-analysis.ts` - Script de teste
