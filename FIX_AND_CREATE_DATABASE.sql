-- ============================================
-- SCRIPT DE CORREÇÃO E CRIAÇÃO DO BANCO
-- ============================================
-- Este script primeiro remove tudo e depois recria
-- Execute este ÚNICO script no Supabase
-- ============================================

-- PASSO 1: REMOVER TUDO (cuidado: apaga dados!)
-- Se você tiver dados importantes, NÃO execute esta parte
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- ============================================
-- PASSO 2: CRIAR ENUMS
-- ============================================

-- Role
CREATE TYPE "Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'FOUNDER',
    'MODERATOR',
    'USER'
);

-- AIPersona
CREATE TYPE "AIPersona" AS ENUM (
    'SCIENTIFIC',
    'MOTIVATIONAL',
    'SUSTAINING',
    'BALANCED',
    'BIOMECHANICS_EXPERT'
);

-- ArenaType
CREATE TYPE "ArenaType" AS ENUM (
    'GENERAL',
    'NFV_HUB',
    'NFV_PREMIUM'
);

-- AnalysisStatus
CREATE TYPE "AnalysisStatus" AS ENUM (
    'PENDING_AI',
    'AI_ANALYZED',
    'PENDING_REVIEW',
    'APPROVED',
    'REJECTED',
    'REVISION_NEEDED'
);

-- ArenaStatus
CREATE TYPE "ArenaStatus" AS ENUM (
    'HOT',
    'WARM',
    'COLD',
    'ARCHIVED'
);

-- ArenaCategoria
CREATE TYPE "ArenaCategoria" AS ENUM (
    'NUTRICAO_DIETAS',
    'TREINO_EXERCICIOS',
    'BIOMECANICA_NFV',
    'SAUDE_CONDICOES_CLINICAS',
    'RECEITAS_ALIMENTACAO',
    'COMUNIDADES_LIVRES'
);

-- CreatedBy
CREATE TYPE "CreatedBy" AS ENUM (
    'USER',
    'ADMIN'
);

-- ModerationStatus
CREATE TYPE "ModerationStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'EDITED'
);

-- ============================================
-- PASSO 3: CRIAR TABELAS
-- ============================================

-- User
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    -- 2FA
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,

    -- FP
    "fpTotal" INTEGER NOT NULL DEFAULT 0,
    "fpAvailable" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3),

    -- Moderação
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" TIMESTAMP(3),
    "bannedReason" TEXT,
    "spamScore" INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_fpTotal_idx" ON "User"("fpTotal");
CREATE INDEX "User_isBanned_idx" ON "User"("isBanned");
CREATE INDEX "User_email_idx" ON "User"("email");

-- Arena
CREATE TABLE "Arena" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
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

    -- NFV
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Arena_slug_idx" ON "Arena"("slug");
CREATE INDEX "Arena_isActive_idx" ON "Arena"("isActive");
CREATE INDEX "Arena_status_idx" ON "Arena"("status");
CREATE INDEX "Arena_categoria_idx" ON "Arena"("categoria");

-- ArenaTag
CREATE TABLE "ArenaTag" (
    "id" TEXT PRIMARY KEY,
    "arenaId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "ArenaTag_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE CASCADE,
    CONSTRAINT "ArenaTag_arenaId_tag_key" UNIQUE ("arenaId", "tag")
);

CREATE INDEX "ArenaTag_arenaId_idx" ON "ArenaTag"("arenaId");

-- ArenaFounder
CREATE TABLE "ArenaFounder" (
    "id" TEXT PRIMARY KEY,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ArenaFounder_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE CASCADE,
    CONSTRAINT "ArenaFounder_arenaId_userId_key" UNIQUE ("arenaId", "userId")
);

CREATE INDEX "ArenaFounder_arenaId_idx" ON "ArenaFounder"("arenaId");
CREATE INDEX "ArenaFounder_userId_idx" ON "ArenaFounder"("userId");

-- Post
CREATE TABLE "Post" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE RESTRICT,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "Post_arenaId_idx" ON "Post"("arenaId");
CREATE INDEX "Post_userId_idx" ON "Post"("userId");
CREATE INDEX "Post_isUnderReview_idx" ON "Post"("isUnderReview");
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "Post_isPublished_idx" ON "Post"("isPublished");

