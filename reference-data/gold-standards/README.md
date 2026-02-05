# NFC Biomechanics - Gold Standards Repository

## 📋 Visão Geral

Este diretório contém os **Gold Standards** (padrões de referência) biomecânicos para análise de exercícios de musculação. Cada gold standard representa a execução tecnicamente correta de um exercício, com ângulos articulares, ranges aceitáveis, e checkpoints críticos de segurança baseados em literatura científica.

## 🏗️ Estrutura

```
gold-standards/
├── squat-highbar/
│   ├── biomechanics.json          # Dados biomecânicos completos
│   ├── deviations-catalog.json    # Catálogo de desvios comuns
│   ├── reference-landmarks.json   # Coordenadas 3D de referência
│   └── metadata.json              # Metadados e versionamento
├── bench-press-flat/
├── deadlift-conventional/
├── overhead-press-standing/
└── barbell-row-bent/
```

## 📊 Exercícios Disponíveis

### 1. **Squat High-Bar** (squat-highbar)
- **Categoria**: Lower Body Compound
- **Músculos Primários**: Quadríceps, Glúteos, Isquiotibiais
- **Dificuldade**: Intermediária
- **Fontes**: Horschig (2016), NSCA, Schoenfeld (2010)

### 2. **Bench Press Flat** (bench-press-flat)
- **Categoria**: Upper Body Compound Push
- **Músculos Primários**: Peitoral Maior, Tríceps
- **Dificuldade**: Iniciante-Intermediária
- **Fontes**: Lehman (2005), NSCA, Guia Peitoral Maior

### 3. **Deadlift Conventional** (deadlift-conventional)
- **Categoria**: Posterior Chain Compound
- **Músculos Primários**: Erectores, Glúteos, Isquiotibiais
- **Dificuldade**: Avançada
- **Fontes**: McGill (2015), Escamilla (2000), Hales (2010)

### 4. **Overhead Press Standing** (overhead-press-standing)
- **Categoria**: Upper Body Compound Push
- **Músculos Primários**: Deltoides, Tríceps
- **Dificuldade**: Intermediária
- **Fontes**: McKean (2010), NSCA

### 5. **Barbell Row Bent** (barbell-row-bent)
- **Categoria**: Upper Body Compound Pull
- **Músculos Primários**: Latíssimo, Rombóides, Trapézio Médio
- **Dificuldade**: Intermediária
- **Fontes**: Fenwick (2009), NSCA

## 📄 Estrutura dos Arquivos

### biomechanics.json

Contém os dados biomecânicos completos do exercício:

```json
{
  "exercise_id": "...",
  "version": "1.0.0",
  "evidence_sources": ["...", "..."],
  "exercise_metadata": { /* categoria, músculos, equipamento */ },
  "phases": {
    "eccentric_top": {
      "angles": {
        "knee_left": {
          "ideal": 175,
          "acceptable_range": [170, 180],
          "tolerance": 10,
          "scientific_rationale": "..."
        }
      },
      "critical_checkpoints": [...]
    },
    "eccentric_mid": {...},
    "isometric_bottom": {...},
    "concentric": {...}
  },
  "biomechanical_constraints": {...},
  "similarity_weights": {...}
}
```

**Campos Principais:**
- **phases**: Fases do movimento (eccentric, isometric, concentric)
- **angles**: Ângulos articulares ideais e aceitáveis para cada fase
- **critical_checkpoints**: Pontos críticos de segurança (ex: knee valgus, butt wink)
- **biomechanical_constraints**: Limites de segurança absolutos
- **similarity_weights**: Pesos para cálculo de similaridade

### metadata.json

Metadados, versionamento e estatísticas:

```json
{
  "exercise_id": "...",
  "name": "High-Bar Back Squat",
  "name_pt": "Agachamento Livre com Barra Alta",
  "version": "1.0.0",
  "status": "validated",
  "changelog": [...],
  "validation_criteria": {...},
  "related_exercises": [...],
  "prerequisites": {...}
}
```

### deviations-catalog.json

Catálogo de desvios comuns e protocolos corretivos (a ser criado).

### reference-landmarks.json

Coordenadas 3D normalizadas de landmarks do MediaPipe para posição de referência.

## 🔬 Base Científica

Todos os gold standards são baseados em **literatura científica peer-reviewed**:

- **NSCA**: Essentials of Strength Training and Conditioning (4th Ed)
- **Horschig (2016)**: The Squat Bible
- **McGill (2015)**: Low Back Disorders (3rd Ed)
- **Schoenfeld (2010)**: Squatting Kinematics and Kinetics
- **Escamilla (2000)**: 3D Biomechanical Analysis of the Deadlift
- **Lehman (2005)**: Grip Width and Upper-Body Activity During Bench Press
- **Fenwick (2009)**: Rowing Exercises - Trunk Muscle Activation
- **McKean (2010)**: The Standing Overhead Press
- **Neumann (2011)**: Cinesiologia do Aparelho Musculoesquelético

## 🎯 Como Usar

### 1. Sistema de Análise Rápida (Quick Analysis)

Use os ângulos da fase **isometric_bottom** (ou fase crítica relevante) para análise rápida:

```typescript
import squatGoldStandard from './squat-highbar/biomechanics.json';

const bottomPhase = squatGoldStandard.phases.isometric_bottom;
const kneeAngleIdeal = bottomPhase.angles.knee_left.ideal; // 85°
const acceptableRange = bottomPhase.angles.knee_left.acceptable_range; // [75, 95]
```

