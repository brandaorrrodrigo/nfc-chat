Loaded Prisma config from prisma.config.ts.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'FOUNDER', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "AIPersona" AS ENUM ('SCIENTIFIC', 'MOTIVATIONAL', 'SUSTAINING', 'BALANCED', 'BIOMECHANICS_EXPERT');

-- CreateEnum
CREATE TYPE "ArenaType" AS ENUM ('GENERAL', 'NFV_HUB', 'NFV_PREMIUM');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING_AI', 'AI_ANALYZED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_NEEDED');

-- CreateEnum
CREATE TYPE "ArenaStatus" AS ENUM ('HOT', 'WARM', 'COLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArenaCategoria" AS ENUM ('NUTRICAO_DIETAS', 'TREINO_EXERCICIOS', 'BIOMECANICA_NFV', 'AVALIACAO_BIOMECANICA_NFV', 'AVALIACAO_BIOMETRICA_NFV', 'SAUDE_CONDICOES_CLINICAS', 'RECEITAS_ALIMENTACAO', 'COMUNIDADES_LIVRES');

-- CreateEnum
CREATE TYPE "CreatedBy" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EDITED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "fpTotal" INTEGER NOT NULL DEFAULT 0,
    "fpAvailable" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3),
    "fp_balance" INTEGER NOT NULL DEFAULT 0,
    "fp_lifetime" INTEGER NOT NULL DEFAULT 0,
    "subscription_tier" TEXT NOT NULL DEFAULT 'free',
    "subscription_status" TEXT NOT NULL DEFAULT 'inactive',
    "subscription_ends_at" TIMESTAMP(3),
    "free_baseline_used" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" TIMESTAMP(3),
    "bannedReason" TEXT,
    "spamScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arena" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "allowImages" BOOLEAN NOT NULL DEFAULT true,
    "allowLinks" BOOLEAN NOT NULL DEFAULT true,
    "allowVideos" BOOLEAN NOT NULL DEFAULT false,
    "aiPersona" "AIPersona" NOT NULL DEFAULT 'BALANCED',
    "aiInterventionRate" INTEGER NOT NULL DEFAULT 50,
    "aiFrustrationThreshold" INTEGER NOT NULL DEFAULT 120,
    "aiCooldown" INTEGER NOT NULL DEFAULT 5,
    "arenaType" "ArenaType" NOT NULL DEFAULT 'GENERAL',
    "parentArenaSlug" TEXT,
    "requiresFP" INTEGER,
    "requiresSubscription" BOOLEAN NOT NULL DEFAULT false,
    "movementCategory" TEXT,
    "movementPattern" TEXT,
    "categoria" "ArenaCategoria" NOT NULL DEFAULT 'COMUNIDADES_LIVRES',
    "criadaPor" "CreatedBy" NOT NULL DEFAULT 'ADMIN',
    "createdByUserId" TEXT,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "dailyActiveUsers" INTEGER NOT NULL DEFAULT 0,
    "status" "ArenaStatus" NOT NULL DEFAULT 'COLD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArenaTag" (
    "id" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "ArenaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArenaFounder" (
    "id" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ArenaFounder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "avatarId" TEXT,
    "avatarImg" TEXT,
    "avatarInitialsColor" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isAIResponse" BOOLEAN NOT NULL DEFAULT false,
    "isUnderReview" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "rejectionReason" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "avatarId" TEXT,
    "avatarImg" TEXT,
    "avatarInitialsColor" TEXT,
    "isAIResponse" BOOLEAN NOT NULL DEFAULT false,
    "isUnderReview" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIMetadata" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "chunksUsed" JSONB NOT NULL,
    "booksReferenced" JSONB NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "wasApproved" BOOLEAN NOT NULL DEFAULT true,
    "approvedBy" TEXT,
    "editedContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FPTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FPTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FPRule" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fpValue" INTEGER NOT NULL,
    "dailyCap" INTEGER,
    "cooldown" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FPRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationQueue" (
    "id" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "userId" TEXT NOT NULL,
    "detectedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "flagScore" INTEGER NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "decision" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationAction" (
    "id" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamFilter" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "severity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpamFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoAnalysis" (
    "id" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "videoPath" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "durationSeconds" INTEGER,
    "movementPattern" TEXT NOT NULL,
    "userDescription" TEXT,
    "fpCost" INTEGER NOT NULL DEFAULT 0,
    "paidWithSubscription" BOOLEAN NOT NULL DEFAULT false,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING_AI',
    "aiAnalysis" JSONB,
    "aiAnalyzedAt" TIMESTAMP(3),
    "aiConfidence" DOUBLE PRECISION,
    "adminReviewerId" TEXT,
    "adminNotes" TEXT,
    "adminEditedAnalysis" JSONB,
    "reviewedAt" TIMESTAMP(3),
    "publishedAnalysis" JSONB,
    "publishedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMetrics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "dau" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "postsCreated" INTEGER NOT NULL DEFAULT 0,
    "commentsCreated" INTEGER NOT NULL DEFAULT 0,
    "aiResponses" INTEGER NOT NULL DEFAULT 0,
    "aiApprovalRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fpIssued" INTEGER NOT NULL DEFAULT 0,
    "fpConsumed" INTEGER NOT NULL DEFAULT 0,
    "spamDetected" INTEGER NOT NULL DEFAULT 0,
    "contentRemoved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometric_baselines" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "analysis_text" TEXT NOT NULL,
    "images_metadata" JSONB NOT NULL,
    "protocol_context" TEXT,
    "was_free" BOOLEAN NOT NULL DEFAULT false,
    "cost_fps" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometric_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometric_comparisons" (
    "id" TEXT NOT NULL,
    "baseline_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "analysis_text" TEXT NOT NULL,
    "images_metadata" JSONB NOT NULL,
    "protocol_context" TEXT,
    "cost_fps" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "transaction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometric_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fp_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometric_pricing" (
    "id" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "fps_cost" INTEGER NOT NULL,
    "premium_free" BOOLEAN NOT NULL DEFAULT false,
    "first_free" BOOLEAN NOT NULL DEFAULT false,
    "max_per_month" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biometric_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_arena_activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_arena_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_fpTotal_idx" ON "User"("fpTotal");

-- CreateIndex
CREATE INDEX "User_isBanned_idx" ON "User"("isBanned");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Arena_slug_key" ON "Arena"("slug");

-- CreateIndex
CREATE INDEX "Arena_slug_idx" ON "Arena"("slug");

-- CreateIndex
CREATE INDEX "Arena_isActive_idx" ON "Arena"("isActive");

-- CreateIndex
CREATE INDEX "Arena_status_idx" ON "Arena"("status");

-- CreateIndex
CREATE INDEX "Arena_categoria_idx" ON "Arena"("categoria");

-- CreateIndex
CREATE INDEX "ArenaTag_arenaId_idx" ON "ArenaTag"("arenaId");

-- CreateIndex
CREATE UNIQUE INDEX "ArenaTag_arenaId_tag_key" ON "ArenaTag"("arenaId", "tag");

-- CreateIndex
CREATE INDEX "ArenaFounder_arenaId_idx" ON "ArenaFounder"("arenaId");

-- CreateIndex
CREATE INDEX "ArenaFounder_userId_idx" ON "ArenaFounder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArenaFounder_arenaId_userId_key" ON "ArenaFounder"("arenaId", "userId");

-- CreateIndex
CREATE INDEX "Post_arenaId_idx" ON "Post"("arenaId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_avatarId_idx" ON "Post"("avatarId");

-- CreateIndex
CREATE INDEX "Post_isUnderReview_idx" ON "Post"("isUnderReview");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_isPublished_idx" ON "Post"("isPublished");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_isUnderReview_idx" ON "Comment"("isUnderReview");

-- CreateIndex
CREATE UNIQUE INDEX "AIMetadata_postId_key" ON "AIMetadata"("postId");

-- CreateIndex
CREATE INDEX "AIMetadata_postId_idx" ON "AIMetadata"("postId");

-- CreateIndex
CREATE INDEX "FPTransaction_userId_idx" ON "FPTransaction"("userId");

-- CreateIndex
CREATE INDEX "FPTransaction_createdAt_idx" ON "FPTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "FPTransaction_action_idx" ON "FPTransaction"("action");

-- CreateIndex
CREATE UNIQUE INDEX "FPRule_action_key" ON "FPRule"("action");

-- CreateIndex
CREATE INDEX "FPRule_action_idx" ON "FPRule"("action");

-- CreateIndex
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeType_idx" ON "UserBadge"("badgeType");

-- CreateIndex
CREATE INDEX "ModerationQueue_status_idx" ON "ModerationQueue"("status");

-- CreateIndex
CREATE INDEX "ModerationQueue_createdAt_idx" ON "ModerationQueue"("createdAt");

-- CreateIndex
CREATE INDEX "ModerationQueue_userId_idx" ON "ModerationQueue"("userId");

-- CreateIndex
CREATE INDEX "ModerationAction_moderatorId_idx" ON "ModerationAction"("moderatorId");

-- CreateIndex
CREATE INDEX "ModerationAction_createdAt_idx" ON "ModerationAction"("createdAt");

-- CreateIndex
CREATE INDEX "ModerationAction_targetType_targetId_idx" ON "ModerationAction"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "SpamFilter_type_idx" ON "SpamFilter"("type");

-- CreateIndex
CREATE INDEX "SpamFilter_isActive_idx" ON "SpamFilter"("isActive");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "VideoAnalysis_arenaId_idx" ON "VideoAnalysis"("arenaId");

-- CreateIndex
CREATE INDEX "VideoAnalysis_userId_idx" ON "VideoAnalysis"("userId");

-- CreateIndex
CREATE INDEX "VideoAnalysis_status_idx" ON "VideoAnalysis"("status");

-- CreateIndex
CREATE INDEX "VideoAnalysis_movementPattern_idx" ON "VideoAnalysis"("movementPattern");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMetrics_date_key" ON "DailyMetrics"("date");

-- CreateIndex
CREATE INDEX "DailyMetrics_date_idx" ON "DailyMetrics"("date");

-- CreateIndex
CREATE INDEX "biometric_baselines_user_id_idx" ON "biometric_baselines"("user_id");

-- CreateIndex
CREATE INDEX "biometric_baselines_created_at_idx" ON "biometric_baselines"("created_at");

-- CreateIndex
CREATE INDEX "biometric_comparisons_baseline_id_idx" ON "biometric_comparisons"("baseline_id");

-- CreateIndex
CREATE INDEX "biometric_comparisons_user_id_idx" ON "biometric_comparisons"("user_id");

-- CreateIndex
CREATE INDEX "biometric_comparisons_created_at_idx" ON "biometric_comparisons"("created_at");

-- CreateIndex
CREATE INDEX "fp_transactions_user_id_idx" ON "fp_transactions"("user_id");

-- CreateIndex
CREATE INDEX "fp_transactions_transaction_type_idx" ON "fp_transactions"("transaction_type");

-- CreateIndex
CREATE INDEX "fp_transactions_created_at_idx" ON "fp_transactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "biometric_pricing_item_type_key" ON "biometric_pricing"("item_type");

-- CreateIndex
CREATE INDEX "user_arena_activity_arenaId_lastSeenAt_idx" ON "user_arena_activity"("arenaId", "lastSeenAt");

-- CreateIndex
CREATE INDEX "user_arena_activity_userId_idx" ON "user_arena_activity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_arena_activity_userId_arenaId_key" ON "user_arena_activity"("userId", "arenaId");

-- AddForeignKey
ALTER TABLE "ArenaTag" ADD CONSTRAINT "ArenaTag_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArenaFounder" ADD CONSTRAINT "ArenaFounder_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIMetadata" ADD CONSTRAINT "AIMetadata_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FPTransaction" ADD CONSTRAINT "FPTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationAction" ADD CONSTRAINT "ModerationAction_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoAnalysis" ADD CONSTRAINT "VideoAnalysis_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoAnalysis" ADD CONSTRAINT "VideoAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biometric_baselines" ADD CONSTRAINT "biometric_baselines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biometric_comparisons" ADD CONSTRAINT "biometric_comparisons_baseline_id_fkey" FOREIGN KEY ("baseline_id") REFERENCES "biometric_baselines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biometric_comparisons" ADD CONSTRAINT "biometric_comparisons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fp_transactions" ADD CONSTRAINT "fp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_arena_activity" ADD CONSTRAINT "user_arena_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_arena_activity" ADD CONSTRAINT "user_arena_activity_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE CASCADE ON UPDATE CASCADE;

