# Sistema de Análise Biomecânica NFC/NFV

Sistema completo de análise biomecânica avançada com três níveis de captura (Essencial, Avançado, Pro), cálculo de confiabilidade técnica, detecção de rotações axiais e geração automatizada de relatórios corretivos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso Rápido](#uso-rápido)
- [Níveis de Captura](#níveis-de-captura)
- [Índice de Confiabilidade](#índice-de-confiabilidade)
- [Detecção de Rotação](#detecção-de-rotação)
- [Relatórios Corretivos](#relatórios-corretivos)
- [API Reference](#api-reference)
- [Exemplos](#exemplos)

## 🎯 Visão Geral

O sistema analisa movimentos biomecânicos através de vídeos capturados em diferentes ângulos, calculando:

- **Índice de Confiabilidade Técnico** (6 fatores)
- **Detecção de Compensações Rotacionais** (com precisão variável)
- **Scores de Movimento** (motor, estabilizador, simetria, compensação, IGPB)
- **Nível de Risco** (LOW, MODERATE, HIGH)
- **Protocolo Corretivo** (ações priorizadas com exercícios específicos)
- **Recomendações de Reteste** (com timeframes adequados)

## 🏗️ Arquitetura

```
src/
├── types/
│   └── biomechanical-analysis.types.ts    # Sistema completo de tipos
├── engines/
│   ├── confidence-calculator.engine.ts    # Cálculo de confiabilidade (6 fatores)
│   ├── rotation-detector.engine.ts        # Detecção de rotação axial
│   ├── report-generator.engine.ts         # Geração de relatórios corretivos
│   └── biomechanical-analyzer.engine.ts   # Orquestrador principal
├── utils/
│   └── biomechanical.helpers.ts           # Utilitários de formatação
└── examples/
    └── biomechanical-analysis.example.ts  # Exemplos de uso completos
```

### Engines (Singleton Pattern)

1. **ConfidenceCalculatorEngine**: Calcula índice de confiabilidade baseado em:
   - Calibração espacial (distância + resolução)
   - Resolução temporal (fps)
   - Visibilidade de landmarks
   - Estabilidade de tracking
   - Cobertura de planos
   - Qualidade de iluminação

2. **RotationDetectorEngine**: Detecta compensações rotacionais através de:
   - Análise de assimetrias bilaterais (ombros, quadris, joelhos)
   - Classificação de confiança (NOT_MEASURABLE, INFERRED, PROBABLE, CONFIRMED)
   - Identificação de tipo (NONE, TECHNICAL, STRUCTURAL, FUNCTIONAL, PATHOLOGICAL)
   - Localização de origem (SCAPULAR, THORACIC, LUMBAR, PELVIC, FEMORAL)

3. **ReportGeneratorEngine**: Gera relatórios com:
   - Classificação de risco
   - Ações corretivas priorizadas
   - Prompts de upgrade de modo
   - Recomendações de reteste

4. **BiomechanicalAnalyzerEngine**: Orquestra todo o processo de análise

## 🚀 Instalação

```bash
# Copiar arquivos para o projeto
cp -r src/ /seu-projeto/

# Instalar dependências (se necessário)
npm install  # ou yarn install
```

## 💻 Uso Rápido

```typescript
import { biomechanicalAnalyzer } from './engines/biomechanical-analyzer.engine';
import { CaptureMode, CameraAngle } from './types/biomechanical-analysis.types';

// Preparar parâmetros
const params = {
  exerciseName: 'Agachamento Livre',
  captureSetup: {
    mode: CaptureMode.ESSENTIAL,
    angles: [CameraAngle.SAGITTAL_RIGHT],
    fps: 60,
    resolution: { width: 1920, height: 1080 },
    distanceToSubject: 3.0,
    synchronized: true,
    maxDesyncMs: 16
  },
  frames: [...], // FrameAnalysis[] com landmarks do MediaPipe
  scores: {
    motor: 75,
    stabilizer: 65,
    symmetry: 82,
    compensation: 25,
    igpb: 73
  }
};

// Executar análise
const analysis = biomechanicalAnalyzer.analyze(params);

console.log(`Confiabilidade: ${analysis.confidenceScore}%`);
console.log(`Risco: ${analysis.riskLevel}`);
console.log(`Ações Corretivas: ${analysis.correctiveActions.length}`);
```

## 📹 Níveis de Captura

### ESSENTIAL (1 ângulo)
- **Planos**: Sagital (lateral)
- **Confiabilidade Mínima**: 60%
- **Análise**: 2D monoplanar
- **Rotação**: Inferida através de assimetrias

```typescript
mode: CaptureMode.ESSENTIAL,
angles: [CameraAngle.SAGITTAL_RIGHT]
```

### ADVANCED (2 ângulos)
- **Planos**: Sagital + Frontal (ortogonais)
- **Confiabilidade Mínima**: 75%
- **Análise**: 2.5D biplanar
- **Rotação**: Provável (confirmação biplanar)

```typescript
mode: CaptureMode.ADVANCED,
angles: [CameraAngle.SAGITTAL_RIGHT, CameraAngle.FRONTAL_POSTERIOR]
```

### PRO (3 ângulos)
- **Planos**: Sagital + Frontal + Transversal
- **Confiabilidade Mínima**: 85%
- **Análise**: Reconstrução 3D triplanar
- **Rotação**: Confirmada (reconstrução vetorial 3D)

```typescript
mode: CaptureMode.PRO,
angles: [
  CameraAngle.SAGITTAL_RIGHT,
  CameraAngle.FRONTAL_POSTERIOR,
  CameraAngle.TRANSVERSE_SUPERIOR
]
```

## 🎯 Índice de Confiabilidade

O sistema calcula confiabilidade através de 6 fatores ponderados:

| Fator | Peso | Cálculo |
|-------|------|---------|
| Calibração Espacial | 15% | Distância ideal (3m) + resolução mínima (1280x720) |
| Resolução Temporal | 10% | FPS normalizado (60fps = 100, 120fps = 100) |
| Visibilidade Landmarks | 25% | % landmarks visíveis + confiança média |
| Estabilidade Tracking | 20% | Variação frame-to-frame |
| Cobertura Planos | 20% | ESSENTIAL=33, ADVANCED=66, PRO=100 |
| Qualidade Iluminação | 10% | Uniformidade + brilho |

### Níveis de Confiabilidade

- **Baixa**: 0-60% ⚠️
- **Moderada**: 60-75% 🟡
- **Alta**: 75-90% 🟢
- **Excelente**: 90-100% 🔵

## 🔄 Detecção de Rotação

### Níveis de Confiança

| Confiança | Score | Método | Descrição |
|-----------|-------|--------|-----------|
| NOT_MEASURABLE | 0-30% | 1 plano | Rotação não mensurável |
| INFERRED | 30-50% | 1 plano | Inferida por assimetria sagital |
| PROBABLE | 50-80% | 2 planos | Confirmada biplanar ortogonal |
| CONFIRMED | 80-100% | 3 planos | Reconstrução vetorial 3D |

### Tipos de Rotação

- **NONE**: Sem rotação significativa (< 3°)
- **TECHNICAL**: Rotação intencional (ex: Pallof press, woodchop)
- **STRUCTURAL**: Assimetria esquelética/articular (> 25°)
- **FUNCTIONAL**: Déficit neuromuscular (15-25°)
- **PATHOLOGICAL**: Padrão antálgico (requer avaliação)

### Origem Anatômica

- **SCAPULAR**: Complexo escapular
- **THORACIC**: Coluna torácica
- **LUMBAR**: Região lombopélvica
- **PELVIC**: Cintura pélvica
- **FEMORAL**: Articulação coxofemoral
- **MULTI_SEGMENTAL**: Múltiplos segmentos

## 📊 Relatórios Corretivos

### Ações Corretivas (Priorizadas)

1. **Estabilidade** (se stabilizer < 70)
   - Prancha frontal, Dead bug, Pallof press, Bird dog
   - Duração: 3-4 semanas, 3x/semana

2. **Força/Simetria** (se symmetry < 80)
   - Bulgarian split squat, Remada unilateral
   - Duração: 4-6 semanas

3. **Mobilidade** (se rotação > 10°)
   - Exercícios específicos por origem anatômica
   - Duração: 2-3 semanas, diariamente

4. **Técnica** (se motor < 70)
   - Regressões, feedback tátil, amplitude parcial
   - Duração: 2-3 semanas

### Timeframes de Reteste

- **Risco LOW**: 6-8 semanas
- **Risco MODERATE**: 4-6 semanas
- **Risco HIGH**: 2-3 semanas

## 📚 API Reference

### BiomechanicalAnalyzerEngine

```typescript
// Análise síncrona
analyze(params: AnalysisParams): BiomechanicalAnalysis

// Análise assíncrona
analyzeAsync(params: AnalysisParams): Promise<BiomechanicalAnalysis>

// Batch síncrono
analyzeBatch(batchParams: AnalysisParams[]): BiomechanicalAnalysis[]

// Batch assíncrono
analyzeBatchAsync(batchParams: AnalysisParams[]): Promise<BiomechanicalAnalysis[]>
```

### ConfidenceCalculatorEngine

```typescript
// Calcular fatores
calculateConfidenceFactors(
  setup: CameraSetup,
  currentLandmarks: LandmarkData[],
  previousLandmarks?: LandmarkData[]
): ConfidenceFactors

// Score geral
calculateOverallConfidence(factors: ConfidenceFactors): number

// Nível qualitativo
getConfidenceLevel(score: number): 'baixa' | 'moderada' | 'alta' | 'excelente'

// Validar confiabilidade
isConfidenceValid(score: number, mode: CaptureMode): boolean

// Recomendações
generateRecommendations(factors: ConfidenceFactors): string[]
```

### RotationDetectorEngine

```typescript
// Analisar rotação
analyzeRotation(
  frames: FrameAnalysis[],
  mode: CaptureMode,
  exerciseName: string
): RotationAnalysis
```

### ReportGeneratorEngine

```typescript
// Gerar relatório completo
generateReport(analysis: Partial<BiomechanicalAnalysis>): BiomechanicalAnalysis
```

### Helpers

```typescript
// ID único
generateAnalysisId(): string

// Formatações
formatConfidenceScore(score: number): string  // "85.2%"
formatRotationMagnitude(magnitude: number): string  // "15.3°"

// Cores
getConfidenceColor(level: string): string  // "#10B981"
getRiskColor(risk: RiskLevel): string  // "#EF4444"

// Relatórios
formatBiomechanicalReport(analysis: BiomechanicalAnalysis): string
formatBiomechanicalReportHTML(analysis: BiomechanicalAnalysis): string

// Score de qualidade
calculateAnalysisQuality(analysis: BiomechanicalAnalysis): number
```

## 📝 Exemplos

Veja `examples/biomechanical-analysis.example.ts` para exemplos completos:

1. **Exemplo 1**: Análise ESSENCIAL (1 ângulo)
2. **Exemplo 2**: Análise AVANÇADA (2 ângulos)
3. **Exemplo 3**: Análise PRO (3 ângulos)
4. **Exemplo 4**: Análise em Batch
5. **Exemplo 5**: Validação de Erro

### Executar Exemplos

```bash
# Com ts-node
npx ts-node src/examples/biomechanical-analysis.example.ts

# Com Node.js (após compilar)
npm run build
node dist/examples/biomechanical-analysis.example.js
```

## ⚠️ Validações Importantes

### Geometria Espacial

- ✅ Usar planos ORTOGONAIS (sagital ⊥ frontal ⊥ transversal)
- ❌ NÃO usar "lateral direita + lateral esquerda" (mesmo plano)
- ✅ Análise biplanar ortogonal (não "correlação parcial 3D")

### Cálculos Matemáticos

- ✅ Converter radianos → graus: `(angle * 180) / Math.PI`
- ✅ Distância euclidiana: `Math.sqrt(dx² + dy²)`
- ✅ Normalização de scores: `Math.max(0, Math.min(100, score))`

### Thresholds de Assimetria

- **Negligível**: < 3°
- **Menor**: < 8°
- **Moderada**: < 15°
- **Severa**: ≥ 25°

## 🔧 Troubleshooting

### Erro: Confiabilidade insuficiente

```
Confiabilidade insuficiente para modo PRO (score: 72%, mínimo: 85%)
```

**Solução**: Verificar recomendações retornadas no erro e ajustar setup

### Erro: Landmarks incompletos

```
Apenas 25/60 frames contêm landmarks (mínimo 50%)
```

**Solução**: Melhorar iluminação, enquadramento ou qualidade do vídeo

### Erro: Modo incompatível

```
Modo PRO requer 3 ângulo(s), mas apenas 1 fornecido(s)
```

**Solução**: Adicionar ângulos de câmera ou usar modo compatível

## 📄 Licença

Propriedade de NutriFitCoach. Todos os direitos reservados.

## 👥 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0
**Data**: 2026-02-15
**Autor**: Sistema NFC/NFV