### 2. Análise Profunda (Deep Analysis)

Use todas as fases para análise completa do padrão de movimento:

```typescript
for (const [phaseName, phaseData] of Object.entries(goldStandard.phases)) {
  // Analise cada fase do movimento
  compareAnglesWithUserVideo(phaseData.angles, userVideoAngles);
}
```

### 3. Verificação de Checkpoints Críticos

Verifique pontos críticos de segurança:

```typescript
const criticalCheckpoints = bottomPhase.critical_checkpoints;
// Exemplo: verificar knee valgus, heel lift, butt wink, etc.
```

### 4. Cálculo de Similaridade

Use os pesos definidos:

```typescript
const weights = goldStandard.similarity_weights;
// knee: 0.30, hip: 0.25, trunk: 0.20, ankle: 0.15, symmetry: 0.10
const similarity = calculateWeightedSimilarity(userAngles, goldAngles, weights);
```

## 📐 Sistema de Medição

### Ângulos Articulares

- **0°**: Extensão completa (linha reta)
- **90°**: Flexão de 90°
- **180°**: Posição neutra (depende do contexto)

**Exemplo - Joelho:**
- 180° = extensão completa (perna reta)
- 90° = flexão de 90°
- 0° = flexão máxima

### Métodos de Medição

Cada ângulo especifica seu `measurement_method`:

- `"hip_center-knee-ankle"`: Ângulo formado por hip → knee → ankle
- `"shoulder-hip-knee"`: Ângulo do quadril (shoulder → hip → knee)
- `"vertical-spine_angle"`: Ângulo do tronco com a vertical

## ⚠️ Limites de Segurança

Cada gold standard define **safety_limits** críticos:

```json
"safety_limits": {
  "knee_valgus_max_degrees": 15,
  "lumbar_flexion_max_degrees": 20,
  "heel_lift_max_cm": 0.5
}
```

**Ultrapassar esses limites = ALERTA CRÍTICO** na análise.

## 🔄 Versionamento

Gold standards seguem **Semantic Versioning**:

- **MAJOR** (1.x.x): Mudanças incompatíveis nos ângulos ou estrutura
- **MINOR** (x.1.x): Adição de novos dados/fases compatíveis
- **PATCH** (x.x.1): Correções de bugs, ajustes menores

Consulte `changelog` em `metadata.json` para histórico completo.

## 🚀 Integração com Sistema Híbrido

### Quick Analysis (Camada 1)
```typescript
import { QuickAnalysisService } from '../services/analysis/quick-analysis.service';

const quickAnalysis = new QuickAnalysisService();
const result = await quickAnalysis.analyzeFrame(
  videoFrame,
  'squat_highbar',
  goldStandardData
);
// Retorna: similarity_score, deviations, confidence
```

### Deep Analysis (Camada 2)
```typescript
import { DeepAnalysisService } from '../services/analysis/deep-analysis.service';

const deepAnalysis = new DeepAnalysisService();
const result = await deepAnalysis.analyzeFullMovement(
  videoFrames,
  'squat_highbar',
  goldStandardData
);
// Retorna: análise por fase, temporal patterns, injury risk
```

### Decision Engine (Camada 3)
```typescript
import { DecisionEngine } from '../services/analysis/decision-engine.service';

const decision = decisionEngine.decide(quickResult, deepResult, context);
// Retorna: use_quick ou use_deep, confidence, reasoning
```

## 📚 Referências Completas

1. **Horschig, A.** (2016). *The Squat Bible: The Ultimate Guide to Mastering the Squat*. Squat University LLC.

2. **McGill, S.M.** (2015). *Low Back Disorders: Evidence-Based Prevention and Rehabilitation*. 3rd Ed. Human Kinetics.

3. **Schoenfeld, B.J.** (2010). Squatting Kinematics and Kinetics and Their Application to Exercise Performance. *J Strength Cond Res*, 24(12), 3497-3506.

4. **Escamilla, R.F. et al.** (2000). A three-dimensional biomechanical analysis of the deadlift during varying loads. *Med Sci Sports Exerc*, 32(7), 1265-1275.

5. **Lehman, G.J.** (2005). The influence of grip width and forearm pronation/supination on upper-body myoelectric activity during the flat bench press. *J Strength Cond Res*, 19(3), 587-591.

6. **Fenwick, C.M. et al.** (2009). Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness. *J Strength Cond Res*, 23(5), 1408-1417.

7. **McKean, M.R. et al.** (2010). The standing overhead press. *Strength Cond J*, 32(1), 54-58.

8. **Neumann, D.A.** (2011). *Cinesiologia do Aparelho Musculoesquelético: Fundamentos para Reabilitação*. 2ª Ed. Elsevier.

9. **NSCA** (2015). *Essentials of Strength Training and Conditioning*. 4th Ed. Human Kinetics.

## 📧 Contribuições

Para sugerir atualizações aos gold standards, abra uma issue com:

1. Referência científica peer-reviewed
2. Proposta de alteração de ângulos/ranges
3. Justificativa biomecânica

## 📜 Licença

© 2025 NFC Biomechanics Team. Todos os direitos reservados.

---

**Última Atualização**: 2025-02-05
**Versão Gold Standards**: 1.0.0
**Total de Exercícios**: 5
