# 🧪 Instruções de Teste - Pipeline de Vídeo NFC/NFV

Guia passo-a-passo para testar o sistema de processamento de vídeo com MediaPipe.

---

## 📋 Pré-requisitos

### 1. Instalar FFmpeg

**Windows (Chocolatey):**
```bash
choco install ffmpeg
```

**Windows (Manual):**
1. Baixar em: https://ffmpeg.org/download.html
2. Extrair para `C:\ffmpeg`
3. Adicionar ao PATH: `C:\ffmpeg\bin`
4. Reiniciar terminal

**Verificar instalação:**
```bash
ffmpeg -version
```

### 2. Instalar Dependências Node.js

```bash
# Navegar para raiz do projeto
cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades

# Instalar dependências
npm install @tensorflow/tfjs-node@^4.15.0
npm install @tensorflow-models/pose-detection@^2.1.0
npm install fluent-ffmpeg@^2.1.2
npm install canvas@^2.11.2
npm install --save-dev @types/fluent-ffmpeg@^2.1.24
```

**Nota**: Se erro no Windows ao instalar canvas:
```bash
npm install --global --production windows-build-tools
npm install canvas --build-from-source
```

### 3. Verificar Instalação

```bash
# TensorFlow.js
node -e "require('@tensorflow/tfjs-node'); console.log('✅ TensorFlow OK')"

# Canvas
node -e "require('canvas'); console.log('✅ Canvas OK')"

# FFmpeg bindings
node -e "require('fluent-ffmpeg'); console.log('✅ FFmpeg OK')"
```

---

## 🎥 Preparar Vídeos de Teste

### Opção 1: Usar Vídeos de Exemplo

Crie pasta de teste:
```bash
mkdir test-videos
```

Adicione vídeos de exercícios (MP4 ou WebM):
- `agachamento-lateral.mp4` - Vista sagital de agachamento
- `deadlift-lateral.mp4` - Vista sagital de terra
- `deadlift-posterior.mp4` - Vista posterior de terra

**Requisitos mínimos dos vídeos:**
- Formato: MP4, WebM, AVI, MOV ou MKV
- Resolução mínima: 640x480
- FPS mínimo: 15
- Duração mínima: 1 segundo
- Pessoa visível de corpo inteiro

### Opção 2: Gravar Vídeos com Webcam

```bash
# Windows (usando FFmpeg)
ffmpeg -f dshow -i video="NomeWebcam" -t 10 -r 30 test-videos/teste.mp4

# macOS
ffmpeg -f avfoundation -i "0" -t 10 -r 30 test-videos/teste.mp4

# Linux
ffmpeg -f v4l2 -i /dev/video0 -t 10 -r 30 test-videos/teste.mp4
```

---

## 🧪 Testes Graduais

### Teste 1: Verificar Estrutura de Arquivos

```bash
# Verificar que todos os arquivos foram criados
ls src/adapters/mediapipe.adapter.ts
ls src/services/pose-detection.service.ts
ls src/services/video-extraction.service.ts
ls src/services/movement-scoring.service.ts
ls src/pipelines/video-processing.pipeline.ts
ls src/pipelines/realtime-processing.pipeline.ts
ls src/utils/video.helpers.ts
ls src/examples/video-analysis.example.ts
```

**Resultado esperado:** Todos os arquivos existem ✅

---

### Teste 2: Compilar TypeScript

```bash
# Compilar todos os arquivos
npx tsc --noEmit --esModuleInterop --skipLibCheck src/**/*.ts
```

**Resultado esperado:**
- Se dependências instaladas: 0 erros ✅
- Se dependências NÃO instaladas: Apenas erros de módulos não encontrados (OK)

---

### Teste 3: Testar Detector MediaPipe

Criar arquivo `test-detector.ts`:

```typescript
import { poseDetectionService } from './src/services/pose-detection.service';

async function test() {
  console.log('🤖 Inicializando detector MediaPipe...');

  try {
    await poseDetectionService.initialize();
    console.log('✅ Detector inicializado com sucesso!');

    const info = poseDetectionService.getInfo();
    console.log('ℹ️  Informações do detector:');
    console.log(`   Modelo: ${info.modelType}`);
    console.log(`   Backend: ${info.backend}`);

    console.log('\n🏃 Executando benchmark...');
    const stats = await poseDetectionService.benchmark(5);
    console.log(`✅ Benchmark concluído!`);
    console.log(`   Tempo médio: ${stats.avgTime}ms`);
    console.log(`   FPS: ${stats.fps}`);

    await poseDetectionService.dispose();
    console.log('✅ Detector descartado');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

test();
```

**Executar:**
```bash
npx ts-node test-detector.ts
```

