# 🚀 Quick Start - Pipeline Híbrido de Análise

Guia rápido para começar a usar o sistema de análise biomecânica em **5 minutos**.

## 📦 Instalação

```bash
# 1. Instalar dependências (se ainda não instalou)
cd backend
npm install

# 2. Rodar testes para verificar
npm test -- analysis

# 3. Todos os testes devem passar ✅
```

## 🎯 Uso Básico (3 passos)

### Passo 1: Importar os serviços

```typescript
import { QuickAnalysisService, DecisionEngineService } from './modules/analysis';

// No seu controller ou service
constructor(
  private quickAnalysis: QuickAnalysisService,
  private decisionEngine: DecisionEngineService,
) {}
```

### Passo 2: Preparar input

```typescript
const input = {
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
      landmarks_3d: [] // MediaPipe Pose landmarks
    },
    // ... mais frames (recomendado: 6-10 frames)
  ]
};
```

### Passo 3: Executar análise

```typescript
// 1. Análise rápida (200-500ms)
const quickResult = await this.quickAnalysis.analyze(input);

console.log(`Score: ${quickResult.overall_score}/10`);
console.log(`Classificação: ${quickResult.classification}`);
console.log(`Similaridade: ${(quickResult.similarity_to_gold * 100).toFixed(1)}%`);
console.log(`Desvios: ${quickResult.deviations_detected.length}`);

// 2. Decisão inteligente (< 10ms)
const decision = await this.decisionEngine.shouldRunDeepAnalysis(
  quickResult,
  user // objeto User do Prisma
);

// 3. Retornar resultado ou executar análise profunda
if (decision.shouldRun) {
  console.log(`Análise profunda necessária: ${decision.reason}`);
  console.log(`Tempo estimado: ${decision.estimatedTime}ms`);
  // Executar RAG + LLM...
} else {
  console.log(`Análise rápida suficiente: ${decision.reason}`);
  return quickResult;
}
```

## 📊 Output Esperado

### Quick Analysis Result

```json
{
  "id": "qa_abc123",
  "overall_score": 7.5,
  "classification": "BOM",
  "similarity_to_gold": 0.82,
  "frames_data": [
    {
      "frame_number": 1,
      "timestamp_ms": 500,
      "phase": "eccentric_mid",
      "angles": { ... },
      "similarity": 0.85,
      "similarity_by_joint": {
        "knee": 0.9,
        "hip": 0.85,
        "trunk": 0.8,
        "ankle": 0.82,
        "symmetry": 0.75
      },
      "deviations": [],
      "score": 8.0
    }
  ],
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

### Decision Result

```json
{
  "shouldRun": true,
  "reason": "3 critérios atingidos: análise profunda necessária",
  "estimatedTime": 50000,
  "triggers": [
    "score_low: 6.2/10 (< 7.0)",
    "similarity_low: 65.0% (< 70%)",
    "critical_deviations: 2x [knee_valgus, butt_wink]"
  ]
}
```

## 🔧 Configuração (Opcional)

### Ajustar Thresholds

```typescript
// decision-engine.service.ts
private readonly SCORE_THRESHOLD = 7.0;           // Mudar para 6.5 se muito restritivo
private readonly SIMILARITY_THRESHOLD = 0.7;      // Mudar para 0.65
private readonly MULTIPLE_DEVIATIONS_THRESHOLD = 3; // Mudar para 2
```

### Ajustar Tempos de Processamento

```typescript
// decision-engine.service.ts
private readonly BASE_DEEP_ANALYSIS_TIME = 30000;  // 30s → ajustar conforme sua infra
private readonly PER_DEVIATION_TIME = 10000;       // 10s por desvio
```

## 🧪 Testar Rapidamente

### Teste 1: Execução Perfeita

```typescript
const perfectInput = {
  videoPath: '/test/perfect.mp4',
  exerciseId: 'back-squat',
  userId: 'test_user',
  frames: [
    {
      frame_number: 1,
      timestamp_ms: 500,
      phase: 'eccentric_mid',
      angles: {
        knee_left: 90,  // Perfeito
        knee_right: 90, // Perfeito
        hip: 85,        // Perfeito
        trunk: 45,      // Perfeito
        ankle_left: 70, // Perfeito
        ankle_right: 70 // Perfeito
      },
      landmarks_3d: []
    }
  ]
};

