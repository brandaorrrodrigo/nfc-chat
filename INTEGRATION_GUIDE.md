# 🔗 Guia de Integração - Sistema Biomecânico com NFC

Este guia demonstra como integrar o novo sistema de análise biomecânica com o pipeline existente do NutriFitCoach.

---

## 📋 Visão Geral da Integração

O novo sistema biomecânico foi projetado para complementar o pipeline V2 existente (Motor/Stabilizer), adicionando:

1. **Índice de Confiabilidade Técnico** (análise de qualidade de captura)
2. **Detecção Avançada de Rotação** (3 níveis de confiança)
3. **Relatórios Corretivos Automatizados** (protocolos personalizados)
4. **Sistema de Upgrade de Modo** (ESSENTIAL → ADVANCED → PRO)

---

## 🏗️ Arquitetura de Integração

```
Pipeline Existente (V2)                    Novo Sistema Biomecânico
─────────────────────                      ────────────────────────

1. Captura de Vídeo                        1. Análise de Setup
   ↓                                          ├─ CaptureMode detection
   │                                          ├─ CameraAngle mapping
2. MediaPipe Analysis                         └─ FPS/Resolution check
   │ (mediapipe_analyze_frame.py)
   ↓                                       2. Cálculo de Confiabilidade
   │                                          ├─ Calibração espacial
3. Motor/Stabilizer Scoring                   ├─ Resolução temporal
   │ (classifier-v2.ts)                       ├─ Visibilidade landmarks
   ↓                                          ├─ Estabilidade tracking
   │                                          ├─ Cobertura de planos
4. API Response                               └─ Qualidade de iluminação
   │ (/api/biomechanics/analyze)
   ↓                                       3. Detecção de Rotação
   │                                          ├─ Assimetrias bilaterais
5. Dashboard Display ─────────────────────►   ├─ Classificação de tipo
   (dashboard/page.tsx)                       ├─ Localização de origem
                                              └─ Magnitude vetorial

                                           4. Geração de Relatório
                                              ├─ Classificação de risco
                                              ├─ Ações corretivas
                                              ├─ Prompt de upgrade
                                              └─ Recomendação de reteste
```

---

## 🔌 Pontos de Integração

### 1. **Mapear Dados do MediaPipe → LandmarkData**

**Localização**: `lib/biomechanics/mediapipe-bridge.ts`

```typescript
import type { LandmarkData } from '@/src/types/biomechanical-analysis.types';

/**
 * Converte landmarks do MediaPipe para formato do sistema biomecânico
 */
export function mapMediaPipeToLandmarks(
  mediapipeLandmarks: any[] // Output do Python
): LandmarkData[] {
  return mediapipeLandmarks.map((lm) => ({
    name: lm.name,
    x: lm.x,
    y: lm.y,
    z: lm.z, // Importante para ADVANCED/PRO
    confidence: lm.visibility, // MediaPipe usa 'visibility'
    visible: lm.visibility > 0.5,
    occluded: lm.visibility < 0.5
  }));
}
```

---

### 2. **Detectar Modo de Captura Automaticamente**

**Localização**: `lib/biomechanics/capture-detector.ts`

```typescript
import { CaptureMode, CameraAngle } from '@/src/types/biomechanical-analysis.types';
import type { CameraSetup } from '@/src/types/biomechanical-analysis.types';

/**
 * Detecta modo de captura baseado em metadados do vídeo
 */
export function detectCaptureMode(videoMetadata: {
  angles: string[];
  fps: number;
  resolution: { width: number; height: number };
}): CameraSetup {
  // Mapear ângulos
  const angleMap: Record<string, CameraAngle> = {
    'sagittal_right': CameraAngle.SAGITTAL_RIGHT,
    'sagittal_left': CameraAngle.SAGITTAL_LEFT,
    'frontal_posterior': CameraAngle.FRONTAL_POSTERIOR,
    'transverse_superior': CameraAngle.TRANSVERSE_SUPERIOR
  };

  const angles = videoMetadata.angles.map(a => angleMap[a]).filter(Boolean);

  // Determinar modo baseado no número de ângulos
  let mode: CaptureMode;
  if (angles.length >= 3) {
    mode = CaptureMode.PRO;
  } else if (angles.length === 2) {
    mode = CaptureMode.ADVANCED;
  } else {
    mode = CaptureMode.ESSENTIAL;
  }

  return {
    mode,
    angles,
    fps: videoMetadata.fps,
    resolution: videoMetadata.resolution,
    distanceToSubject: 3.0, // Default ou calcular via landmarks
    synchronized: angles.length > 1,
    maxDesyncMs: 16
  };
}
```