-- Comment
CREATE TABLE "Comment" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX "Comment_isUnderReview_idx" ON "Comment"("isUnderReview");

-- AIMetadata
CREATE TABLE "AIMetadata" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT UNIQUE NOT NULL,

    -- RAG
    "chunksUsed" JSONB NOT NULL,
    "booksReferenced" JSONB NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,

    -- Shadow Mode
    "wasApproved" BOOLEAN NOT NULL DEFAULT true,
    "approvedBy" TEXT,
    "editedContent" TEXT,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMetadata_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE
);

CREATE INDEX "AIMetadata_postId_idx" ON "AIMetadata"("postId");

-- FPTransaction
CREATE TABLE "FPTransaction" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    -- Metadata
    "metadata" JSONB,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FPTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "FPTransaction_userId_idx" ON "FPTransaction"("userId");
CREATE INDEX "FPTransaction_createdAt_idx" ON "FPTransaction"("createdAt");
CREATE INDEX "FPTransaction_action_idx" ON "FPTransaction"("action");

-- FPRule
CREATE TABLE "FPRule" (
    "id" TEXT PRIMARY KEY,
    "action" TEXT UNIQUE NOT NULL,
    "fpValue" INTEGER NOT NULL,
    "dailyCap" INTEGER,
    "cooldown" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "FPRule_action_idx" ON "FPRule"("action");

-- UserBadge
CREATE TABLE "UserBadge" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");
CREATE INDEX "UserBadge_badgeType_idx" ON "UserBadge"("badgeType");

-- ModerationQueue
CREATE TABLE "ModerationQueue" (
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

CREATE INDEX "ModerationQueue_status_idx" ON "ModerationQueue"("status");
CREATE INDEX "ModerationQueue_createdAt_idx" ON "ModerationQueue"("createdAt");
CREATE INDEX "ModerationQueue_userId_idx" ON "ModerationQueue"("userId");

-- ModerationAction
CREATE TABLE "ModerationAction" (
    "id" TEXT PRIMARY KEY,
    "moderatorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "duration" INTEGER,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationAction_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "ModerationAction_moderatorId_idx" ON "ModerationAction"("moderatorId");
CREATE INDEX "ModerationAction_createdAt_idx" ON "ModerationAction"("createdAt");
CREATE INDEX "ModerationAction_targetId_idx" ON "ModerationAction"("targetId");

-- SpamFilter
CREATE TABLE "SpamFilter" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "SpamFilter_type_idx" ON "SpamFilter"("type");
CREATE INDEX "SpamFilter_isActive_idx" ON "SpamFilter"("isActive");

-- AuditLog
CREATE TABLE "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- VideoAnalysis
CREATE TABLE "VideoAnalysis" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "movementPattern" TEXT,

    -- Análise IA
    "aiAnalysis" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "keyPoints" JSONB,

    -- Revisão Profissional
    "professionalReview" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),

    -- Status
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING_AI',

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT,
    CONSTRAINT "VideoAnalysis_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE RESTRICT
);

CREATE INDEX "VideoAnalysis_userId_idx" ON "VideoAnalysis"("userId");
CREATE INDEX "VideoAnalysis_arenaId_idx" ON "VideoAnalysis"("arenaId");
CREATE INDEX "VideoAnalysis_status_idx" ON "VideoAnalysis"("status");
CREATE INDEX "VideoAnalysis_createdAt_idx" ON "VideoAnalysis"("createdAt");

-- ============================================
-- PASSO 4: CRIAR TRIGGERS PARA updatedAt
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_arena_updated_at BEFORE UPDATE ON "Arena"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_updated_at BEFORE UPDATE ON "Post"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comment_updated_at BEFORE UPDATE ON "Comment"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fprule_updated_at BEFORE UPDATE ON "FPRule"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spamfilter_updated_at BEFORE UPDATE ON "SpamFilter"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videoanalysis_updated_at BEFORE UPDATE ON "VideoAnalysis"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCESSO!
-- ============================================
SELECT 'Database criado com sucesso!' as message;
