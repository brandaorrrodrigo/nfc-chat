# Módulo de Protocolos Corretivos

Sistema de geração de protocolos corretivos baseado em **regras determinísticas** (sem LLM).

## 📋 Visão Geral

O módulo de protocolos (LAYER 3) é responsável por gerar programas de exercícios corretivos personalizados baseados em desvios biomecânicos detectados.

### Características Principais

- ✅ **100% Determinístico**: Mesmas entradas = mesmas saídas (sem randomização, sem LLM)
- ✅ **5 Regras de Personalização**: Training age, injury history, equipment, frequency, symptoms
- ✅ **Cache L4**: Protocolos base armazenados em memória indefinidamente
- ✅ **Priorização Inteligente**: Desvios ordenados por severidade + risco de lesão
- ✅ **Integração de Múltiplos Protocolos**: Resolve conflitos quando usuário tem múltiplos desvios
- ✅ **Validação Completa**: Valida protocolos base e personalizados

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                  ProtocolMatcherService                      │
│                  (Orquestrador LAYER 3)                      │
│                                                              │
│  1. Filtra desvios corrigíveis (confidence >= 0.6)          │
│  2. Prioriza por severidade + risco de lesão                │
│  3. Para cada desvio:                                        │
│     ├─> ProtocolLoaderService (cache L4)                    │
│     ├─> ProtocolValidatorService (base)                     │
│     ├─> ProtocolPersonalizerService (5 regras)              │
│     └─> ProtocolValidatorService (personalizado)            │
│  4. Integra múltiplos protocolos                             │
│  5. Extrai rationale científico (se deepContext disponível)  │
└─────────────────────────────────────────────────────────────┘
```

### Serviços

#### 1. **ProtocolMatcherService** (Orquestrador)

Coordena todo o processo de geração de protocolos.

```typescript
async generateProtocols(input: GenerateProtocolsInput): Promise<GeneratedProtocol[]>
```

**Processo:**
1. Filtra desvios com confidence >= 0.6
2. Prioriza usando fórmula: `score = (severity_weight × 10) + (injury_risk × 5)`
3. Carrega protocolo base
4. Valida protocolo base
5. Personaliza (5 regras)
6. Valida personalizado
7. Integra múltiplos protocolos
8. Extrai rationale científico

#### 2. **ProtocolLoaderService** (Cache L4)

Carrega protocolos do filesystem com cache indefinido em memória.

```typescript
async loadProtocol(
  deviationType: string,
  severity: 'mild' | 'moderate' | 'severe'
): Promise<BaseProtocol | null>
```

**Cache L4:**
- Storage: Memory
- TTL: -1 (infinito)
- Eviction: FIFO
- Key format: `protocol:{deviationType}:{severity}`

**Estrutura de arquivos:**
```
reference-data/corrective-protocols/
├── knee_valgus/
│   ├── mild.json
│   ├── moderate.json
│   └── severe.json
├── butt_wink/
│   ├── mild.json
│   ├── moderate.json
│   └── severe.json
└── ...
```

#### 3. **ProtocolValidatorService** (Validação)

Valida protocolos em dois estágios:

```typescript
// Validação de protocolo base (JSON)
validateBaseProtocol(protocol: BaseProtocol): ValidationResult

// Validação pós-personalização
validatePersonalizedProtocol(protocol: PersonalizedProtocol): ValidationResult
```

**Validações:**
- ✅ Campos obrigatórios presentes
- ✅ Estrutura de fases válida
- ✅ Exercícios com dados completos
- ✅ Duração razoável (<16 semanas)
- ✅ Frequência realista (1-7x/semana)

#### 4. **ProtocolPersonalizerService** (5 Regras)

Aplica regras determinísticas de personalização.

```typescript
personalizeProtocol(
  baseProtocol: BaseProtocol,
  userProfile: UserProfile
): { protocol: PersonalizedProtocol; log: PersonalizationLog[] }
```

## 🎯 5 Regras de Personalização

### REGRA 1: Training Age

**Beginner (<1 ano):**
- ✅ Aumenta duração de cada fase em **50%**
- ✅ Remove exercícios de integração (muito avançados)
- ✅ Adiciona nota de supervisão recomendada

**Advanced (>5 anos):**
- ✅ Reduz duração de cada fase em **20%**
- ✅ Permite progressão mais agressiva

**Exemplo:**
```typescript
// Input: beginner, fase de 2 semanas
// Output: fase de 3 semanas (2 × 1.5)

