# Analysis Module - Sistema Híbrido de Análise Biomecânica

Este módulo implementa o pipeline híbrido de análise de movimentos, combinando análise rápida baseada em gold standards com análise profunda contextual (RAG + LLM).

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        PIPELINE HÍBRIDO                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────┐
        │   CAMADA 1: Quick Analysis (200-500ms)│
        │   - Comparação com Gold Standard      │
        │   - Detecção de desvios               │
        │   - Score e similaridade              │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │   Decision Engine (< 10ms)            │
        │   - Avaliar 5 critérios               │
        │   - Decidir análise profunda          │
        └───────────────────┬───────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼──────┐      ┌────────▼────────┐
        │ Análise OK   │      │ Análise Profunda│
        │ Score ≥ 7.0  │      │ RAG + LLM       │
        │ Similaridade │      │ (30-60s)        │
        │ ≥ 70%        │      │                 │
        └──────────────┘      └─────────────────┘
```

## 📁 Estrutura de Arquivos

```
analysis/
├── decision-engine.service.ts    # Motor de decisão inteligente
├── quick-analysis.service.ts     # Análise rápida com gold standards
├── dto/
│   ├── quick-analysis.dto.ts     # DTOs de entrada/saída
│   └── deep-analysis-decision.dto.ts
├── interfaces/
│   ├── frame.interface.ts        # Interfaces de frames e ângulos
│   └── deviation.interface.ts    # Interfaces de desvios
├── __tests__/                    # Testes unitários completos
└── README.md                     # Esta documentação
```

## 🔧 Serviços Principais

### 1. QuickAnalysisService

**Responsabilidade:** Análise rápida comparando vídeo do usuário com gold standard.

**Pipeline:**
1. Buscar gold standard do exercício (cache L2)
2. Comparar cada frame com fase correspondente
3. Detectar desvios biomecânicos usando regras catalogadas
4. Calcular similaridade frame-a-frame
5. Agregar desvios e gerar score global
6. Salvar resultado no banco

**Tempo esperado:** 200-500ms

**Exemplo de uso:**
```typescript
const result = await quickAnalysis.analyze({
  videoPath: '/uploads/video_123.mp4',
  exerciseId: 'back-squat',
  userId: 'user_123',
  frames: [
    {
      frame_number: 1,
      timestamp_ms: 500,
      phase: 'eccentric_mid',
      angles: {
        knee_left: 90,
        knee_right: 92,
        hip: 85,
        trunk: 45,
        ankle_left: 70,
        ankle_right: 68
      },
      landmarks_3d: [...]
    },
    // ... mais frames
  ]
});

console.log(`Score: ${result.overall_score}/10`);
console.log(`Similaridade: ${(result.similarity_to_gold * 100).toFixed(1)}%`);
console.log(`Desvios: ${result.deviations_detected.length}`);
```

**Output:**
```json
{
  "id": "qa_123",
  "overall_score": 7.5,
  "classification": "BOM",
  "similarity_to_gold": 0.82,
  "frames_data": [...],
  "deviations_detected": [
    {
      "type": "knee_valgus",
      "severity": "mild",
      "frames_affected": [2, 3],
      "percentage": 33.3,
      "average_value": 7.5,
      "trend": "stable"
    }
  ],
  "processing_time_ms": 350
}
```

---

### 2. DecisionEngineService

**Responsabilidade:** Decidir quando executar análise profunda (RAG + LLM).

**5 Critérios de Decisão:**

| Critério | Threshold | Trigger |
|----------|-----------|---------|
| 1. Score baixo | < 7.0 | `score_low: 6.2/10` |
| 2. Similaridade baixa | < 70% | `similarity_low: 65.0%` |
| 3. Desvios críticos | moderate/severe | `critical_deviations: 2x knee_valgus, butt_wink` |
| 4. Múltiplos desvios | ≥ 3 simultâneos | `multiple_deviations: 4 simultâneos` |
| 5. Tier Premium | pro/coach | `premium_tier: pro - análise completa incluída` |

**Lógica de Decisão:**
- **Premium users:** Sempre executar análise profunda
- **Free users:** Executar se ≥ 2 triggers ativados

**Exemplo de uso:**
```typescript
const decision = await decisionEngine.shouldRunDeepAnalysis(
  quickAnalysisResult,
  user
);