---

### 3. **Integrar com API Route Existente**

**Localização**: `app/api/biomechanics/analyze/route.ts`

```typescript
import { biomechanicalAnalyzer } from '@/src/engines/biomechanical-analyzer.engine';
import type { AnalysisParams } from '@/src/engines/biomechanical-analyzer.engine';
import { mapMediaPipeToLandmarks } from '@/lib/biomechanics/mediapipe-bridge';
import { detectCaptureMode } from '@/lib/biomechanics/capture-detector';

export async function POST(req: Request) {
  const { videoId } = await req.json();

  // 1. Buscar vídeo e metadados
  const video = await db.video.findUnique({ where: { id: videoId } });

  // 2. Executar análise MediaPipe (existente)
  const mediapipeResult = await analyzeWithMediaPipe(video.path);

  // 3. Calcular scores Motor/Stabilizer (existente - classifier-v2.ts)
  const motorStabScores = classifyMovementV2(mediapipeResult);

  // 4. Mapear dados para novo formato
  const frames = mediapipeResult.frames.map((frame: any) => ({
    frameNumber: frame.frame_number,
    timestamp: frame.timestamp,
    landmarks: mapMediaPipeToLandmarks(frame.landmarks),
    cameraAngle: frame.camera_angle // Precisa ser adicionado ao Python
  }));

  // 5. Detectar setup de captura
  const captureSetup = detectCaptureMode({
    angles: video.cameraAngles || ['sagittal_right'],
    fps: video.fps || 60,
    resolution: { width: video.width || 1920, height: video.height || 1080 }
  });

  // 6. Executar análise biomecânica completa
  try {
    const biomechanicalAnalysis = biomechanicalAnalyzer.analyze({
      exerciseName: video.exerciseName,
      captureSetup,
      frames,
      scores: {
        motor: motorStabScores.motor,
        stabilizer: motorStabScores.stabilizer,
        symmetry: motorStabScores.symmetry || 85, // Calcular se não existir
        compensation: motorStabScores.compensation || 15,
        igpb: motorStabScores.overallScore
      }
    });

    // 7. Salvar análise no banco
    await db.biomechanicalAnalysis.create({
      data: {
        videoId,
        analysisId: biomechanicalAnalysis.analysisId,
        confidenceScore: biomechanicalAnalysis.confidenceScore,
        confidenceLevel: biomechanicalAnalysis.confidenceLevel,
        riskLevel: biomechanicalAnalysis.riskLevel,
        rotationDetected: biomechanicalAnalysis.rotationAnalysis.detected,
        rotationType: biomechanicalAnalysis.rotationAnalysis.type,
        rotationMagnitude: biomechanicalAnalysis.rotationAnalysis.magnitude,
        correctiveActionsJson: JSON.stringify(biomechanicalAnalysis.correctiveActions),
        upgradePromptJson: JSON.stringify(biomechanicalAnalysis.upgradePrompt),
        retestTimeframe: biomechanicalAnalysis.retestRecommendation.timeframe,
        fullAnalysisJson: JSON.stringify(biomechanicalAnalysis)
      }
    });

    // 8. Retornar análise completa
    return NextResponse.json({
      success: true,
      analysis: biomechanicalAnalysis,
      legacy: motorStabScores // Manter compatibilidade
    });

  } catch (error) {
    // Confiabilidade insuficiente ou erro de validação
    return NextResponse.json({
      success: false,
      error: error.message,
      legacy: motorStabScores // Retornar scores básicos mesmo com erro
    });
  }
}
```