// Input: advanced, fase de 4 semanas
// Output: fase de 3 semanas (4 × 0.8, ceil)
```

### REGRA 2: Injury History

Se histórico de lesão **relevante** ao desvio:

- ✅ Reduz carga inicial em **30%**
- ✅ Aumenta duração da **primeira fase** em **50%**
- ✅ Adiciona contraindicações específicas
- ✅ Adiciona critérios conservadores de progressão

**Mapa de Relevância:**
```typescript
{
  knee_valgus: ['knee', 'joelho', 'acl', 'lcl', 'meniscus'],
  butt_wink: ['hip', 'quadril', 'lower_back', 'lombar'],
  forward_lean: ['ankle', 'tornozelo', 'hip', 'quadril'],
  heel_rise: ['ankle', 'tornozelo', 'achilles', 'calf'],
  asymmetric_loading: ['knee', 'hip', 'leg']
}
```

### REGRA 3: Equipment

Substitui exercícios quando equipamento não disponível:

- ✅ Verifica equipamento necessário vs disponível
- ✅ Busca alternativa na tabela de substituições
- ✅ Mantém categoria e objetivo do exercício
- ✅ Registra substituições em `substitutedExercises`

**Exemplo:**
```typescript
// Original: goblet_squat (requer dumbbell)
// Usuário tem: bodyweight
// Substituição: air_squat
```

### REGRA 4: Weekly Frequency

Se frequência < 4x/semana:

- ✅ Reduz número de exercícios para **70%**
- ✅ Prioriza: strength > integration > mobility > activation
- ✅ Aumenta séries dos mantidos em **30%**

**Exemplo:**
```typescript
// Fase com 5 exercícios, frequência 2x/semana
// Resultado: 4 exercícios (ceil(5 × 0.7))
// Séries: 3 → 4 (ceil(3 × 1.3))
```

### REGRA 5: Current Symptoms

Se dor presente (severity >= 4/10):

- ✅ Reduz séries da primeira fase em **25%**
- ✅ Reduz carga inicial (se aplicável)
- ✅ Adiciona warm-up estendido (10-15min)
- ✅ Adiciona critério: "Ausência de dor durante/após exercícios"
- ✅ Adiciona nota de monitoramento

**Exemplo:**
```typescript
// Exercício com 4 séries, dor de 5/10 no joelho
// Resultado: 3 séries (ceil(4 × 0.75))
// Load: moderate → light
```

## 🔢 Sistema de Priorização

Desvios são priorizados usando esta fórmula:

```
Priority Score = (severity_weight × 10) + (injury_risk_weight × 5)
```

**Pesos de Severidade:**
- `severe`: 3
- `moderate`: 2
- `mild`: 1

**Pesos de Risco de Lesão:**
- `knee_valgus`: 3 (alto risco de LCA)
- `butt_wink`: 2 (risco lombar)
- `forward_lean`: 2
- `asymmetric_loading`: 2
- `heel_rise`: 1

**Exemplos:**
- `knee_valgus severe`: (3×10) + (3×5) = **45**
- `butt_wink moderate`: (2×10) + (2×5) = **30**
- `heel_rise mild`: (1×10) + (1×5) = **15**

## 📊 Integração de Múltiplos Protocolos

Quando usuário tem múltiplos desvios, o sistema:

1. **Detecta exercícios compartilhados** entre protocolos
2. **Marca exercícios duplicados** com cue especial
3. **Adiciona nota de execução única** (execute apenas 1x)
4. **Sugere distribuição semanal** para evitar fadiga

**Exemplo:**
```typescript
// Usuário tem: knee_valgus + butt_wink
// Ambos protocolos incluem: glute_bridge