**Resultado esperado:**
```
🤖 Inicializando detector MediaPipe...
✅ Detector inicializado com sucesso!
ℹ️  Informações do detector:
   Modelo: SINGLEPOSE_THUNDER
   Backend: tensorflow
🏃 Executando benchmark...
Progresso: 5/5
✅ Benchmark concluído!
   Tempo médio: 45.2ms
   FPS: 22.1
✅ Detector descartado
```

---

### Teste 4: Testar Extração de Vídeo

Criar arquivo `test-extraction.ts`:

```typescript
import { videoExtractionService } from './src/services/video-extraction.service';
import { getVideoInfo } from './src/utils/video.helpers';

async function test() {
  const videoPath = './test-videos/agachamento-lateral.mp4';

  console.log('📹 Testando extração de vídeo...\n');

  try {
    // Obter informações
    const info = await getVideoInfo(videoPath);
    console.log('ℹ️  Informações do vídeo:');
    console.log(`   Nome: ${info.name}`);
    console.log(`   Tamanho: ${info.size}`);
    console.log(`   Duração: ${info.duration}`);
    console.log(`   Resolução: ${info.resolution}`);
    console.log(`   FPS: ${info.fps}`);
    console.log(`   Qualidade: ${info.quality}`);

    // Extrair frames
    console.log('\n📊 Extraindo frames...');
    const frames = await videoExtractionService.extractFrames(videoPath, {
      outputDir: './temp-frames',
      fps: 15,
      maxFrames: 30,
      format: 'jpg',
      onProgress: (p) => process.stdout.write(`\r⏳ Progresso: ${p.toFixed(1)}%`)
    });

    console.log(`\n✅ ${frames.length} frames extraídos!`);

    // Cleanup
    await videoExtractionService.cleanupFrames('./temp-frames');
    console.log('✅ Cleanup concluído');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

test();
```

**Executar:**
```bash
npx ts-node test-extraction.ts
```

**Resultado esperado:**
```
📹 Testando extração de vídeo...

ℹ️  Informações do vídeo:
   Nome: agachamento-lateral.mp4
   Tamanho: 2.3MB
   Duração: 00:10
   Resolução: 1920x1080
   FPS: 30
   Qualidade: excelente

📊 Extraindo frames...
⏳ Progresso: 100.0%
✅ 30 frames extraídos!
✅ Cleanup concluído
```

---

### Teste 5: Testar Pipeline Completo (ESSENCIAL)

Criar arquivo `test-pipeline.ts`:

```typescript
import { videoProcessingPipeline } from './src/pipelines/video-processing.pipeline';
import { CaptureMode, CameraAngle } from './src/types/biomechanical-analysis.types';

async function test() {
  const videoPath = './test-videos/agachamento-lateral.mp4';

  console.log('🎬 Testando pipeline completo...\n');

  try {
    const result = await videoProcessingPipeline.process({
      videoPath,
      exerciseName: 'Agachamento Livre',
      captureMode: CaptureMode.ESSENTIAL,
      cameraAngle: CameraAngle.SAGITTAL_RIGHT,
      fps: 15,
      maxFrames: 45, // 3 segundos @ 15fps
      onProgress: (p) => process.stdout.write(`\r⏳ Progresso: ${p.toFixed(1)}%`)
    });

    console.log('\n\n✅ Processamento concluído!\n');

    console.log('📊 Metadados:');
    console.log(`   Frames processados: ${result.metadata.processedFrames}/${result.metadata.totalFrames}`);
    console.log(`   Taxa de sucesso: ${result.metadata.successRate}%`);
    console.log(`   Tempo: ${(result.metadata.processingTimeMs / 1000).toFixed(1)}s`);
    console.log(`   FPS médio: ${result.metadata.fps.toFixed(1)}`);

    console.log('\n🔬 Análise Biomecânica:');
    console.log(`   Confiabilidade: ${result.analysis.confidenceScore.toFixed(1)}% (${result.analysis.confidenceLevel})`);
    console.log(`   Risco: ${result.analysis.riskLevel}`);

    console.log('\n📈 Scores:');
    console.log(`   Motor: ${result.analysis.scores.motor.toFixed(1)}`);
    console.log(`   Stabilizer: ${result.analysis.scores.stabilizer.toFixed(1)}`);
    console.log(`   Symmetry: ${result.analysis.scores.symmetry.toFixed(1)}`);
    console.log(`   Compensation: ${result.analysis.scores.compensation.toFixed(1)}`);
    console.log(`   IGPB: ${result.analysis.scores.igpb.toFixed(1)}`);

    if (result.analysis.rotationAnalysis.detected) {
      console.log('\n🔄 Rotação Detectada:');
      console.log(`   Confiança: ${result.analysis.rotationAnalysis.confidence}`);
      console.log(`   Tipo: ${result.analysis.rotationAnalysis.type}`);
      console.log(`   Magnitude: ${result.analysis.rotationAnalysis.magnitude.toFixed(1)}°`);
    }

    console.log(`\n💪 Ações Corretivas: ${result.analysis.correctiveActions.length}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