---

### 4. **Adicionar Schema de Banco de Dados**

**Localização**: `prisma/schema.prisma`

```prisma
model BiomechanicalAnalysis {
  id                     String   @id @default(cuid())
  videoId                String   @unique
  analysisId             String   @unique
  createdAt              DateTime @default(now())

  // Confiabilidade
  confidenceScore        Float
  confidenceLevel        String   // 'baixa' | 'moderada' | 'alta' | 'excelente'

  // Risco
  riskLevel              String   // 'LOW' | 'MODERATE' | 'HIGH'

  // Rotação
  rotationDetected       Boolean
  rotationType           String?  // 'NONE' | 'TECHNICAL' | 'STRUCTURAL' | 'FUNCTIONAL' | 'PATHOLOGICAL'
  rotationMagnitude      Float?
  rotationOrigin         String?  // 'SCAPULAR' | 'THORACIC' | etc.

  // Recomendações
  correctiveActionsJson  String   @db.Text
  upgradePromptJson      String?  @db.Text
  retestTimeframe        String?

  // Dados completos
  fullAnalysisJson       String   @db.Text

  // Relações
  video                  Video    @relation(fields: [videoId], references: [id])

  @@index([videoId])
  @@index([createdAt])
}
```

---

### 5. **Atualizar Dashboard para Mostrar Novos Dados**

**Localização**: `app/biomechanics/dashboard/page.tsx`

```typescript
import { formatBiomechanicalReport } from '@/src/utils/biomechanical.helpers';
import { getConfidenceColor, getRiskColor } from '@/src/utils/biomechanical.helpers';

export default function BiomechanicalDashboard({ analysis }) {
  return (
    <div className="space-y-6">

      {/* Novo: Card de Confiabilidade */}
      <Card>
        <CardHeader>
          <CardTitle>Índice de Confiabilidade Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="text-4xl font-bold"
              style={{ color: getConfidenceColor(analysis.confidenceLevel) }}
            >
              {analysis.confidenceScore.toFixed(1)}%
            </div>
            <Badge variant={analysis.confidenceLevel === 'excelente' ? 'success' : 'default'}>
              {analysis.confidenceLevel.toUpperCase()}
            </Badge>
          </div>

          <div className="mt-4 space-y-2">
            <ProgressBar
              label="Calibração Espacial"
              value={analysis.confidenceFactors.spatialCalibration}
            />
            <ProgressBar
              label="Resolução Temporal"
              value={analysis.confidenceFactors.temporalResolution}
            />
            <ProgressBar
              label="Visibilidade Landmarks"
              value={analysis.confidenceFactors.landmarkVisibility}
            />
            <ProgressBar
              label="Estabilidade Tracking"
              value={analysis.confidenceFactors.trackingStability}
            />
            <ProgressBar
              label="Cobertura de Planos"
              value={analysis.confidenceFactors.viewCoverage}
            />
            <ProgressBar
              label="Qualidade Iluminação"
              value={analysis.confidenceFactors.lightingQuality}
            />
          </div>
        </CardContent>
      </Card>

      {/* Novo: Card de Rotação */}
      {analysis.rotationAnalysis.detected && (
        <Card>
          <CardHeader>
            <CardTitle>Detecção de Compensação Rotacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Confiança da Detecção:</span>
                <Badge>{analysis.rotationAnalysis.confidence}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Tipo:</span>
                <Badge variant={analysis.rotationAnalysis.type === 'PATHOLOGICAL' ? 'destructive' : 'default'}>
                  {analysis.rotationAnalysis.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Origem Anatômica:</span>
                <span className="font-medium">{analysis.rotationAnalysis.origin}</span>
              </div>
              <div className="flex justify-between">
                <span>Magnitude:</span>
                <span className="font-bold text-lg">{analysis.rotationAnalysis.magnitude.toFixed(1)}°</span>
              </div>

              <Separator />

              <div className="text-sm">
                <p className="font-medium mb-2">Assimetrias Bilaterais:</p>
                <ul className="space-y-1">
                  <li>Ombro: {analysis.rotationAnalysis.bilateralDifference.shoulder.toFixed(1)}°</li>
                  <li>Quadril: {analysis.rotationAnalysis.bilateralDifference.hip.toFixed(1)}°</li>
                  <li>Joelho: {analysis.rotationAnalysis.bilateralDifference.knee.toFixed(1)}°</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Novo: Card de Protocolo Corretivo */}
      {analysis.correctiveActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Protocolo Corretivo Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.correctiveActions.map((action, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={action.priority === 'alta' ? 'destructive' : 'default'}>
                      {action.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{action.category.toUpperCase()}</Badge>
                  </div>
                  <p className="font-medium mb-2">{action.description}</p>
                  <p className="text-sm text-muted-foreground mb-2">⏱️ {action.duration}</p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Exercícios:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {action.exercises.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Novo: Card de Upgrade */}
      {analysis.upgradePrompt && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle>💡 Recomendação de Upgrade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              <strong>{analysis.upgradePrompt.currentMode}</strong> →
              <strong className="text-blue-600"> {analysis.upgradePrompt.recommendedMode}</strong>
            </p>
            <p className="text-sm mb-3">{analysis.upgradePrompt.reason}</p>
            <div className="text-sm">
              <p className="font-medium mb-2">Benefícios:</p>
              <ul className="list-disc list-inside space-y-1">
                {analysis.upgradePrompt.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Novo: Card de Reteste */}
      {analysis.retestRecommendation.recommended && (
        <Card>
          <CardHeader>
            <CardTitle>🔁 Recomendação de Reteste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prazo Recomendado:</span>
                <Badge variant="outline">{analysis.retestRecommendation.timeframe}</Badge>
              </div>
              <p className="text-sm">{analysis.retestRecommendation.reason}</p>
              {analysis.retestRecommendation.focusAreas.length > 0 && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Áreas de Foco:</p>
                    <ul className="list-disc list-inside">
                      {analysis.retestRecommendation.focusAreas.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existente: Cards Motor/Stabilizer continuam funcionando */}
      <MotorStabilizerCards analysis={analysis} />

    </div>
  );
}
```

