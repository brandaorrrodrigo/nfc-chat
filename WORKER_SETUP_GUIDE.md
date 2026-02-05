# 🚀 Guia Completo de Setup - Worker Híbrido

Guia passo-a-passo para configurar e iniciar o worker BullMQ de análise biomecânica.

---

## ✅ Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ PostgreSQL (Supabase) configurado
- ✅ Redis instalado
- ✅ FFmpeg instalado
- ✅ Python MediaPipe service rodando

---

## 📦 Passo 1: Instalar Dependências

```bash
cd backend

# Dependências principais
npm install @nestjs/bull bull ioredis axios

# Dependências de desenvolvimento
npm install -D @types/bull

# Dependências do Prisma
npm install @prisma/client
npm install -D prisma
```

---

## 🗄️ Passo 2: Setup do Banco de Dados

### 2.1: Aplicar Migration no Supabase

```bash
# Conectar ao Supabase
psql -h db.xxxxxxxxxxxx.supabase.co -U postgres -d postgres

# Executar migration
\i backend/prisma/migrations/001_create_analysis_tables.sql

# Verificar tabelas criadas
\dt

# Esperado:
# users, user_profiles, video_analyses, quick_analysis_results,
# deep_analysis_results, corrective_protocols, gold_standards,
# job_tracking, analysis_metrics
```

### 2.2: Gerar Cliente Prisma

```bash
cd backend
npx prisma generate
```

### 2.3: Popular Gold Standards

```bash
# Criar script de seed (backend/prisma/seed.ts)
# Ver exemplo abaixo
npx ts-node prisma/seed.ts
```

**Exemplo de seed.ts:**

```typescript
import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  const goldStandardsPath = join(process.cwd(), '..', 'reference-data', 'gold-standards');
  const files = readdirSync(goldStandardsPath).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const content = JSON.parse(readFileSync(join(goldStandardsPath, file), 'utf-8'));

    await prisma.goldStandard.upsert({
      where: { exercise_id: content.exercise_id },
      update: content,
      create: content,
    });

    console.log(`✅ Seeded gold standard: ${content.exercise_id}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 🔴 Passo 3: Setup do Redis

### 3.1: Instalar Redis (Local)

```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows
# Download: https://github.com/microsoftarchive/redis/releases
```

### 3.2: Iniciar Redis

```bash
# Iniciar
redis-server

# Verificar
redis-cli ping
# Esperado: PONG
```

### 3.3: Configurar Redis no .env

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 🎬 Passo 4: Setup do FFmpeg

### 4.1: Instalar FFmpeg

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download: https://ffmpeg.org/download.html
```

### 4.2: Verificar Instalação

```bash
ffmpeg -version
# Esperado: ffmpeg version 4.x ou superior
```

---

## 🐍 Passo 5: Setup do MediaPipe Service (Python)

### 5.1: Criar Python Service

```bash
mkdir -p python-service
cd python-service

# requirements.txt
cat > requirements.txt <<EOF
flask==2.3.0
mediapipe==0.10.9
opencv-python==4.8.1
numpy==1.24.3
EOF

pip install -r requirements.txt
```

### 5.2: Criar API Flask

```python
# app.py
from flask import Flask, request, jsonify
import mediapipe as mp
import cv2
import numpy as np

app = Flask(__name__)
mp_pose = mp.solutions.pose

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/analyze-frames', methods=['POST'])
def analyze_frames():
    data = request.json
    frames = data['frames']

    results = []
    with mp_pose.Pose() as pose:
        for frame_data in frames:
            # Carregar imagem
            image = cv2.imread(frame_data['path'])
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Processar
            result = pose.process(image_rgb)

            if result.pose_landmarks:
                # Extrair landmarks
                landmarks = []
                for landmark in result.pose_landmarks.landmark:
                    landmarks.append({
                        'x': landmark.x,
                        'y': landmark.y,
                        'z': landmark.z,
                        'visibility': landmark.visibility
                    })

                # Calcular ângulos (implementar função)
                angles = calculate_angles(landmarks)

                results.append({
                    'frame_number': len(results) + 1,
                    'timestamp_ms': frame_data['timestamp_ms'],
                    'angles': angles,
                    'landmarks_3d': landmarks
                })

    return jsonify({
        'frames': results,
        'duration_ms': frames[-1]['timestamp_ms'] if frames else 0
    })