test();
```

**Executar:**
```bash
npx ts-node test-pipeline.ts
```

**Resultado esperado:**
```
🎬 Testando pipeline completo...

⏳ Progresso: 100.0%

✅ Processamento concluído!

📊 Metadados:
   Frames processados: 42/45
   Taxa de sucesso: 93.3%
   Tempo: 15.2s
   FPS médio: 2.8

🔬 Análise Biomecânica:
   Confiabilidade: 72.5% (alta)
   Risco: MODERATE

📈 Scores:
   Motor: 78.5
   Stabilizer: 72.3
   Symmetry: 85.0
   Compensation: 18.2
   IGPB: 76.8

💪 Ações Corretivas: 2
```

---

### Teste 6: Executar Exemplos Completos

```bash
npx ts-node src/examples/video-analysis.example.ts
```

**Resultado esperado:**
- Executa 4 exemplos em sequência
- Exibe análises formatadas
- Retorna sem erros

---

## ✅ Checklist de Validação

Marque cada item após teste bem-sucedido:

- [ ] FFmpeg instalado e no PATH
- [ ] Dependências Node.js instaladas
- [ ] Compilação TypeScript sem erros (exceto módulos não encontrados)
- [ ] Detector MediaPipe inicializa corretamente
- [ ] Benchmark retorna FPS > 1
- [ ] Extração de vídeo funciona (frames criados)
- [ ] Pipeline completo processa vídeo
- [ ] Scores são calculados (todos 0-100)
- [ ] Análise biomecânica completa gerada
- [ ] Exemplos executam sem erro fatal

---

## 🐛 Troubleshooting Comum

### Problema: "FFmpeg not found"

**Solução:**
```bash
# Verificar PATH
echo %PATH%  # Windows
echo $PATH   # Linux/Mac

# Adicionar FFmpeg ao PATH (Windows)
setx PATH "%PATH%;C:\ffmpeg\bin"

# Reiniciar terminal
```

### Problema: "Cannot find module @tensorflow/tfjs-node"

**Solução:**
```bash
npm cache clean --force
npm install @tensorflow/tfjs-node@^4.15.0 --save
```

### Problema: "Canvas build failed"

**Solução Windows:**
```bash
npm install --global --production windows-build-tools
npm install canvas --build-from-source
```

### Problema: "No pose detected"

**Causas:**
- Iluminação ruim
- Pessoa muito longe/perto
- Corpo não visível completamente

**Soluções:**
- Melhorar iluminação
- Ajustar distância (2-4 metros ideal)
- Reduzir minPoseScore para 0.2

### Problema: "Processing muito lento (< 1 FPS)"

**Soluções:**
1. Reduzir FPS: `fps: 15`
2. Limitar frames: `maxFrames: 30`
3. Usar GPU: `npm install @tensorflow/tfjs-node-gpu`
4. Usar modelo mais rápido: `SINGLEPOSE_LIGHTNING`

---

## 📊 Resultados Esperados

### Performance Típica (CPU i7)

| Configuração | FPS | Tempo (30 frames) |
|--------------|-----|-------------------|
| 15fps extraction | 2-4 | 7-15s |
| 30fps extraction | 3-5 | 6-10s |
| 60fps extraction | 2-3 | 10-15s |

### Qualidade Esperada

| Métrica | Valor Esperado |
|---------|----------------|
| Taxa de sucesso | > 80% |
| Confiabilidade | 60-85% (ESSENTIAL) |
| IGPB | 50-90 (depende da execução) |
| Landmarks detectados | 12-17 por frame |

---

## 🎓 Próximos Passos

Após todos os testes passarem:

1. **Testar com vídeos reais** de agachamento, terra e supino
2. **Ajustar thresholds** se necessário
3. **Otimizar performance** (GPU, FPS reduzido)
4. **Integrar com API** existente
5. **Criar interface web** para visualização

---

## 📞 Suporte

Se algum teste falhar:

1. Verificar logs de erro detalhados
2. Consultar `VIDEO_PIPELINE_README.md` seção Troubleshooting
3. Verificar que todas as dependências estão instaladas
4. Testar com vídeo de exemplo simples primeiro

---

**Última Atualização**: 2026-02-15
**Versão**: 1.0.0