---

### 6. **Adicionar CameraAngle ao Script Python**

**Localização**: `scripts/mediapipe_analyze_frame.py`

```python
def analyze_video_with_camera_angle(video_path, camera_angle='sagittal_right'):
    """
    Adiciona metadado de ângulo de câmera aos frames
    """
    results = []

    # ... código existente de análise ...

    for frame_idx, frame in enumerate(frames):
        result = {
            'frame_number': frame_idx,
            'timestamp': frame_idx * (1000 / fps),
            'camera_angle': camera_angle,  # NOVO
            'landmarks': [
                {
                    'name': landmark_names[i],
                    'x': lm.x,
                    'y': lm.y,
                    'z': lm.z,
                    'visibility': lm.visibility
                }
                for i, lm in enumerate(frame_landmarks)
            ]
        }
        results.append(result)

    return results
```

---

## 📊 Fluxo de Dados Completo

```typescript
// 1. Upload de vídeo (com metadados)
const videoData = {
  path: '/videos/agachamento_001.mp4',
  exerciseName: 'back_squat',
  cameraAngles: ['sagittal_right', 'frontal_posterior'], // NOVO
  fps: 60,
  width: 1920,
  height: 1080
};

// 2. Análise MediaPipe (Python)
const mediapipeFrames = await analyzeWithMediaPipe(videoData);
// → landmarks com x, y, z, visibility por frame

// 3. Classificação Motor/Stabilizer (existente)
const motorStabScores = classifyMovementV2(mediapipeFrames);
// → motor, stabilizer, overallScore

// 4. Cálculo de Simetria (novo ou existente)
const symmetryScore = calculateSymmetry(mediapipeFrames);
// → symmetry: 0-100

// 5. Análise Biomecânica Completa (novo sistema)
const biomechanicalAnalysis = biomechanicalAnalyzer.analyze({
  exerciseName: videoData.exerciseName,
  captureSetup: detectCaptureMode(videoData),
  frames: mapMediaPipeToFrames(mediapipeFrames),
  scores: {
    motor: motorStabScores.motor,
    stabilizer: motorStabScores.stabilizer,
    symmetry: symmetryScore,
    compensation: 100 - motorStabScores.overallScore,
    igpb: motorStabScores.overallScore
  }
});

// 6. Persistência
await saveAnalysis(biomechanicalAnalysis);

// 7. Display
return {
  legacy: motorStabScores,           // Dados existentes
  biomechanical: biomechanicalAnalysis // Novo sistema
};
```

