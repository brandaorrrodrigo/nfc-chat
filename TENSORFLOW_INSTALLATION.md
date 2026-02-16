# ⚠️ Instalação do TensorFlow.js Node - Problema e Soluções

## 📋 Situação Atual

### ✅ Dependências Instaladas com Sucesso:
- ✅ `fluent-ffmpeg` - Wrapper FFmpeg
- ✅ `canvas` - Canvas para Node.js
- ✅ `@tensorflow-models/pose-detection` - Modelos de detecção de pose
- ✅ `@types/fluent-ffmpeg` - Tipos TypeScript

### ❌ Problema: `@tensorflow/tfjs-node`

O `@tensorflow/tfjs-node` **requer compilação de bindings nativos** no Windows, que necessita de:
- Visual Studio Build Tools 2017 ou superior
- Windows SDK
- Python

**Erro atual:**
```
gyp ERR! find VS Could not find any Visual Studio installation to use
```

---

## 🔧 Soluções Disponíveis

### Solução 1: Instalar Visual Studio Build Tools (Recomendado)

**Passo 1: Baixar Visual Studio Build Tools**
1. Acesse: https://visualstudio.microsoft.com/downloads/
2. Baixe "Build Tools for Visual Studio 2022"
3. Execute o instalador

**Passo 2: Instalar Workload C++**
- Marque: "Desktop development with C++"
- Incluir: Windows 10/11 SDK
- Instalar (requer ~7GB de espaço)

**Passo 3: Reinstalar TensorFlow**
```bash
npm install @tensorflow/tfjs-node@^4.15.0
```

---

### Solução 2: Usar TensorFlow.js Web (Alternativa Funcional)

Em vez de `@tensorflow/tfjs-node`, usar `@tensorflow/tfjs`:

```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-cpu
```

**Modificações necessárias:**

No arquivo `src/services/pose-detection.service.ts`:

```typescript
// DE:
import '@tensorflow/tfjs-node';
import * as tf from '@tensorflow/tfjs-node';

// PARA:
import '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';

// Configurar backend CPU
await tf.setBackend('cpu');
await tf.ready();
```

**Prós:**
- ✅ Instalação sem compilação
- ✅ Funciona imediatamente
- ✅ Mesmo API do TensorFlow

**Contras:**
- ⚠️ Performance ~30% mais lenta que tfjs-node
- ⚠️ Maior uso de memória

---

### Solução 3: Usar Binários Pré-compilados (Experimental)

Baixar binários pré-compilados manualmente:

```bash
# Criar diretório
mkdir -p node_modules/@tensorflow/tfjs-node/lib/napi-v8

# Baixar binário (Node.js 20, Windows x64)
# https://storage.googleapis.com/tf-builds/pre-built-binary/
```

**Nota:** Solução complexa e não recomendada.

---

### Solução 4: Usar Docker (Linux Container)

Executar em container Linux onde tfjs-node instala sem problemas:

**Dockerfile:**
```dockerfile
FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    make \
    g++

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "analyze:video"]
```

**Build e Run:**
```bash
docker build -t nfc-video .
docker run -v ./test-videos:/app/test-videos nfc-video
```

---

## 🎯 Recomendação Atual

Para **desenvolvimento e testes rápidos**, usar **Solução 2** (TensorFlow.js Web):

### Passos:

1. **Instalar TensorFlow.js Web:**
```bash
npm install @tensorflow/tfjs@^4.15.0 @tensorflow/tfjs-backend-cpu@^4.15.0
```

2. **Modificar `pose-detection.service.ts`:**

```typescript
// Linha 9: trocar import
import '@tensorflow/tfjs'; // em vez de '@tensorflow/tfjs-node'
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';

// Adicionar no método initialize(), antes de criar detector:
await tf.setBackend('cpu');
await tf.ready();
console.log('✅ TensorFlow.js backend:', tf.getBackend());
```

3. **Testar:**
```bash
npx ts-node test-detector.ts
```

### Performance Esperada:

| Backend | FPS | Tempo/Frame |
|---------|-----|-------------|
| tfjs-node (nativo) | 15-25 | ~40-65ms |
| tfjs (web/CPU) | 10-18 | ~55-100ms |
| tfjs-node-gpu | 30-60 | ~15-35ms |

**Para produção**, instalar Visual Studio Build Tools e usar `@tensorflow/tfjs-node`.

---

## 🧪 Teste de Instalação

Após escolher uma solução, testar:

```bash
# Criar arquivo test-tf.js
node -e "
const tf = require('@tensorflow/tfjs');
(async () => {
  await tf.setBackend('cpu');
  await tf.ready();
  console.log('✅ TensorFlow.js:', tf.version.tfjs);
  console.log('✅ Backend:', tf.getBackend());

  const tensor = tf.zeros([10, 10]);
  console.log('✅ Tensor criado:', tensor.shape);
  tensor.dispose();
})();
"
```

**Saída esperada:**
```
✅ TensorFlow.js: 4.15.0
✅ Backend: cpu
✅ Tensor criado: 10,10
```

---

## 📊 Status Atual das Dependências

```json
{
  "instaladas": {
    "@tensorflow-models/pose-detection": "^2.1.0",
    "fluent-ffmpeg": "^2.1.2",
    "canvas": "^2.11.2",
    "@types/fluent-ffmpeg": "^2.1.24"
  },
  "pendentes": {
    "@tensorflow/tfjs-node": "Requer Visual Studio Build Tools",
    "alternativas": [
      "@tensorflow/tfjs + @tensorflow/tfjs-backend-cpu (funcional)",
      "@tensorflow/tfjs-node (após instalar VS Build Tools)"
    ]
  }
}
```

---

## 🚀 Ação Recomendada

**Para continuar agora:**

```bash
# Instalar versão web do TensorFlow
npm install @tensorflow/tfjs@^4.15.0 @tensorflow/tfjs-backend-cpu@^4.15.0

# Editar src/services/pose-detection.service.ts
# (trocar imports conforme Solução 2 acima)

# Testar
npx ts-node test-detector.ts
```

**Para melhor performance (depois):**
1. Instalar Visual Studio Build Tools 2022
2. Reinstalar `@tensorflow/tfjs-node`
3. Reverter mudanças no código

---

## 📞 Suporte

- **Documentação oficial**: https://www.tensorflow.org/js/guide/nodejs
- **GitHub Issues**: https://github.com/tensorflow/tfjs/issues
- **Visual Studio Downloads**: https://visualstudio.microsoft.com/downloads/

---

**Última Atualização**: 2026-02-15