const result = await quickAnalysis.analyze(perfectInput);
// Esperado: score ≥ 9.0, classification = EXCELENTE
```

### Teste 2: Desvio Crítico

```typescript
const valgusInput = {
  videoPath: '/test/valgus.mp4',
  exerciseId: 'back-squat',
  userId: 'test_user',
  frames: [
    {
      frame_number: 1,
      timestamp_ms: 500,
      phase: 'eccentric_mid',
      angles: {
        knee_left: 90,
        knee_right: 115, // Valgo severo (25° diferença)
        hip: 85,
        trunk: 45,
        ankle_left: 70,
        ankle_right: 70
      },
      landmarks_3d: []
    }
  ]
};

const result = await quickAnalysis.analyze(valgusInput);
// Esperado: deviations_detected contém knee_valgus severe
// Score < 7.0, decision.shouldRun = true
```

## 🐛 Troubleshooting Comum

### Erro: "Gold standard not found"

```typescript
// Solução: Popular gold standards no banco
await prisma.goldStandard.create({
  data: {
    exercise_id: 'back-squat',
    version: '1.0.0',
    phases_data: { ... },
    similarity_weights: { ... },
    common_compensations: [ ... ]
  }
});
```

### Erro: "Similarity always 0"

```typescript
// Verificar se ângulos estão em graus (não radianos)
console.log('User angles:', frame.angles);
// Esperado: knee_left: 90 (não 1.57)

// Verificar se gold standard tem tolerances
console.log('Gold angles:', goldStandard.phases_data.eccentric_mid.angles);
// Esperado: { knee_left: { ideal: 90, tolerance: 5 }, ... }
```

### Performance Lenta

```bash
# Verificar se gold standards estão em cache
# Adicionar índices no Prisma:
@@index([exercise_id])
@@index([created_at])

# Reduzir número de frames
# Recomendado: 6-10 frames (não 60+)
```

## 📚 Próximos Passos

1. ✅ **Você está aqui:** Análise rápida funcionando
2. 📖 Ler: [README.md](./README.md) - Documentação completa
3. 🔬 Explorar: [examples/integration-example.ts](./examples/integration-example.ts)
4. 🧪 Rodar: `npm test -- analysis` - Ver todos os testes
5. 🚀 Implementar: Análise profunda (RAG + LLM)

## 💡 Dicas Rápidas

### ✅ DOs

```typescript
// ✅ Usar DTOs com validação
import { QuickAnalysisInputDto } from './dto/quick-analysis.dto';

// ✅ Tratar erros apropriadamente
try {
  const result = await quickAnalysis.analyze(input);
} catch (error) {
  if (error instanceof NotFoundException) {
    // Gold standard não encontrado
  }
}

// ✅ Logar métricas importantes
console.log(`Analysis completed in ${result.processing_time_ms}ms`);
```

### ❌ DON'Ts

```typescript
// ❌ Não passar frames em radianos
angles: { knee_left: 1.57 } // ERRADO

// ❌ Não passar 100+ frames
frames: [...Array(200)] // Muito lento

// ❌ Não ignorar decisão do engine
if (quickResult.score < 5) {
  // Sempre consultar decision engine antes!
  const decision = await decisionEngine.shouldRunDeepAnalysis(...);
}
```

## 🎓 Recursos Úteis

- 📖 [README Completo](./README.md)
- 🏗️ [Arquitetura](./README.md#-arquitetura)
- 🧪 [Testes](./README.md#-testes)
- 📊 [Performance](./README.md#-performance)
- 🔗 [Exemplos](./examples/integration-example.ts)

## ✨ Template Pronto para Copiar

```typescript
import { Injectable } from '@nestjs/common';
import { QuickAnalysisService, DecisionEngineService } from './modules/analysis';

@Injectable()
export class MyVideoService {
  constructor(
    private quickAnalysis: QuickAnalysisService,
    private decisionEngine: DecisionEngineService,
  ) {}

  async analyze(videoPath: string, userId: string, frames: any[]) {
    // 1. Quick analysis
    const quickResult = await this.quickAnalysis.analyze({
      videoPath,
      exerciseId: 'back-squat',
      userId,
      frames
    });

    // 2. Decision
    const user = await this.getUserById(userId);
    const decision = await this.decisionEngine.shouldRunDeepAnalysis(
      quickResult,
      user
    );

    // 3. Return or deep analyze
    if (!decision.shouldRun) {
      return { type: 'quick', ...quickResult };
    }

    // TODO: Deep analysis
    return { type: 'deep', quick: quickResult };
  }

  private async getUserById(userId: string) {
    // Implementar busca do usuário
  }
}
```

---

**Pronto!** 🎉 Você está com o pipeline híbrido funcionando.

Para dúvidas: consulte [README.md](./README.md) ou os [testes unitários](./__tests__/).