// Resultado:
// - Glute bridge marcado como [EXERCÍCIO COMPARTILHADO]
// - Nota: "Execute apenas 1x, não duplicar"
```

## 💾 Estrutura de Dados

### BaseProtocol

```typescript
interface BaseProtocol {
  protocolId: string;              // 'knee_valgus_moderate_v1'
  version: string;                 // '1.0'
  deviationType: string;           // 'knee_valgus'
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  phases: ProtocolPhase[];
  totalDurationWeeks: number;
  frequencyPerWeek: number;
  expectedOutcomes: string[];
  contraindications?: string[];
  references?: string[];
}
```

### ProtocolPhase

```typescript
interface ProtocolPhase {
  phaseNumber: number;
  name: string;                    // 'Mobilidade e Ativação'
  durationWeeks: number;
  goals: string[];
  exercises: Exercise[];
  advancementCriteria: {
    requiredWeeks: number;
    qualitativeCriteria: string[];
  };
}
```

### Exercise

```typescript
interface Exercise {
  exerciseId: string;
  name: string;
  category: 'mobility' | 'activation' | 'strength' | 'integration';
  sets: number;
  reps: number | string;           // 10 ou "30s"
  rest: number;                    // segundos
  tempo?: string;                  // "3-1-2"
  load?: string;                   // 'bodyweight', 'light', 'moderate', 'heavy'
  equipment: string[];
  cues: string[];
  alternatives?: AlternativeExercise[];
}
```

### PersonalizationLog

```typescript
interface PersonalizationLog {
  rule: string;                    // 'RULE_1_TRAINING_AGE'
  applied: boolean;
  reason: string;
  changes: PersonalizationChange[];
}

interface PersonalizationChange {
  field: string;                   // 'phases[0].durationWeeks'
  originalValue: any;
  newValue: any;
  rationale: string;
}
```

## 🧪 Testes

Testes unitários para cada regra de personalização:

```bash
npm test protocol-personalizer.service.spec.ts
```

**Testes incluem:**
- ✅ RULE 1: Training Age (beginner, advanced, intermediate)
- ✅ RULE 2: Injury History (relevant, irrelevant)
- ✅ RULE 3: Equipment (available, unavailable)
- ✅ RULE 4: Weekly Frequency (low, adequate)
- ✅ RULE 5: Current Symptoms (severe, mild)
- ✅ Determinism (mesmas entradas = mesmas saídas)

## 📖 Uso

### Exemplo Básico

```typescript
import { ProtocolMatcherService } from './modules/protocols/protocol-matcher.service';

// Input
const input = {
  deviations: [
    {
      type: 'knee_valgus',
      severity: 'moderate',
      confidence: 0.85,
    },
    {
      type: 'butt_wink',
      severity: 'mild',
      confidence: 0.72,
    },
  ],
  userProfile: {
    userId: 'user_123',
    trainingAge: 'beginner',
    trainingAgeYears: 0.5,
    weeklyFrequency: 3,
    equipmentAvailable: ['bodyweight', 'resistance_band'],
    currentSymptoms: [
      {
        location: 'knee',
        type: 'pain',
        severity: 4,
      },
    ],
  },
  deepContext: {
    scientific_narrative: 'Knee valgus linked to weak hip abductors...',
  },
};

// Gerar protocolos
const protocols = await protocolMatcher.generateProtocols(input);

// Output
protocols.forEach((protocol) => {
  console.log(`Protocol: ${protocol.protocolId}`);
  console.log(`Deviation: ${protocol.deviationType} (${protocol.deviationSeverity})`);
  console.log(`Duration: ${protocol.personalizedProtocol.modifiedDurationWeeks} weeks`);
  console.log(`Frequency: ${protocol.personalizedProtocol.modifiedFrequencyPerWeek}x/week`);

  console.log('\nPersonalization applied:');
  protocol.personalizationLog
    .filter((log) => log.applied)
    .forEach((log) => {
      console.log(`  - ${log.rule}: ${log.reason}`);
    });

  console.log('\nPhases:');
  protocol.personalizedProtocol.modifiedPhases.forEach((phase) => {
    console.log(`  Phase ${phase.phaseNumber}: ${phase.name} (${phase.durationWeeks} weeks)`);
    console.log(`    Exercises: ${phase.exercises.length}`);
  });
});
```

### Exemplo de Output

```
Protocol: knee_valgus_moderate_v1_user_123_1707157234567
Deviation: knee_valgus (moderate)
Duration: 10 weeks
Frequency: 3x/week

