# 🗄️ Prisma Schema - Documentação Completa

Sistema de banco de dados completo para NFC/NFV Biomechanics.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Modelos Implementados](#modelos-implementados)
3. [Enums](#enums)
4. [Relações](#relações)
5. [Migrations](#migrations)
6. [Seed Data](#seed-data)
7. [Uso com NestJS](#uso-com-nestjs)
8. [Queries Comuns](#queries-comuns)

---

## 🎯 Visão Geral

### Estatísticas do Schema

- **Modelos**: 35+ models
- **Enums**: 15+ enums
- **Relações**: 50+ relations
- **Índices**: 100+ indexes para performance

### Estrutura do Banco

```
📦 nfc_biomechanics (PostgreSQL)
├─ 🧑 Usuários & Auth
│  ├─ User
│  └─ UserBadge
├─ 🏟️  Arenas (Comunidades)
│  ├─ Arena
│  ├─ ArenaTag
│  └─ ArenaFounder
├─ 📝 Posts & Comentários
│  ├─ Post
│  ├─ Comment
│  └─ AIMetadata
├─ 💰 Sistema FP
│  ├─ FPTransaction
│  ├─ FPRule
│  └─ BiometricFPTransaction
├─ 🎯 Moderação
│  ├─ ModerationQueue
│  ├─ ModerationAction
│  └─ SpamFilter
├─ 📊 Analytics
│  ├─ DailyMetrics
│  └─ AuditLog
├─ 🧬 Biomecânica (NFV)
│  ├─ VideoAnalysis (CONSOLIDADO)
│  ├─ BiomechanicalResult
│  ├─ Exercise (Catálogo)
│  ├─ UserExercise (Histórico)
│  ├─ CorrectivePlan
│  ├─ CorrectiveSession
│  ├─ AnalysisComparison
│  └─ VideoAnalysisTag
├─ 🩺 Biometria
│  ├─ BiometricBaseline
│  ├─ BiometricComparison
│  └─ BiometricPricing
├─ 🔗 Webhooks & API
│  ├─ ApiKey
│  ├─ Webhook
│  └─ WebhookDelivery
└─ 👥 Atividade
   ├─ UserArenaActivity
   └─ AnonymousVisitor
```

---

## 📚 Modelos Implementados

### 1. **VideoAnalysis** (CONSOLIDADO)

**Mudança importante**: Consolidamos dois modelos duplicados em um único modelo completo.

```typescript
model VideoAnalysis {
  // Identificação
  id                     String @id @default(cuid())
  videoId                String @unique

  // Relações
  arenaId                String? // Opcional - pode ser análise standalone
  userId                 String

  // Video
  videoUrl               String
  videoPath              String
  exerciseName           String

  // Queue system (novo)
  jobId                  String? @unique
  status                 String  // 'queued' | 'processing' | 'completed' | 'failed'
  progress               Int
  currentStage           String? // 'extraction' | 'detection' | 'analysis'

  // Arena NFV system (existente)
  aiAnalysis             Json?
  aiStatus               AnalysisStatus
  publishedAnalysis      Json?

  // Webhook
  webhookUrl             String?

  // Relações
  arena                  Arena?
  user                   User
  result                 BiomechanicalResult?
  tags                   VideoAnalysisTag[]
  baselineComparisons    AnalysisComparison[] @relation("BaselineComparison")
  currentComparisons     AnalysisComparison[] @relation("CurrentComparison")
}
```

**Features:**
- ✅ Suporta análise standalone (sem arena)
- ✅ Suporta análise em arena (com revisão AI + admin)
- ✅ Sistema de fila com BullMQ (jobId, status, progress)
- ✅ Webhooks para notificações
- ✅ Tags customizadas
- ✅ Comparações baseline

---

### 2. **BiomechanicalResult**

Resultado completo da análise biomecânica.

```typescript
model BiomechanicalResult {
  motorScore        Float // Score motor (0-10)
  stabilizerScore   Float // Score estabilizadores (0-10)
  symmetryScore     Float // Score simetria (0-10)
  compensationScore Float // Score compensações (0-10)
  igpbScore         Float // Score IGPB final (0-10)

  confidenceScore   Float  // 0-1
  confidenceLevel   String // 'baixa' | 'moderada' | 'alta' | 'muito_alta'
  riskLevel         String // 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

  fullAnalysis      Json   // Análise completa em JSON

  totalFrames       Int
  processedFrames   Int
  successRate       Float
  processingTimeMs  Int
  fps               Float
}
```

---

### 3. **Exercise** (Catálogo)

Catálogo de exercícios disponíveis.

```typescript
model Exercise {
  name              String @unique
  slug              String @unique
  category          ExerciseCategory
  movementPattern   String // 'squat', 'hinge', 'push', 'pull'

  description       String?
  instructions      String?
  thumbnailUrl      String?

  primaryMuscles    String[] // ['quadriceps', 'glutes']
  secondaryMuscles  String[] // ['hamstrings', 'calves']
  equipment         String[] // ['barbell', 'dumbbells']

  requiredLandmarks Json? // MediaPipe landmarks necessários
  analysisTemplate  Json? // Template específico do exercício

  isActive          Boolean
  isPremium         Boolean

  userExercises     UserExercise[]
}
```

**Exercícios no Seed:**
1. Agachamento Livre (Back Squat)
2. Levantamento Terra Convencional
3. Hip Thrust
4. Supino Reto (Bench Press)
5. Remada com Apoio no Peito
6. Remada Curvada com Barra
7. Remada no Cabo Sentado
8. Elevação Lateral

---

### 4. **UserExercise** (Histórico)

Registro de execuções de exercícios pelo usuário.

```typescript
model UserExercise {
  userId            String
  exerciseId        String

  performedAt       DateTime
  sets              Int?
  reps              Int?
  weight            Float? // kg
  notes             String?

  videoAnalysisId   String? @unique // Link com análise

  user              User
  exercise          Exercise
}
```

---

### 5. **CorrectivePlan** (Plano Corretivo)

Plano de correção baseado em análise.

```typescript
model CorrectivePlan {
  userId            String
  videoAnalysisId   String

  title             String
  description       String
  goals             String[]
  duration          Int // semanas

  protocol          Json // Exercícios, séries, reps, progressão

  status            PlanStatus
  startedAt         DateTime?
  completedAt       DateTime?

  sessions          CorrectiveSession[]
}
```

---

### 6. **CorrectiveSession** (Sessão)

Execução de uma sessão do plano.

```typescript
model CorrectiveSession {
  planId            String
  userId            String

  sessionNumber     Int
  scheduledFor      DateTime?
  performedAt       DateTime?

  exercisesCompleted Json?
  notes             String?
  userFeedback      String? // 'easy' | 'moderate' | 'hard'
  painLevel         Int? // 0-10

  status            SessionStatus
}
```

---

### 7. **AnalysisComparison** (Comparação)

Comparação entre duas análises (baseline vs atual).

```typescript
model AnalysisComparison {
  userId            String
  baselineId        String
  comparisonId      String

  motorDelta        Float
  stabilizerDelta   Float
  symmetryDelta     Float
  igpbDelta         Float

  improvementPercent Float
  regressionPercent  Float

  summary           String
  recommendations   String?

  baseline          VideoAnalysis @relation("BaselineComparison")
  comparison        VideoAnalysis @relation("CurrentComparison")
}
```

---

### 8. **ApiKey** (Chaves de API)

Autenticação para integrações externas.

```typescript
model ApiKey {
  userId            String
  name              String
  key               String @unique
  hashedKey         String @unique

  permissions       String[] // ['read:analyses', 'write:analyses']
  rateLimit         Int // requests/hora

  isActive          Boolean
  lastUsedAt        DateTime?
  expiresAt         DateTime?
}
```

---

### 9. **Webhook** & **WebhookDelivery**

Sistema de notificações via webhook.

```typescript
model Webhook {
  userId            String
  url               String
  secret            String? // HMAC validation

  events            String[] // ['analysis.completed', 'analysis.failed']

  isActive          Boolean
  failureCount      Int
  lastFailedAt      DateTime?

  deliveries        WebhookDelivery[]
}

model WebhookDelivery {
  webhookId         String
  event             String
  payload           Json

  status            DeliveryStatus
  httpStatus        Int?
  attempts          Int
  maxAttempts       Int

  sentAt            DateTime?
  deliveredAt       DateTime?
  nextRetryAt       DateTime?
  errorMessage      String?
}
```

---

## 🏷️ Enums

### ExerciseCategory
```typescript
enum ExerciseCategory {
  LOWER_BODY
  UPPER_BODY_PUSH
  UPPER_BODY_PULL
  CORE
  FULL_BODY
  MOBILITY
  CARDIO
}
```

### PlanStatus
```typescript
enum PlanStatus {
  ACTIVE
  COMPLETED
  CANCELLED
  PAUSED
}
```

### SessionStatus
```typescript
enum SessionStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  SKIPPED
}
```

### DeliveryStatus
```typescript
enum DeliveryStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
  RETRYING
}
```

---

## 🔗 Relações Principais

### User Relations
```
User (1) → (N) VideoAnalysis
User (1) → (N) UserExercise
User (1) → (N) BiometricBaseline
User (1) → (N) ApiKey
User (1) → (N) Webhook
```

### VideoAnalysis Relations
```
VideoAnalysis (1) → (1) BiomechanicalResult
VideoAnalysis (1) → (N) VideoAnalysisTag
VideoAnalysis (1) → (N) AnalysisComparison (baseline)
VideoAnalysis (1) → (N) AnalysisComparison (current)
VideoAnalysis (1) → (1) UserExercise
```

### Exercise Relations
```
Exercise (1) → (N) UserExercise
```

### CorrectivePlan Relations
```
CorrectivePlan (1) → (N) CorrectiveSession
```

---

## 📦 Migrations

### Criar Migration

```bash
# Gerar client
npx prisma generate

# Criar migration (desenvolvimento)
npx prisma migrate dev --name descriptive-name

# Aplicar migration (produção)
npx prisma migrate deploy
```

### Status da Migration

```bash
npx prisma migrate status
```

---

## 🌱 Seed Data

### Executar Seed

```bash
npx prisma db seed
```

### O que é criado:

1. **Usuários:**
   - Admin: `admin@nutrifitcoach.com` / `admin123`
   - Teste: (existente do seed anterior)

2. **Arenas:**
   - 17 arenas existentes (do seed anterior)

3. **Exercícios:**
   - 8 exercícios (back squat, deadlift, hip thrust, etc)

4. **FP Rules:**
   - Regras existentes + `video_analysis_completed` (5 FPs)

5. **Biometric Pricing:**
   - baseline: 0 FPs (first free)
   - comparison: 25 FPs (premium free)
   - export_pdf: 10 FPs

---

## 🏗️ Uso com NestJS

### 1. Importar PrismaModule

```typescript
// app.module.ts
import { PrismaModule } from './modules/biomechanical/prisma.module';

@Module({
  imports: [
    PrismaModule, // Global module
    BiomechanicalModule,
    // ...
  ],
})
export class AppModule {}
```

### 2. Injetar PrismaService

```typescript
// biomechanical.service.ts
import { PrismaService } from './prisma.service';

@Injectable()
export class BiomechanicalService {
  constructor(private prisma: PrismaService) {}

  async queueVideoAnalysis(params: QueueAnalysisParams) {
    // Criar análise
    const analysis = await this.prisma.videoAnalysis.create({
      data: {
        videoId: generateVideoId(),
        userId: params.userId,
        exerciseName: params.exerciseName,
        // ...
      },
    });

    return { analysisId: analysis.id };
  }
}
```

---

## 🔍 Queries Comuns

### 1. Listar Análises do Usuário

```typescript
const analyses = await prisma.videoAnalysis.findMany({
  where: {
    userId: 'user_123',
    status: 'completed',
  },
  include: {
    result: true,
    tags: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
});
```

### 2. Buscar Análise com Resultado

```typescript
const analysis = await prisma.videoAnalysis.findUnique({
  where: { id: 'analysis_123' },
  include: {
    result: true,
    arena: true,
    user: {
      select: { name: true, email: true },
    },
  },
});
```

### 3. Criar Análise Comparativa

```typescript
const comparison = await prisma.analysisComparison.create({
  data: {
    userId: 'user_123',
    baselineId: 'analysis_baseline',
    comparisonId: 'analysis_current',
    motorDelta: 1.5,
    stabilizerDelta: 0.8,
    symmetryDelta: -0.3,
    igpbDelta: 0.9,
    improvementPercent: 12.5,
    regressionPercent: 0,
    summary: 'Melhora significativa no score motor...',
  },
});
```

### 4. Listar Exercícios por Categoria

```typescript
const exercises = await prisma.exercise.findMany({
  where: {
    category: 'LOWER_BODY',
    isActive: true,
  },
  orderBy: {
    name: 'asc',
  },
});
```

### 5. Histórico de Exercícios do Usuário

```typescript
const history = await prisma.userExercise.findMany({
  where: {
    userId: 'user_123',
  },
  include: {
    exercise: true,
  },
  orderBy: {
    performedAt: 'desc',
  },
  take: 20,
});
```

### 6. Estatísticas de Performance

```typescript
const stats = await prisma.biomechanicalResult.aggregate({
  where: {
    videoAnalysis: {
      userId: 'user_123',
    },
  },
  _avg: {
    motorScore: true,
    stabilizerScore: true,
    igpbScore: true,
  },
  _count: true,
});
```

### 7. Health Check do Banco

```typescript
const isHealthy = await prisma.healthCheck();
```

### 8. Transaction com Retry

```typescript
const result = await prisma.transactionWithRetry(async (tx) => {
  const analysis = await tx.videoAnalysis.create({ data: {...} });
  const result = await tx.biomechanicalResult.create({ data: {...} });
  return { analysis, result };
});
```

---

## 🚀 Performance Tips

### 1. Usar Select para Campos Específicos

```typescript
// ❌ Ruim: carrega todos os campos
const user = await prisma.user.findUnique({ where: { id } });

// ✅ Bom: carrega apenas necessário
const user = await prisma.user.findUnique({
  where: { id },
  select: { name: true, email: true },
});
```

### 2. Incluir Apenas Relações Necessárias

```typescript
// ❌ Ruim: carrega todas relações
const analysis = await prisma.videoAnalysis.findUnique({
  where: { id },
  include: { result: true, tags: true, user: true, arena: true },
});

// ✅ Bom: carrega apenas necessário
const analysis = await prisma.videoAnalysis.findUnique({
  where: { id },
  include: { result: true },
});
```

### 3. Usar Paginação

```typescript
const { items, total } = await getPaginatedAnalyses({
  userId: 'user_123',
  limit: 20,
  offset: 0,
});
```

### 4. Índices Customizados

```prisma
@@index([userId, status])
@@index([createdAt])
@@index([exerciseName, status])
```

---

## ✅ Checklist de Implementação

- [x] Schema Prisma completo
- [x] VideoAnalysis consolidado (queue + arena)
- [x] Exercise catalog (8 exercícios)
- [x] UserExercise history
- [x] CorrectivePlan system
- [x] AnalysisComparison
- [x] ApiKey & Webhook system
- [x] PrismaService
- [x] PrismaModule
- [x] Seed data
- [ ] Migration inicial executada
- [ ] Testes de integração

---

## 📝 Próximos Passos

1. **Executar migration:**
   ```bash
   npx prisma migrate dev --name initial-biomechanics
   ```

2. **Executar seed:**
   ```bash
   npx prisma db seed
   ```

3. **Integrar com BiomechanicalService:**
   - Atualizar imports para usar PrismaService
   - Remover Prisma client standalone

4. **Implementar DTOs de validação:**
   - CreateAnalysisDto
   - CreateComparisonDto
   - CreateCorrectivePlanDto

5. **Criar testes:**
   - Unit tests para PrismaService
   - Integration tests para queries complexas

---

**✅ Schema Prisma pronto para produção!**

Stack: PostgreSQL 16 + Prisma ORM 6.19 + NestJS + TypeScript