if (decision.shouldRun) {
  console.log(`Executando análise profunda: ${decision.reason}`);
  console.log(`Tempo estimado: ${decision.estimatedTime}ms`);
  console.log(`Triggers: ${decision.triggers.join(', ')}`);

  // Executar RAG + LLM...
  const deepAnalysis = await deepAnalysisService.analyze(...);
} else {
  console.log(`Análise rápida suficiente: ${decision.reason}`);
  // Retornar resultado rápido ao usuário
}
```

**Output:**
```json
{
  "shouldRun": true,
  "reason": "3 critérios atingidos: análise profunda necessária para prescrição corretiva",
  "estimatedTime": 50000,
  "triggers": [
    "score_low: 6.2/10 (< 7.0)",
    "similarity_low: 65.0% (< 70%)",
    "critical_deviations: 2x [knee_valgus, butt_wink]"
  ]
}
```

---

### 3. SimilarityCalculatorService

**Responsabilidade:** Calcular similaridade matemática entre ângulos do usuário e gold standard.

**Função de Similaridade com Tolerância Progressiva:**

```
Zona 1 (0 - tolerance):      similarity = 1.0    (perfeito)
Zona 2 (tolerance - 2x):     similarity = 1.0 → 0.7  (degradação linear)
Zona 3 (2x - 3x):            similarity = 0.7 → 0.4  (degradação linear)
Além 3x:                     similarity = 0.4 → 0    (decaimento exponencial)
```

**Exemplo:**
```typescript
const similarity = calculator.calculateFrameSimilarity(
  {
    knee_left: 90,
    knee_right: 92,
    hip: 85,
    trunk: 45,
    ankle_left: 70,
    ankle_right: 68
  },
  goldStandard.phases_data.eccentric_mid.angles,
  { knee: 0.3, hip: 0.25, trunk: 0.2, ankle: 0.15, symmetry: 0.1 }
);

console.log(`Similaridade global: ${(similarity.overall * 100).toFixed(1)}%`);
console.log(`Por articulação:`, similarity.byJoint);
```

**Cálculo de Simetria Bilateral:**
- Joelhos: assimetria > 20° = zero symmetry
- Tornozelos: assimetria > 15° = zero symmetry

---

## 🎯 Fluxo Completo de Uso

```typescript
// 1. Executar análise rápida
const quickResult = await quickAnalysisService.analyze({
  videoPath: '/uploads/video_123.mp4',
  exerciseId: 'back-squat',
  userId: 'user_123',
  frames: extractedFrames
});

// 2. Decidir se análise profunda é necessária
const decision = await decisionEngineService.shouldRunDeepAnalysis(
  quickResult,
  user
);

// 3a. Se análise rápida suficiente → Retornar ao usuário
if (!decision.shouldRun) {
  return {
    type: 'quick',
    result: quickResult,
    reason: decision.reason
  };
}

// 3b. Se análise profunda necessária → RAG + LLM
const deepResult = await deepAnalysisService.analyze({
  quickAnalysis: quickResult,
  exerciseId: 'back-squat',
  userId: 'user_123',
  deviations: quickResult.deviations_detected
});