---

## 🚀 Plano de Rollout

### Fase 1: Setup Básico (1-2 dias)
- [ ] Copiar arquivos `src/` para o projeto
- [ ] Adicionar schema Prisma
- [ ] Criar funções de mapeamento (mediapipe-bridge.ts)
- [ ] Testar importações

### Fase 2: Integração Backend (2-3 dias)
- [ ] Atualizar API route
- [ ] Implementar detectCaptureMode
- [ ] Adicionar camera_angle ao Python
- [ ] Testar análise completa end-to-end

### Fase 3: Integração Frontend (2-3 dias)
- [ ] Criar componentes de UI
- [ ] Atualizar dashboard
- [ ] Adicionar cards de confiabilidade/rotação
- [ ] Implementar exibição de protocolo corretivo

### Fase 4: Testes e Validação (3-5 dias)
- [ ] Testar com vídeos reais (3 exercícios)
- [ ] Validar confiabilidade
- [ ] Verificar precisão de detecção de rotação
- [ ] Ajustar thresholds se necessário

### Fase 5: Deploy (1 dia)
- [ ] Deploy para staging
- [ ] Validação com usuários beta
- [ ] Deploy para produção

**Total estimado**: 9-14 dias

---

## ⚠️ Considerações Importantes

### 1. Compatibilidade com Pipeline Existente
- O novo sistema NÃO substitui o pipeline V2
- Funciona como complemento, adicionando camadas de análise
- Scores Motor/Stabilizer existentes são reutilizados

### 2. Performance
- Análise biomecânica adiciona ~200-500ms ao tempo de processamento
- Considerar rodar em background para vídeos longos
- Usar `analyzeAsync` para não bloquear resposta da API

### 3. Armazenamento
- Análise completa ocupa ~5-10KB em JSON
- Considerar compressão para vídeos com muitos frames
- Guardar apenas fullAnalysisJson se storage for limitado

### 4. Versionamento
- Incluir versão do sistema no analysisId
- Manter compatibilidade com análises antigas
- Documentar mudanças de thresholds

---

## 📝 Checklist de Integração

- [ ] Arquivos `src/` copiados para o projeto
- [ ] Schema Prisma atualizado
- [ ] Funções de mapeamento implementadas
- [ ] API route integrada
- [ ] Script Python atualizado
- [ ] Dashboard atualizado
- [ ] Testes end-to-end passando
- [ ] Documentação atualizada
- [ ] Deploy para staging
- [ ] Validação com usuários
- [ ] Deploy para produção

---

## 🎓 Recursos de Referência

1. **Documentação do Sistema**: `src/README.md`
2. **Exemplos de Uso**: `src/examples/biomechanical-analysis.example.ts`
3. **Tipos TypeScript**: `src/types/biomechanical-analysis.types.ts`
4. **Pipeline V2 Existente**: `lib/biomechanics/classifier-v2.ts`
5. **MediaPipe Bridge**: `lib/biomechanics/mediapipe-bridge.ts`

---

## 💬 Suporte

Para dúvidas durante a integração:
1. Consultar este guia
2. Verificar exemplos em `src/examples/`
3. Revisar tipos em `src/types/`
4. Testar com dados mock primeiro

---

**Última Atualização**: 2026-02-15
**Versão do Sistema**: 1.0.0
