/**
 * Protocol Entity
 *
 * Modelo de dados para protocolos gerados e armazenados no banco
 *
 * NOTA: Este arquivo define a interface TypeScript.
 * O schema Prisma correspondente deve ser adicionado em prisma/schema.prisma
 */

export interface ProtocolEntity {
  id: string;
  userId: string;
  protocolId: string; // ID gerado único
  baseProtocolId: string; // ID do protocolo base (ex: 'knee_valgus_moderate_v1')

  // Tipo e severidade do desvio
  deviationType: string;
  deviationSeverity: 'mild' | 'moderate' | 'severe';

  // Protocolo completo (JSON)
  baseProtocol: any; // JSON do protocolo base
  personalizedProtocol: any; // JSON do protocolo personalizado

  // Log de personalização
  personalizationLog: any; // JSON array de PersonalizationLog

  // Contexto científico (opcional)
  scientificRationale?: string;

  // Status do protocolo
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  currentPhase: number; // Fase atual (1-based)

  // Datas
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;

  // Progresso (opcional - para tracking)
  progressData?: any; // JSON com dados de progresso
}

/**
 * Snippet do Prisma Schema para adicionar em prisma/schema.prisma:
 *
 * model Protocol {
 *   id                    String   @id @default(cuid())
 *   userId                String
 *   protocolId            String   @unique
 *   baseProtocolId        String
 *
 *   deviationType         String
 *   deviationSeverity     String
 *
 *   baseProtocol          Json
 *   personalizedProtocol  Json
 *   personalizationLog    Json
 *   scientificRationale   String?
 *
 *   status                String   @default("active")
 *   currentPhase          Int      @default(1)
 *
 *   createdAt             DateTime @default(now())
 *   updatedAt             DateTime @updatedAt
 *   startedAt             DateTime?
 *   completedAt           DateTime?
 *
 *   progressData          Json?
 *
 *   user                  User     @relation(fields: [userId], references: [id])
 *
 *   @@index([userId])
 *   @@index([deviationType])
 *   @@index([status])
 *   @@map("protocols")
 * }
 */