return {
  type: 'deep',
  quickAnalysis: quickResult,
  deepAnalysis: deepResult,
  estimatedTime: decision.estimatedTime,
  triggers: decision.triggers
};
```

---

## 📊 Detecção de Desvios

### Desvios Suportados

| Desvio | Descrição | Articulações | Severidades |
|--------|-----------|--------------|-------------|
| `knee_valgus` | Valgo dinâmico dos joelhos | knee_left, knee_right | mild: 5-10°, moderate: 10-20°, severe: 20+° |
| `butt_wink` | Retroversão pélvica no fundo | hip | mild: 5-10°, moderate: 10-20°, severe: 20+° |
| `forward_lean` | Inclinação excessiva do tronco | trunk | mild: 5-10°, moderate: 10-20°, severe: 20+° |
| `heel_rise` | Elevação dos calcanhares | ankle_left, ankle_right | mild: 5-10°, moderate: 10-20°, severe: 20+° |
| `asymmetric_loading` | Assimetria bilateral | knees, ankles | mild: 5-10°, moderate: 10-20°, severe: 20+° |

### Agregação de Desvios

Desvios detectados frame-a-frame são agregados com estatísticas:

```typescript
{
  "type": "knee_valgus",
  "severity": "moderate",        // Max severity
  "frames_affected": [2, 3, 4],  // Frames onde apareceu
  "percentage": 50,               // 3/6 frames = 50%
  "average_value": 12.5,          // Média do desvio
  "trend": "increasing"           // Piora ao longo do tempo (fadiga)
}
```

**Tendências:**
- `increasing`: desvio piora ao longo do tempo (indicativo de fadiga)
- `decreasing`: desvio melhora
- `stable`: sem mudança significativa

---

## 🧪 Testes

Cada serviço possui suite completa de testes unitários:

```bash
# Rodar todos os testes do módulo
npm test -- analysis

# Rodar testes específicos
npm test -- similarity-calculator.service.spec
npm test -- quick-analysis.service.spec
npm test -- decision-engine.service.spec

# Com coverage
npm test -- --coverage analysis
```

**Cobertura de testes:**
- ✅ QuickAnalysisService: 95%+
- ✅ DecisionEngineService: 98%+
- ✅ SimilarityCalculatorService: 100%

---

## ⚙️ Configuração

### Thresholds Configuráveis (DecisionEngine)

```typescript
// decision-engine.service.ts
private readonly SCORE_THRESHOLD = 7.0;
private readonly SIMILARITY_THRESHOLD = 0.7;
private readonly MULTIPLE_DEVIATIONS_THRESHOLD = 3;
private readonly MINIMUM_TRIGGERS_FREE_TIER = 2;
```

### Tempos de Processamento

```typescript
private readonly BASE_DEEP_ANALYSIS_TIME = 30000;  // 30s base
private readonly PER_DEVIATION_TIME = 10000;       // +10s por desvio
```

---

## 🚀 Performance

### Benchmarks

| Operação | Tempo Médio | Percentil 95 |
|----------|-------------|--------------|
| Quick Analysis | 350ms | 500ms |
| Decision Engine | 5ms | 10ms |
| Similarity Calc | 2ms | 5ms |
| Deep Analysis | 35s | 60s |

### Estratégias de Cache

**L1 - Análise Idêntica** (TTL: 24h)
```
Key: video_analysis:{userId}:{exerciseId}:{videoHash}
```

**L2 - Gold Standard** (TTL: 7 dias)
```
Key: gold_standard:{exerciseId}
```

**L3 - RAG Context** (TTL: 30 dias)
```
Key: rag_context:{deviationType}:{severity}
```

---

## 📖 Referências

- [Gold Standards Module](../gold-standards/README.md)
- [Deep Analysis Module](../deep-analysis/README.md)
- [Catálogo de Desvios](../../../reference-data/deviations-catalog/)
- [Protocolos Corretivos](../../../reference-data/corrective-protocols/)

---

## 👥 Contribuindo

Para adicionar novos tipos de desvios:

1. Atualizar `deviation.interface.ts` com novo tipo
2. Adicionar regra de detecção em `quick-analysis.service.ts` → `evaluateDeviationRule()`
3. Criar catálogo JSON em `reference-data/deviations-catalog/`
4. Criar protocolos corretivos em `reference-data/corrective-protocols/`
5. Adicionar testes em `quick-analysis.service.spec.ts`

---

## 📝 Licença

NutriFitCoach © 2025
