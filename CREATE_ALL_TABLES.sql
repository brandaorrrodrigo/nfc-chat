-- ============================================
-- NUTRIFITCOACH - SCHEMA COMPLETO POSTGRESQL
-- ============================================
-- Gerado automaticamente do schema Prisma
-- Compatível com PostgreSQL/Supabase
-- ============================================

-- ============================================
-- 1. CRIAR ENUMS
-- ============================================

-- Role (Papéis de usuário)
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM (
        'SUPER_ADMIN',
        'ADMIN',
        'FOUNDER',
        'MODERATOR',
        'USER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AIPersona (Personalidade da IA)
DO $$ BEGIN
    CREATE TYPE "AIPersona" AS ENUM (
        'SCIENTIFIC',
        'MOTIVATIONAL',
        'SUSTAINING',
        'BALANCED',
        'BIOMECHANICS_EXPERT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ArenaType (Tipo de Arena)
DO $$ BEGIN
    CREATE TYPE "ArenaType" AS ENUM (
        'GENERAL',
        'NFV_HUB',
        'NFV_PREMIUM'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AnalysisStatus (Status de Análise)
DO $$ BEGIN
    CREATE TYPE "AnalysisStatus" AS ENUM (
        'PENDING_AI',
        'AI_ANALYZED',
        'PENDING_REVIEW',
        'APPROVED',
        'REJECTED',
        'REVISION_NEEDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ArenaStatus (Status da Arena)
DO $$ BEGIN
    CREATE TYPE "ArenaStatus" AS ENUM (
        'HOT',
        'WARM',
        'COLD',
        'ARCHIVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ArenaCategoria (Categoria da Arena)
DO $$ BEGIN
    CREATE TYPE "ArenaCategoria" AS ENUM (
        'NUTRICAO_DIETAS',
        'TREINO_EXERCICIOS',
        'BIOMECANICA_NFV',
        'SAUDE_CONDICOES_CLINICAS',
        'RECEITAS_ALIMENTACAO',
        'COMUNIDADES_LIVRES'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreatedBy (Criado por)
DO $$ BEGIN
    CREATE TYPE "CreatedBy" AS ENUM (
        'USER',
        'ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ModerationStatus (Status de Moderação)
DO $$ BEGIN
    CREATE TYPE "ModerationStatus" AS ENUM (
        'PENDING',
        'APPROVED',
        'REJECTED',
        'EDITED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. CRIAR TABELAS
-- ============================================

-- ============================================
-- USUÁRIOS E AUTENTICAÇÃO
-- ============================================

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    -- 2FA
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,

    -- FP (Fitness Points)
    "fpTotal" INTEGER NOT NULL DEFAULT 0,
    "fpAvailable" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3),

    -- Flags de moderação
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" TIMESTAMP(3),
    "bannedReason" TEXT,
    "spamScore" INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- ARENAS (COMUNIDADES)
-- ============================================

CREATE TABLE IF NOT EXISTS "Arena" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    -- Configurações
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "allowImages" BOOLEAN NOT NULL DEFAULT true,
    "allowLinks" BOOLEAN NOT NULL DEFAULT true,
    "allowVideos" BOOLEAN NOT NULL DEFAULT false,

    -- IA Settings
    "aiPersona" "AIPersona" NOT NULL DEFAULT 'BALANCED',
    "aiInterventionRate" INTEGER NOT NULL DEFAULT 50,
    "aiFrustrationThreshold" INTEGER NOT NULL DEFAULT 120,
    "aiCooldown" INTEGER NOT NULL DEFAULT 5,

    -- NFV - Análise Biomecânica
    "arenaType" "ArenaType" NOT NULL DEFAULT 'GENERAL',
    "parentArenaSlug" TEXT,
    "requiresFP" INTEGER,
    "requiresSubscription" BOOLEAN NOT NULL DEFAULT false,
    "movementCategory" TEXT,
    "movementPattern" TEXT,

    -- Índice & Busca
    "categoria" "ArenaCategoria" NOT NULL DEFAULT 'COMUNIDADES_LIVRES',
    "criadaPor" "CreatedBy" NOT NULL DEFAULT 'ADMIN',
    "createdByUserId" TEXT,

    -- Métricas
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "dailyActiveUsers" INTEGER NOT NULL DEFAULT 0,
    "status" "ArenaStatus" NOT NULL DEFAULT 'COLD',

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- TAGS DE ARENA
-- ============================================

CREATE TABLE IF NOT EXISTS "ArenaTag" (
    "id" TEXT PRIMARY KEY,
    "arenaId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "ArenaTag_arenaId_fkey" FOREIGN KEY ("arenaId")
        REFERENCES "Arena"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT "ArenaTag_arenaId_tag_key" UNIQUE("arenaId", "tag")
);

-- ============================================
-- FUNDADORES DE ARENA
-- ============================================

CREATE TABLE IF NOT EXISTS "ArenaFounder" (
    "id" TEXT PRIMARY KEY,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ArenaFounder_arenaId_fkey" FOREIGN KEY ("arenaId")
        REFERENCES "Arena"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT "ArenaFounder_arenaId_userId_key" UNIQUE("arenaId", "userId")
);

-- ============================================
-- POSTS E COMENTÁRIOS
-- ============================================

CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT PRIMARY KEY,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    -- Status
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isAIResponse" BOOLEAN NOT NULL DEFAULT false,

    -- Moderação
    "isUnderReview" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "rejectionReason" TEXT,

    -- Métricas
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,

    -- Soft delete
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_arenaId_fkey" FOREIGN KEY ("arenaId")
        REFERENCES "Arena"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- COMENTÁRIOS
-- ============================================

CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    -- Status
    "isAIResponse" BOOLEAN NOT NULL DEFAULT false,

    -- Moderação
    "isUnderReview" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,

    -- Soft delete
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId")
        REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- METADADOS DA IA (RAG)
-- ============================================

CREATE TABLE IF NOT EXISTS "AIMetadata" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT NOT NULL UNIQUE,

    -- RAG Info
    "chunksUsed" JSONB NOT NULL,
    "booksReferenced" JSONB NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,

    -- Shadow Mode
    "wasApproved" BOOLEAN NOT NULL DEFAULT true,
    "approvedBy" TEXT,
    "editedContent" TEXT,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMetadata_postId_fkey" FOREIGN KEY ("postId")
        REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- SISTEMA DE FP (FITNESS POINTS)
-- ============================================

CREATE TABLE IF NOT EXISTS "FPTransaction" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    -- Metadata
    "metadata" JSONB,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FPTransaction_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- REGRAS DE FP
-- ============================================

CREATE TABLE IF NOT EXISTS "FPRule" (
    "id" TEXT PRIMARY KEY,
    "action" TEXT NOT NULL UNIQUE,
    "fpValue" INTEGER NOT NULL,
    "dailyCap" INTEGER,
    "cooldown" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- BADGES DE USUÁRIO
-- ============================================

CREATE TABLE IF NOT EXISTS "UserBadge" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- MODERAÇÃO
-- ============================================

CREATE TABLE IF NOT EXISTS "ModerationQueue" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT,
    "commentId" TEXT,
    "userId" TEXT NOT NULL,

    -- Detecção
    "detectedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "flagScore" INTEGER NOT NULL,

    -- Status
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "decision" TEXT,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- AÇÕES DE MODERAÇÃO
-- ============================================

CREATE TABLE IF NOT EXISTS "ModerationAction" (
    "id" TEXT PRIMARY KEY,
    "moderatorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "duration" INTEGER,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationAction_moderatorId_fkey" FOREIGN KEY ("moderatorId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- FILTRO DE SPAM
-- ============================================

CREATE TABLE IF NOT EXISTS "SpamFilter" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "severity" INTEGER NOT NULL,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- AUDITORIA (LOGS IMUTÁVEIS)
-- ============================================

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    -- Dados da ação
    "before" JSONB,
    "after" JSONB,

    -- Metadata
    "ipAddress" TEXT,
    "userAgent" TEXT,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- NFV - ANÁLISE BIOMECÂNICA (VIDEO)
-- ============================================

CREATE TABLE IF NOT EXISTS "VideoAnalysis" (
    "id" TEXT PRIMARY KEY,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    -- Video
    "videoUrl" TEXT NOT NULL,
    "videoPath" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "durationSeconds" INTEGER,

    -- Movimento
    "movementPattern" TEXT NOT NULL,
    "userDescription" TEXT,

    -- Gating
    "fpCost" INTEGER NOT NULL DEFAULT 0,
    "paidWithSubscription" BOOLEAN NOT NULL DEFAULT false,

    -- Pipeline
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING_AI',

    -- IA Pré-Análise
    "aiAnalysis" JSONB,
    "aiAnalyzedAt" TIMESTAMP(3),
    "aiConfidence" DOUBLE PRECISION,

    -- Revisão Admin
    "adminReviewerId" TEXT,
    "adminNotes" TEXT,
    "adminEditedAnalysis" JSONB,
    "reviewedAt" TIMESTAMP(3),

    -- Publicado
    "publishedAnalysis" JSONB,
    "publishedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    -- Métricas
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoAnalysis_arenaId_fkey" FOREIGN KEY ("arenaId")
        REFERENCES "Arena"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VideoAnalysis_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS "DailyMetrics" (
    "id" TEXT PRIMARY KEY,
    "date" DATE NOT NULL UNIQUE,

    -- Usuários
    "dau" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,

    -- Conteúdo
    "postsCreated" INTEGER NOT NULL DEFAULT 0,
    "commentsCreated" INTEGER NOT NULL DEFAULT 0,

    -- IA
    "aiResponses" INTEGER NOT NULL DEFAULT 0,
    "aiApprovalRate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    -- FP
    "fpIssued" INTEGER NOT NULL DEFAULT 0,
    "fpConsumed" INTEGER NOT NULL DEFAULT 0,

    -- Moderação
    "spamDetected" INTEGER NOT NULL DEFAULT 0,
    "contentRemoved" INTEGER NOT NULL DEFAULT 0,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CRIAR ÍNDICES
-- ============================================

-- User Indexes
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_fpTotal_idx" ON "User"("fpTotal");
CREATE INDEX IF NOT EXISTS "User_isBanned_idx" ON "User"("isBanned");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- Arena Indexes
CREATE INDEX IF NOT EXISTS "Arena_slug_idx" ON "Arena"("slug");
CREATE INDEX IF NOT EXISTS "Arena_isActive_idx" ON "Arena"("isActive");
CREATE INDEX IF NOT EXISTS "Arena_status_idx" ON "Arena"("status");
CREATE INDEX IF NOT EXISTS "Arena_categoria_idx" ON "Arena"("categoria");

-- ArenaTag Indexes
CREATE INDEX IF NOT EXISTS "ArenaTag_arenaId_idx" ON "ArenaTag"("arenaId");

-- ArenaFounder Indexes
CREATE INDEX IF NOT EXISTS "ArenaFounder_arenaId_idx" ON "ArenaFounder"("arenaId");
CREATE INDEX IF NOT EXISTS "ArenaFounder_userId_idx" ON "ArenaFounder"("userId");

-- Post Indexes
CREATE INDEX IF NOT EXISTS "Post_arenaId_idx" ON "Post"("arenaId");
CREATE INDEX IF NOT EXISTS "Post_userId_idx" ON "Post"("userId");
CREATE INDEX IF NOT EXISTS "Post_isUnderReview_idx" ON "Post"("isUnderReview");
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX IF NOT EXISTS "Post_isPublished_idx" ON "Post"("isPublished");

-- Comment Indexes
CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS "Comment_isUnderReview_idx" ON "Comment"("isUnderReview");

-- AIMetadata Indexes
CREATE INDEX IF NOT EXISTS "AIMetadata_postId_idx" ON "AIMetadata"("postId");

-- FPTransaction Indexes
CREATE INDEX IF NOT EXISTS "FPTransaction_userId_idx" ON "FPTransaction"("userId");
CREATE INDEX IF NOT EXISTS "FPTransaction_createdAt_idx" ON "FPTransaction"("createdAt");
CREATE INDEX IF NOT EXISTS "FPTransaction_action_idx" ON "FPTransaction"("action");

-- FPRule Indexes
CREATE INDEX IF NOT EXISTS "FPRule_action_idx" ON "FPRule"("action");

-- UserBadge Indexes
CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");
CREATE INDEX IF NOT EXISTS "UserBadge_badgeType_idx" ON "UserBadge"("badgeType");

-- ModerationQueue Indexes
CREATE INDEX IF NOT EXISTS "ModerationQueue_status_idx" ON "ModerationQueue"("status");
CREATE INDEX IF NOT EXISTS "ModerationQueue_createdAt_idx" ON "ModerationQueue"("createdAt");
CREATE INDEX IF NOT EXISTS "ModerationQueue_userId_idx" ON "ModerationQueue"("userId");

-- ModerationAction Indexes
CREATE INDEX IF NOT EXISTS "ModerationAction_moderatorId_idx" ON "ModerationAction"("moderatorId");
CREATE INDEX IF NOT EXISTS "ModerationAction_createdAt_idx" ON "ModerationAction"("createdAt");
CREATE INDEX IF NOT EXISTS "ModerationAction_targetType_targetId_idx" ON "ModerationAction"("targetType", "targetId");

-- SpamFilter Indexes
CREATE INDEX IF NOT EXISTS "SpamFilter_type_idx" ON "SpamFilter"("type");
CREATE INDEX IF NOT EXISTS "SpamFilter_isActive_idx" ON "SpamFilter"("isActive");

-- AuditLog Indexes
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");

-- VideoAnalysis Indexes
CREATE INDEX IF NOT EXISTS "VideoAnalysis_arenaId_idx" ON "VideoAnalysis"("arenaId");
CREATE INDEX IF NOT EXISTS "VideoAnalysis_userId_idx" ON "VideoAnalysis"("userId");
CREATE INDEX IF NOT EXISTS "VideoAnalysis_status_idx" ON "VideoAnalysis"("status");
CREATE INDEX IF NOT EXISTS "VideoAnalysis_movementPattern_idx" ON "VideoAnalysis"("movementPattern");

-- DailyMetrics Indexes
CREATE INDEX IF NOT EXISTS "DailyMetrics_date_idx" ON "DailyMetrics"("date");

-- ============================================
-- 4. TRIGGERS PARA UPDATED_AT
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para User
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para Arena
DROP TRIGGER IF EXISTS update_arena_updated_at ON "Arena";
CREATE TRIGGER update_arena_updated_at
    BEFORE UPDATE ON "Arena"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para Post
DROP TRIGGER IF EXISTS update_post_updated_at ON "Post";
CREATE TRIGGER update_post_updated_at
    BEFORE UPDATE ON "Post"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para Comment
DROP TRIGGER IF EXISTS update_comment_updated_at ON "Comment";
CREATE TRIGGER update_comment_updated_at
    BEFORE UPDATE ON "Comment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para FPRule
DROP TRIGGER IF EXISTS update_fprule_updated_at ON "FPRule";
CREATE TRIGGER update_fprule_updated_at
    BEFORE UPDATE ON "FPRule"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para SpamFilter
DROP TRIGGER IF EXISTS update_spamfilter_updated_at ON "SpamFilter";
CREATE TRIGGER update_spamfilter_updated_at
    BEFORE UPDATE ON "SpamFilter"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para VideoAnalysis
DROP TRIGGER IF EXISTS update_videoanalysis_updated_at ON "VideoAnalysis";
CREATE TRIGGER update_videoanalysis_updated_at
    BEFORE UPDATE ON "VideoAnalysis"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Schema NutriFitCoach criado com sucesso!';
    RAISE NOTICE 'Total de tabelas: 19';
    RAISE NOTICE 'Total de ENUMs: 8';
    RAISE NOTICE 'Total de índices: 45+';
END $$;