Personalization applied:
  - RULE_1_TRAINING_AGE: Training age: beginner
  - RULE_4_WEEKLY_FREQUENCY: Low weekly frequency: 3x/week (recommended: 4+)
  - RULE_5_CURRENT_SYMPTOMS: Current pain symptoms: knee (4/10)

Phases:
  Phase 1: Mobilidade e Ativação (3 weeks)
    Exercises: 2
  Phase 2: Fortalecimento (5 weeks)
    Exercises: 2
  Phase 3: Integração (2 weeks)
    Exercises: 1
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Cache (via CacheModule)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CACHE_DB=1

# Protocolos
PROTOCOLS_BASE_PATH=../reference-data/corrective-protocols
```

### Diretório de Protocolos

Estrutura esperada:

```
reference-data/
└── corrective-protocols/
    ├── knee_valgus/
    │   ├── mild.json
    │   ├── moderate.json
    │   └── severe.json
    ├── butt_wink/
    │   ├── mild.json
    │   ├── moderate.json
    │   └── severe.json
    ├── forward_lean/
    │   └── ...
    └── ...
```

### Formato de Protocolo JSON

```json
{
  "protocolId": "knee_valgus_moderate_v1",
  "version": "1.0",
  "deviationType": "knee_valgus",
  "severity": "moderate",
  "description": "Protocolo corretivo para valgo de joelho moderado",
  "phases": [
    {
      "phaseNumber": 1,
      "name": "Mobilidade e Ativação",
      "durationWeeks": 2,
      "goals": ["Melhorar mobilidade de quadril"],
      "exercises": [
        {
          "exerciseId": "hip_90_90",
          "name": "Hip 90/90 Stretch",
          "category": "mobility",
          "sets": 3,
          "reps": "30s",
          "rest": 30,
          "equipment": ["bodyweight"],
          "cues": ["Manter costas retas"]
        }
      ],
      "advancementCriteria": {
        "requiredWeeks": 2,
        "qualitativeCriteria": ["Execução perfeita"]
      }
    }
  ],
  "totalDurationWeeks": 2,
  "frequencyPerWeek": 4,
  "expectedOutcomes": ["Redução de valgo"],
  "contraindications": ["Dor aguda no joelho"],
  "references": ["Smith et al. 2023"]
}
```

## 🚀 Performance

### Cache L4

- **Hit rate esperado**: >95% após warm-up
- **Warm-up time**: ~50-200ms (depende do número de protocolos)
- **Latência GET**: <1ms (memória)
- **Tamanho típico**: ~500KB para 30 protocolos

### Geração de Protocolo

- **Tempo médio**: 5-15ms por protocolo
- **Com cache warm**: 2-5ms
- **Múltiplos protocolos**: +2ms por protocolo adicional

## 📝 Notas Importantes

### Determinismo

O sistema é **100% determinístico**:
- ✅ Sem LLM
- ✅ Sem randomização
- ✅ Mesmas entradas = mesmas saídas
- ✅ Testável e previsível

### Escalabilidade

- Cache L4 suporta até **500MB** de protocolos
- Sistema pode escalar horizontalmente (stateless)
- Protocols são imutáveis (cache seguro)

### Manutenção

- Adicionar novo protocolo: criar JSON em `/corrective-protocols/`
- Modificar protocolo: editar JSON + invalidar cache
- Adicionar nova regra: implementar em `ProtocolPersonalizerService`

## 📚 Referências

- [LAYER 3 Architecture](../../../docs/architecture.md)
- [Cache System](../cache/README.md)
- [Deep Analysis System](../deep-analysis/README.md)
