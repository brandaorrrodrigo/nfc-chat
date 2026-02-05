# 🧠 Deep Analysis + RAG System

Sistema completo de análise profunda usando **RAG (Retrieval Augmented Generation)** + **LLM** para gerar relatórios biomecânicos científicos.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Setup](#setup)
- [Uso](#uso)
- [Pipeline RAG](#pipeline-rag)
- [Documentos Científicos](#documentos-científicos)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema Deep Analysis é a **Camada 2** do pipeline híbrido, executada APENAS quando a análise rápida detecta problemas críticos. Combina:

1. **RAG (Retrieval Augmented Generation)**: Busca contexto científico relevante
2. **LLM (Ollama)**: Gera narrativa profissional baseada em evidências
3. **Vector Store (Qdrant)**: Armazena e busca documentos científicos
4. **Embeddings**: Representação vetorial de textos para busca semântica

---

## 🏗️ Arquitetura

```
┌────────────────────────────────────────────────────────┐
│           DEEP ANALYSIS SERVICE                        │
│  (Orquestrador principal)                              │
└──────────────────┬─────────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ↓                       ↓
┌──────────────┐      ┌──────────────┐
│ RAG SERVICE  │      │ OLLAMA       │
│              │      │ SERVICE      │
│ - Search     │      │              │
│ - Consolidate│      │ - Generate   │
│ - Filter     │      │ - Retry      │
└──────┬───────┘      └──────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│   EMBEDDING SERVICE                  │
│   (com cache Redis)                  │
│                                      │
│   - Generate embeddings              │
│   - Batch processing                 │
│   - Cache L2 (24h)                   │
└───────────────┬──────────────────────┘
                │
                ↓
┌──────────────────────────────────────┐
│   VECTOR STORE SERVICE (Qdrant)      │
│                                      │
│   - Similarity search                │
│   - Filtros (deviation, evidence)    │
│   - Indexação                        │
└───────────────┬──────────────────────┘
                │
                ↓
┌──────────────────────────────────────┐
│   DOCUMENT PROCESSOR SERVICE         │
│                                      │
│   - Chunk documents                  │
│   - Generate embeddings              │
│   - Index in Qdrant                  │
└──────────────────────────────────────┘
```

---

## 📦 Componentes

### 1. Deep Analysis Service
**Arquivo**: `deep-analysis.service.ts`

- Orquestrador principal
- Identifica desvios críticos
- Busca contexto via RAG
- Gera narrativa com LLM
- Retorna relatório completo

**Métodos principais**:
```typescript
async analyze(input: DeepAnalysisInputDto): Promise<DeepAnalysisOutputDto>
```

### 2. RAG Service
**Arquivo**: `rag/rag.service.ts`

- Busca contexto científico relevante
- Constrói queries otimizadas
- Filtra por evidência científica
- Consolida resultados de múltiplas buscas

**Métodos principais**:
```typescript
async searchContext(params: RagSearchParamsDto): Promise<RagSearchResultDto>
async searchMultipleDeviations(...): Promise<IScientificContext>
```

### 3. Embedding Service
**Arquivo**: `rag/embedding.service.ts`

- Gera embeddings usando Ollama (nomic-embed-text)
- **Cache Redis**: TTL 24h
- Batch processing (10 por vez)
- Normalização de texto

**Métodos principais**:
```typescript
async generateEmbedding(text: string): Promise<number[]>
async generateEmbeddings(texts: string[]): Promise<number[][]>
```

### 4. Vector Store Service
**Arquivo**: `rag/vector-store.service.ts`

- Interface com Qdrant
- Busca por similaridade (cosine)
- Filtros avançados
- Gestão de coleções

**Métodos principais**:
```typescript
async search(params: IVectorSearchParams): Promise<IVectorSearchResult[]>
async upsert(collectionName: string, points: IQdrantPoint[]): Promise<void>
```

### 5. Document Processor Service
**Arquivo**: `rag/document-processor.service.ts`

- Processa documentos científicos
- Chunking com overlap (400 palavras)
- Geração de embeddings
- Indexação no Qdrant

**Métodos principais**:
```typescript
async processAndIndexDocuments(documentsPath: string): Promise<void>
async processDocument(document: IScientificDocument): Promise<number>
```

### 6. Ollama Service
**Arquivo**: `ollama/ollama.service.ts`

- Integração com Ollama LLM
- Retry logic (3 tentativas)
- Exponential backoff
- Geração de embeddings

**Métodos principais**:
```typescript
async generate(request: OllamaGenerateRequestDto): Promise<OllamaGenerateResponseDto>
async generateEmbedding(text: string): Promise<number[]>
```

---

## 🚀 Setup

### Pré-requisitos

1. **Qdrant** (Vector Database)
2. **Ollama** (LLM local)
3. **Redis** (Cache)

### 1. Instalar Qdrant

```bash
# Docker
docker run -p 6333:6333 qdrant/qdrant

# Ou baixar: https://qdrant.tech/documentation/quick-start/
```

### 2. Instalar Ollama

```bash
# Linux/Mac
curl https://ollama.ai/install.sh | sh

# Windows: https://ollama.ai/download

# Pull models necessários
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

### 3. Configurar Variáveis de Ambiente

```env
# .env
QDRANT_URL=http://localhost:6333
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3.1:8b
OLLAMA_MAX_RETRIES=3

EMBEDDING_MODEL=nomic-embed-text
EMBEDDING_CACHE_ENABLED=true
EMBEDDING_CACHE_TTL=86400

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Instalar Dependências

```bash
cd backend
npm install @qdrant/js-client-rest ioredis
```

### 5. Popular RAG com Documentos Científicos

```bash
# Adicionar documentos JSON em: backend/scientific-papers/

# Executar script de população
npm run populate-rag

# Ou com caminho customizado
npm run populate-rag -- --path=./my-papers
```

---

## 📚 Documentos Científicos

### Formato JSON

```json
{
  "title": "Study Title",
  "authors": "Smith J, Doe A",
  "year": 2020,
  "journal": "Journal Name",
  "doi": "10.1234/example",
  "abstract": "Study abstract...",
  "keywords": ["keyword1", "keyword2"],
  "content": "Full text of the study...",
  "metadata": {
    "evidence_level": "rct",
    "deviation_types": ["knee_valgus", "butt_wink"],
    "exercise_categories": ["lower_body_compound"],
    "study_type": "randomized-controlled-trial",
    "sample_size": 100,
    "population": "Athletes"
  }
}
```

### Níveis de Evidência (Ordem de Prioridade)

1. **meta-analysis** - Meta-análise
2. **systematic-review** - Revisão sistemática
3. **rct** - Randomized Controlled Trial
4. **cohort** - Estudo de coorte
5. **case-control** - Caso-controle
6. **case-series** - Série de casos
7. **expert-opinion** - Opinião de especialistas

### Tipos de Desvio Suportados

- `knee_valgus` - Valgo de joelho
- `butt_wink` - Retroversão pélvica
- `forward_lean` - Inclinação anterior excessiva
- `heel_rise` - Elevação dos calcanhares
- `asymmetric_loading` - Carga assimétrica
- `excessive_spinal_flexion` - Flexão espinhal excessiva
- `shoulder_impingement` - Impacto de ombro
- `hip_shift` - Desvio lateral do quadril

---

## 🔄 Pipeline RAG

### Fluxo Completo

```
1. Quick Analysis detecta desvios críticos
        ↓
2. Deep Analysis Service inicia
        ↓
3. Para cada desvio crítico:
   a. RAG Service constrói query otimizada
   b. Embedding Service gera embedding da query
      - Verifica cache Redis
      - Se miss: chama Ollama
   c. Vector Store busca documentos similares
      - Filtros: deviation_type, evidence_level, year
      - Top K chunks (3 por desvio)
   d. Extrai fontes científicas únicas
        ↓
4. Consolida resultados de múltiplas buscas
        ↓
5. Constrói prompt com contexto científico
        ↓
6. Ollama LLM gera narrativa profissional
   - Retry logic (3x)
   - Exponential backoff
        ↓
7. Retorna relatório completo
```

### Busca Vetorial

**Similaridade**: Cosine distance

**Filtros aplicados**:
- `deviation_type`: Tipo de desvio
- `exercise_category`: Categoria do exercício
- `evidence_level`: RCT, systematic-review, meta-analysis
- `year`: >= 2010

**Score threshold**: 0.5 (relevância mínima)

---

## ⚡ Performance

### Tempos Esperados

| Componente | Tempo | Notas |
|------------|-------|-------|
| Embedding generation | ~200ms | Por texto (cache miss) |
| Vector search | ~50ms | Qdrant local |
| LLM generation | ~10-30s | Depende do hardware |
| **Total Deep Analysis** | ~35s | 2 desvios, 6 chunks |

### Otimizações

1. **Cache de Embeddings (Redis)**
   - Hit rate esperado: ~70%
   - TTL: 24 horas
   - Reduz tempo em ~200ms por busca

2. **Batch Processing**
   - Processa 10 embeddings por vez
   - Reduz overhead de chamadas HTTP

3. **Índices Qdrant**
   - Índices em: deviation_type, exercise_category, evidence_level
   - Busca ~10x mais rápida

4. **Retry com Backoff**
   - Ollama pode falhar temporariamente
   - 3 tentativas com 2^n * 1000ms delay

---

## 🧪 Testing

```bash
# Testes unitários
npm test deep-analysis.service.spec

# Testes de integração
npm test -- --testPathPattern=deep-analysis.integration

# Coverage
npm run test:cov
```

---

## 🐛 Troubleshooting

### Erro: "Qdrant connection refused"

**Causa**: Qdrant não está rodando

**Solução**:
```bash
docker run -d -p 6333:6333 qdrant/qdrant
```

### Erro: "Ollama generate timeout"

**Causa**: LLM está lento ou modelo não está carregado

**Soluções**:
```bash
# Verificar se Ollama está rodando
ollama list

# Pull modelo se necessário
ollama pull llama3.1:8b

# Aumentar timeout (backend/.env)
OLLAMA_TIMEOUT=180000  # 3 minutos
```

### Erro: "No scientific context found"

**Causa**: RAG não tem documentos indexados

**Solução**:
```bash
# Popular RAG
npm run populate-rag

# Verificar quantos chunks
curl http://localhost:6333/collections/biomechanics_knowledge
```

### Performance Lenta

**Causas**:
1. Modelo Ollama muito pesado
2. Cache Redis desabilitado
3. Hardware limitado

**Soluções**:
```bash
# 1. Usar modelo mais leve
ollama pull llama3.1:7b

# 2. Habilitar cache
EMBEDDING_CACHE_ENABLED=true

# 3. Reduzir topK
topK: 2  # Menos chunks por desvio
```

---

## 📊 Monitoramento

### Métricas Importantes

1. **RAG Performance**
   - Average relevance score
   - Cache hit rate
   - Documents retrieved per query

2. **LLM Performance**
   - Generation time
   - Retry rate
   - Token usage

3. **System Health**
   - Qdrant status
   - Ollama availability
   - Redis connection

### Logs

```typescript
// Deep Analysis logs
logger.log('Starting deep analysis...');
logger.log('RAG retrieved X chunks from Y sources');
logger.log('Deep analysis completed in Xms');

// RAG logs
logger.debug('RAG query: "..."');
logger.log('RAG found X chunks from Y sources');

// Ollama logs
logger.debug('Ollama generate attempt X/Y');
logger.log('Ollama generation completed in Xms');
```

---

## 🎯 Uso no Código

### Exemplo Básico

```typescript
import { DeepAnalysisService } from './deep-analysis.service';

// No worker ou controller
const deepAnalysis = await deepAnalysisService.analyze({
  quickAnalysis: quickResult,
  exerciseId: 'back-squat',
  userId: 'user_123',
  estimatedTime: 35000,
});

if (deepAnalysis) {
  console.log('Narrative:', deepAnalysis.llm_narrative);
  console.log('Sources:', deepAnalysis.rag_sources_used.length);
  console.log('Processing time:', deepAnalysis.processing_time_ms);
}
```

### Integração com Worker

```typescript
// Stage 5: Deep Analysis (CONDITIONAL)
if (decision.shouldRun) {
  await job.progress(60);

  const deepResult = await this.deepAnalysis.analyze({
    quickAnalysis: quickResult,
    exerciseId: job.data.exerciseId,
    userId: job.data.userId,
    estimatedTime: 35000,
  });

  // Salvar no banco
  await this.prisma.deepAnalysisResult.create({
    data: {
      video_analysis_id: videoAnalysis.id,
      rag_sources_used: deepResult.rag_sources_used,
      llm_narrative: deepResult.llm_narrative,
      scientific_context: deepResult.scientific_context,
      processing_time_ms: deepResult.processing_time_ms,
    },
  });
}
```

---

## 📝 Checklist de Setup

- [ ] Qdrant instalado e rodando (port 6333)
- [ ] Ollama instalado e rodando (port 11434)
- [ ] Modelos Ollama baixados (llama3.1:8b, nomic-embed-text)
- [ ] Redis rodando (port 6379)
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências NPM instaladas
- [ ] Documentos científicos em `scientific-papers/`
- [ ] Script `populate-rag` executado
- [ ] Testes passando

---

## 🎉 Status

✅ **Sistema completo e funcional!**

- 6 serviços criados
- RAG com Qdrant + Ollama
- Cache Redis para embeddings
- Retry logic robusto
- Testes unitários
- Script de população
- Documentação completa

**Próximos passos**: Integrar com worker BullMQ no Stage 5!
