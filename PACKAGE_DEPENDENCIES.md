# Dependências para Pipeline de Vídeo

Adicione as seguintes dependências ao `package.json`:

## Dependencies

```json
{
  "dependencies": {
    "@tensorflow/tfjs-node": "^4.15.0",
    "@tensorflow-models/pose-detection": "^2.1.0",
    "fluent-ffmpeg": "^2.1.2",
    "canvas": "^2.11.2"
  }
}
```

## DevDependencies

```json
{
  "devDependencies": {
    "@types/fluent-ffmpeg": "^2.1.24"
  }
}
```

## Instalação Completa

```bash
npm install @tensorflow/tfjs-node@^4.15.0 @tensorflow-models/pose-detection@^2.1.0 fluent-ffmpeg@^2.1.2 canvas@^2.11.2
npm install --save-dev @types/fluent-ffmpeg@^2.1.24
```

## GPU (Opcional - Requer CUDA)

Se você tem GPU NVIDIA com CUDA instalado:

```bash
npm install @tensorflow/tfjs-node-gpu@^4.15.0
```

**Nota:** Para usar GPU, substitua o import em `pose-detection.service.ts`:
```typescript
// De:
import '@tensorflow/tfjs-node';

// Para:
import '@tensorflow/tfjs-node-gpu';
```

## Verificação

Após instalação, verifique:

```bash
# TensorFlow.js
node -e "require('@tensorflow/tfjs-node'); console.log('✅ TensorFlow.js OK')"

# Canvas
node -e "require('canvas'); console.log('✅ Canvas OK')"

# FFmpeg
node -e "require('fluent-ffmpeg'); console.log('✅ FFmpeg bindings OK')"
ffmpeg -version
```

## Requisitos de Sistema

### FFmpeg

**Windows:**
```bash
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### Build Tools (Windows)

```bash
npm install --global --production windows-build-tools
```

### Python (para compilar canvas)

- Python 2.7 ou 3.x
- Instalado e no PATH

## Troubleshooting

### Erro: "node-gyp rebuild failed"

**Solução:**
```bash
# Windows
npm install --global windows-build-tools

# Reinstalar canvas
npm install canvas --build-from-source
```

### Erro: "Cannot find module @tensorflow/tfjs-node"

**Solução:**
```bash
npm cache clean --force
npm install @tensorflow/tfjs-node --save
```

### Erro: "ffmpeg: command not found"

**Solução:**
- Instalar FFmpeg (veja acima)
- Adicionar ao PATH
- Reiniciar terminal

## Tamanho das Dependências

| Pacote | Tamanho | Descrição |
|--------|---------|-----------|
| @tensorflow/tfjs-node | ~80MB | TensorFlow para Node.js |
| @tensorflow-models/pose-detection | ~2MB | Modelos de detecção de pose |
| fluent-ffmpeg | ~1MB | Wrapper FFmpeg para Node.js |
| canvas | ~5MB | Canvas para Node.js |
| **Total** | **~88MB** | |

**Nota:** O modelo MediaPipe (~14MB) será baixado automaticamente na primeira execução.

## Scripts Package.json

Adicione esses scripts úteis:

```json
{
  "scripts": {
    "analyze:video": "ts-node src/examples/video-analysis.example.ts",
    "test:detector": "ts-node -e \"import('./src/services/pose-detection.service').then(s => s.poseDetectionService.initialize().then(() => console.log('✅ Detector OK')))\"",
    "benchmark": "ts-node -e \"import('./src/services/pose-detection.service').then(async s => { await s.poseDetectionService.initialize(); const stats = await s.poseDetectionService.benchmark(); console.log(stats); })\""
  }
}
```

Uso:
```bash
npm run analyze:video        # Executar exemplos
npm run test:detector        # Testar detector
npm run benchmark            # Benchmark de performance
```