def calculate_angles(landmarks):
    # TODO: Implementar cálculo de ângulos
    return {
        'knee_left': 90,
        'knee_right': 90,
        'hip': 85,
        'trunk': 45,
        'ankle_left': 70,
        'ankle_right': 70
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### 5.3: Iniciar Service

```bash
python app.py

# Verificar
curl http://localhost:5000/health
# Esperado: {"status":"ok"}
```

### 5.4: Configurar no .env

```env
MEDIAPIPE_SERVICE_URL=http://localhost:5000
```

---

## ⚙️ Passo 6: Configurar Variáveis de Ambiente

Criar arquivo `.env` no backend:

```env
# Database
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MediaPipe
MEDIAPIPE_SERVICE_URL=http://localhost:5000

# Email (opcional)
EMAIL_NOTIFICATIONS=false

# Push (opcional)
PUSH_NOTIFICATIONS=false

# OpenAI (para Deep Analysis - futuro)
OPENAI_API_KEY=sk-...

# Environment
NODE_ENV=development
```

---

## 🔧 Passo 7: Configurar App Module

Editar `backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { WorkersModule } from './workers/workers.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    WorkersModule,
    PrismaModule,
  ],
})
export class AppModule {}
```

---

## 🚀 Passo 8: Iniciar Aplicação

### 8.1: Iniciar Backend

```bash
cd backend
npm run start:dev

# Logs esperados:
# [Nest] WorkersModule dependencies initialized
# [Nest] Redis connected successfully
# [Nest] BullBoard available at http://localhost:3000/admin/queues
```

### 8.2: Verificar Worker Ativo

```bash
# Verificar fila registrada
redis-cli KEYS "*bull:hybrid-video-analysis*"

# Ver workers ativos
redis-cli SMEMBERS bull:hybrid-video-analysis:workers
```

---

## 🧪 Passo 9: Testar Pipeline

### 9.1: Criar Endpoint de Teste

```typescript
// video.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('video')
export class VideoController {
  constructor(
    @InjectQueue('hybrid-video-analysis')
    private videoQueue: Queue,
  ) {}

  @Post('analyze')
  async analyze(@Body() body: any) {
    const job = await this.videoQueue.add('analyze-video-hybrid', {
      videoPath: body.videoPath,
      userId: body.userId,
      exerciseId: body.exerciseId,
    });

    return {
      jobId: job.id,
      message: 'Analysis started',
    };
  }

  @Get('status/:jobId')
  async getStatus(@Param('jobId') jobId: string) {
    const job = await this.videoQueue.getJob(jobId);

    return {
      id: job.id,
      progress: await job.progress(),
      state: await job.getState(),
    };
  }
}
```

### 9.2: Testar com cURL

```bash
# Adicionar job
curl -X POST http://localhost:3000/video/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "userId": "user_123",
    "exerciseId": "back-squat"
  }'

# Response: {"jobId": "123", "message": "Analysis started"}

# Verificar status
curl http://localhost:3000/video/status/123

# Response: {"id": "123", "progress": 50, "state": "active"}
```

---

## 📊 Passo 10: Monitoramento (Opcional)

### 10.1: Instalar Bull Board (UI)

```bash
npm install @bull-board/express @bull-board/api
```

### 10.2: Configurar Dashboard

```typescript
// main.ts
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(videoQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

### 10.3: Acessar Dashboard

```bash
# Abrir no navegador
http://localhost:3000/admin/queues

# Ver:
# - Jobs ativos
# - Jobs completados
# - Jobs falhados
# - Métricas em tempo real
```

---

## ✅ Checklist de Validação

Verificar que tudo está funcionando:

- [ ] ✅ Redis: `redis-cli ping` → PONG
- [ ] ✅ PostgreSQL: Tabelas criadas (10)
- [ ] ✅ FFmpeg: `ffmpeg -version` → OK
- [ ] ✅ MediaPipe: `curl localhost:5000/health` → OK
- [ ] ✅ Backend: Iniciado sem erros
- [ ] ✅ Worker: Registrado no Redis
- [ ] ✅ Job test: POST /video/analyze → jobId retornado
- [ ] ✅ Job processing: Status muda para "active" → "completed"
- [ ] ✅ Database: Registro criado em `video_analyses`

---

## 🐛 Troubleshooting Comum

### Erro: "Redis connection refused"

```bash
# Verificar se Redis está rodando
sudo systemctl status redis

# Iniciar Redis
sudo systemctl start redis
```

### Erro: "MediaPipe service unavailable"

```bash
# Verificar Python service
curl http://localhost:5000/health

# Se falhar, iniciar:
cd python-service
python app.py
```

### Erro: "FFmpeg not found"

```bash
# Adicionar FFmpeg ao PATH
export PATH=$PATH:/path/to/ffmpeg/bin

# Ou instalar globalmente
sudo apt-get install ffmpeg
```

### Job fica "stalled"

```bash
# Limpar jobs travados
redis-cli DEL bull:hybrid-video-analysis:stalled

# Reiniciar worker
npm run start:dev
```

---

## 📚 Próximos Passos

1. ✅ **Você está aqui:** Sistema configurado e funcionando
2. 🔄 Implementar Deep Analysis Service (RAG + LLM)
3. 📱 Criar endpoints REST completos
4. 🔐 Adicionar autenticação/autorização
5. 🚀 Deploy em produção

---

## 🎉 Sucesso!

Se todos os checks passaram, seu worker está **pronto para produção** 🚀

Para testar end-to-end:
```bash
npm test -- workers.integration.spec
```

**Tempo total de setup:** ~30-45 minutos
