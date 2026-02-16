# 🎥 Pipeline de Processamento de Vídeo - NFC/NFV

Sistema completo de processamento de vídeo com MediaPipe Pose Detection integrado ao sistema de análise biomecânica NFC/NFV.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Arquitetura](#arquitetura)
- [Uso Rápido](#uso-rápido)
- [Componentes](#componentes)
- [Exemplos](#exemplos)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O pipeline de processamento de vídeo permite:

1. **Extração Automática de Frames** usando FFmpeg
2. **Detecção de Poses** com MediaPipe/TensorFlow.js
3. **Conversão de Keypoints** para formato NFC/NFV
4. **Cálculo Automático de Scores** de movimento
5. **Análise Biomecânica Completa** com relatórios corretivos
6. **Processamento em Tempo Real** via webcam ou stream

---

## 📦 Instalação

### 1. Instalar FFmpeg

**Windows:**
```bash
# Com Chocolatey
choco install ffmpeg

# Ou baixar em: https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### 2. Instalar Dependências Node.js

```bash
npm install @tensorflow/tfjs-node @tensorflow-models/pose-detection fluent-ffmpeg canvas
npm install --save-dev @types/fluent-ffmpeg
```

### 3. Verificar Instalação

```bash
# Verificar FFmpeg
ffmpeg -version

# Verificar TensorFlow.js
node -e "require('@tensorflow/tfjs-node'); console.log('✅ TensorFlow.js OK')"
```

---

## 🏗️ Arquitetura

```
VIDEO PIPELINE
├── Adapters
│   └── mediapipe.adapter.ts           # Conversão MediaPipe → NFC/NFV
├── Services
│   ├── pose-detection.service.ts      # Detector MediaPipe/TF.js
│   ├── video-extraction.service.ts    # Extração de frames (FFmpeg)
│   └── movement-scoring.service.ts    # Cálculo de scores automático
├── Pipelines
│   ├── video-processing.pipeline.ts   # Pipeline completo de vídeo
│   └── realtime-processing.pipeline.ts # Processamento em tempo real
├── Utils
│   └── video.helpers.ts               # Utilitários de vídeo
└── Examples
    └── video-analysis.example.ts      # Exemplos completos
```

---

## 🚀 Uso Rápido

### Processar um Vídeo (Modo ESSENCIAL)

```typescript
import { videoProcessingPipeline } from './src/pipelines/video-processing.pipeline';
import { CaptureMode, CameraAngle } from './src/types/biomechanical-analysis.types';

const result = await videoProcessingPipeline.process({
  videoPath: './videos/agachamento.mp4',
  exerciseName: 'Agachamento Livre',
  captureMode: CaptureMode.ESSENTIAL,
  cameraAngle: CameraAngle.SAGITTAL_RIGHT,
  onProgress: (progress) => {
    console.log(`Progresso: ${progress.toFixed(1)}%`);
  }
});

console.log(`IGPB: ${result.analysis.scores.igpb}/100`);
console.log(`Confiabilidade: ${result.analysis.confidenceScore}%`);
console.log(`Ações Corretivas: ${result.analysis.correctiveActions.length}`);
```

### Processar Múltiplos Ângulos (Modo AVANÇADO)

```typescript
const result = await videoProcessingPipeline.processMultipleAngles({
  videoPaths: [
    './videos/deadlift-lateral.mp4',
    './videos/deadlift-posterior.mp4'
  ],
  cameraAngles: [
    CameraAngle.SAGITTAL_RIGHT,
    CameraAngle.FRONTAL_POSTERIOR
  ],
  exerciseName: 'Levantamento Terra',
  captureMode: CaptureMode.ADVANCED
});
```

### Processamento em Tempo Real

```typescript
import { realtimeProcessingPipeline } from './src/pipelines/realtime-processing.pipeline';

// Iniciar sessão
await realtimeProcessingPipeline.start({
  exerciseName: 'Agachamento',
  captureMode: CaptureMode.ESSENTIAL,
  cameraAngle: CameraAngle.SAGITTAL_RIGHT,
  onFrameProcessed: (frame, quality) => {
    console.log(`Frame ${frame.frameNumber} processado (${quality}%)`);
  },
  onAnalysisComplete: (analysis) => {
    console.log(`IGPB: ${analysis.scores.igpb}`);
  }
});

// Processar frames (loop da webcam)
while (isCapturing) {
  const imageData = await getFrameFromWebcam();
  await realtimeProcessingPipeline.processFrame(imageData);
}

// Parar e obter análise final
const finalAnalysis = await realtimeProcessingPipeline.stop();
```

---

## 🧩 Componentes

### 1. MediaPipeAdapter

Converte dados do MediaPipe para formato NFC/NFV.

**Métodos principais:**
- `convertPoseToLandmarks()` - Converte pose completa
- `validateLandmarks()` - Valida qualidade dos landmarks
- `calculateLandmarkQuality()` - Calcula score de qualidade (0-100)
- `calculateAngle()` - Calcula ângulo entre 3 landmarks

### 2. PoseDetectionService

Gerencia detector MediaPipe/TensorFlow.js.

**Métodos principais:**
- `initialize()` - Inicializa detector (com warmup)
- `detectPose()` - Detecta uma pose em imagem
- `detectPoses()` - Detecta múltiplas poses
- `benchmark()` - Testa performance do detector

**Configuração padrão:**
```typescript
{
  modelType: movenet.modelType.SINGLEPOSE_THUNDER,
  enableSmoothing: true,
  minPoseScore: 0.3
}
```

### 3. VideoExtractionService

Extrai frames de vídeos usando FFmpeg.

**Métodos principais:**
- `getVideoMetadata()` - Obtém metadados (duração, fps, resolução)
- `extractFrames()` - Extrai frames com callbacks de progresso
- `extractFrameAtTimestamp()` - Extrai frame específico
- `generateThumbnail()` - Gera thumbnail do vídeo

**Formatos suportados:**
- MP4, WebM, AVI, MOV, MKV

### 4. MovementScoringService

Calcula scores de movimento automaticamente.

**Scores calculados:**
- **Motor** (0-100): Amplitude, fluidez, completude
- **Stabilizer** (0-100): Estabilidade do tronco, alinhamento
- **Symmetry** (0-100): Simetria bilateral
- **Compensation** (0-100): Compensações rotacionais/laterais
- **IGPB** (0-100): Índice global (média ponderada)

**Ponderação IGPB:**
```
Motor: 30%
Stabilizer: 25%
Symmetry: 25%
Compensation: 20% (invertido)
```

### 5. VideoProcessingPipeline

Orquestra processamento completo de vídeos.

**Fluxo de processamento:**
1. Validação de entrada
2. Inicialização do detector
3. Extração de frames (FFmpeg)
4. Detecção de poses frame-by-frame
5. Cálculo de scores
6. Análise biomecânica completa
7. Cleanup de frames

**Opções configuráveis:**
- FPS de extração
- Limite de frames
- Callbacks de progresso
- Diretório de saída customizado

### 6. RealtimeProcessingPipeline

Processamento em tempo real com buffer.

**Recursos:**
- Buffer configurável (default: 60 frames)
- Auto-análise quando buffer atinge tamanho
- Callbacks de frame e análise
- Estatísticas de performance
- Controle de qualidade automático

---

## 📝 Exemplos

### Exemplo 1: Análise Básica

```bash
# Executar exemplos
npx ts-node src/examples/video-analysis.example.ts
```

**Saída esperada:**
```
🎬 Iniciando processamento...
⏳ Progresso: 100.0%

✅ Processamento concluído!

📊 Metadados:
   Total de frames: 90
   Frames processados: 85
   Taxa de sucesso: 94.4%
   Tempo: 12.3s
   FPS médio: 6.9

🔬 Análise Biomecânica:
   Motor: 78.5/100
   Stabilizer: 72.3/100
   Symmetry: 85.0/100
   Compensation: 18.2/100
   IGPB: 76.8/100
```

### Exemplo 2: Multi-Ângulo

```typescript
const result = await videoProcessingPipeline.processMultipleAngles({
  videoPaths: [
    './videos/exercise-sagittal.mp4',
    './videos/exercise-frontal.mp4'
  ],
  cameraAngles: [
    CameraAngle.SAGITTAL_RIGHT,
    CameraAngle.FRONTAL_POSTERIOR
  ],
  exerciseName: 'Agachamento',
  captureMode: CaptureMode.ADVANCED,
  maxFrames: 120
});

// Confiabilidade aumenta com múltiplos ângulos
console.log(result.analysis.confidenceScore); // ~75-85%
```

### Exemplo 3: Processamento de Lote

```typescript
const videos = [
  { path: './videos/squat1.mp4', exercise: 'Agachamento' },
  { path: './videos/deadlift1.mp4', exercise: 'Terra' },
  { path: './videos/bench1.mp4', exercise: 'Supino' }
];

for (const video of videos) {
  const result = await videoProcessingPipeline.process({
    videoPath: video.path,
    exerciseName: video.exercise,
    captureMode: CaptureMode.ESSENTIAL
  });

  console.log(`${video.exercise}: IGPB ${result.analysis.scores.igpb}`);
}
```

---

## ⚡ Performance

### Benchmarks Típicos

| Configuração | FPS Processamento | Tempo (10s vídeo) |
|--------------|-------------------|-------------------|
| CPU (i7) + 30fps | 5-8 fps | ~40-60s |
| CPU (i7) + 60fps | 3-5 fps | ~120-200s |
| GPU (CUDA) + 30fps | 15-25 fps | ~12-20s |
| GPU (CUDA) + 60fps | 8-15 fps | ~40-75s |

### Otimizações

**1. Reduzir FPS de Extração**
```typescript
{
  fps: 30 // Suficiente para análise (vs 60fps original)
}
```

**2. Limitar Frames**
```typescript
{
  maxFrames: 120 // ~4s @ 30fps (captura pico do movimento)
}
```

**3. Usar GPU (se disponível)**
```bash
npm install @tensorflow/tfjs-node-gpu
```

```typescript
// Trocar import
import '@tensorflow/tfjs-node-gpu';
```

**4. Processar em Batches**
```typescript
// Processar 100 frames por vez para evitar memory leak
const batchSize = 100;
for (let i = 0; i < frames.length; i += batchSize) {
  const batch = frames.slice(i, i + batchSize);
  // processar batch
}
```

**5. Cleanup de Tensors**
```typescript
// TensorFlow.js automaticamente faz cleanup, mas pode forçar:
import * as tf from '@tensorflow/tfjs-node';
tf.dispose(); // Após processamento
```

---

## 🔧 Troubleshooting

### Problema 1: "FFmpeg not found"

**Solução:**
```bash
# Verificar PATH
ffmpeg -version

# Adicionar ao PATH se necessário (Windows)
setx PATH "%PATH%;C:\ffmpeg\bin"

# Reiniciar terminal
```

### Problema 2: "Cannot find module @tensorflow/tfjs-node"

**Solução:**
```bash
# Reinstalar dependências
npm install @tensorflow/tfjs-node --save

# Se erro persistir (Windows)
npm install --global --production windows-build-tools
npm install @tensorflow/tfjs-node --build-from-source
```

### Problema 3: "Out of memory"

**Causas:**
- Vídeo muito longo
- FPS muito alto
- Não está fazendo cleanup

**Soluções:**
```typescript
// Limitar frames
maxFrames: 120

// Reduzir FPS
fps: 30

// Processar em chunks
const chunks = chunkArray(frames, 50);
for (const chunk of chunks) {
  await processChunk(chunk);
}
```

### Problema 4: "Detector initialization failed"

**Solução:**
```bash
# Limpar cache do TensorFlow
rm -rf ~/.tfjs

# Reinstalar modelo
npm cache clean --force
npm install @tensorflow-models/pose-detection
```

### Problema 5: "No pose detected"

**Causas:**
- Iluminação ruim
- Pessoa muito longe/perto
- Oclusão de partes do corpo

**Soluções:**
- Melhorar iluminação do vídeo
- Ajustar distância (ideal: 2-4 metros)
- Usar modelo mais sensível (MULTIPOSE_LIGHTNING)
- Reduzir minPoseScore: `{ minPoseScore: 0.2 }`

### Problema 6: "Processing muito lento"

**Soluções:**
1. Usar GPU: `@tensorflow/tfjs-node-gpu`
2. Reduzir FPS: `fps: 15`
3. Usar modelo mais rápido: `SINGLEPOSE_LIGHTNING`
4. Processar offline (não tempo real)
5. Limitar frames: `maxFrames: 90`

---

## 📊 Formato de Saída

### ProcessingResult

```typescript
{
  analysis: {
    analysisId: "bio_1234567890_abc",
    exerciseName: "Agachamento Livre",
    confidenceScore: 78.5,
    confidenceLevel: "alta",
    scores: {
      motor: 78.5,
      stabilizer: 72.3,
      symmetry: 85.0,
      compensation: 18.2,
      igpb: 76.8
    },
    rotationAnalysis: {
      detected: true,
      confidence: "PROBABLE",
      type: "FUNCTIONAL",
      origin: "LUMBAR",
      magnitude: 12.3
    },
    correctiveActions: [
      {
        priority: "alta",
        category: "mobilidade",
        description: "Mobilização de região lombopélvica",
        exercises: ["Rotação lombar", "90/90 hip stretch"],
        duration: "2-3 semanas, diariamente"
      }
    ]
  },
  metadata: {
    totalFrames: 90,
    processedFrames: 85,
    processingTimeMs: 12300,
    fps: 6.9,
    successRate: 94.4
  }
}
```

---

## 🎓 Próximos Passos

1. **Integração com API:**
   - Adicionar endpoint `/api/video/analyze`
   - Upload de vídeo com progress bar
   - Retorno de análise em JSON

2. **Interface Web:**
   - Dashboard de análise
   - Visualização de landmarks
   - Player de vídeo com overlay

3. **Otimizações:**
   - Worker threads para processamento paralelo
   - Cache de vídeos processados
   - Compressão de resultados

4. **Features Avançadas:**
   - Comparação entre análises
   - Tracking de progresso ao longo do tempo
   - Exportação de relatórios em PDF

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar este README
2. Executar exemplos: `npx ts-node src/examples/video-analysis.example.ts`
3. Verificar logs de erro detalhados
4. Consultar documentação do TensorFlow.js: https://www.tensorflow.org/js

---

**Versão:** 1.0.0
**Data:** 2026-02-15
**Autor:** Sistema NFC/NFV
