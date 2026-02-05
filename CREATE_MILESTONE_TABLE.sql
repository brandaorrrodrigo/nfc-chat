/**
 * Tabela de Milestones dos Usuários
 * Tracking de conquistas e progresso
 */

-- Criar tabela UserMilestone
CREATE TABLE IF NOT EXISTS "UserMilestone" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "milestoneId" TEXT NOT NULL,
  "completedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint única
  CONSTRAINT unique_user_milestone UNIQUE ("userId", "milestoneId")
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_usermilestone_userid ON "UserMilestone"("userId");
CREATE INDEX IF NOT EXISTS idx_usermilestone_milestoneid ON "UserMilestone"("milestoneId");
CREATE INDEX IF NOT EXISTS idx_usermilestone_completedat ON "UserMilestone"("completedAt");

-- Habilitar RLS
ALTER TABLE "UserMilestone" ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus milestones
CREATE POLICY user_milestone_select_own ON "UserMilestone"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Policy: Sistema pode inserir milestones
CREATE POLICY user_milestone_insert_system ON "UserMilestone"
  FOR INSERT
  WITH CHECK (true);

-- Comentários
COMMENT ON TABLE "UserMilestone" IS 'Milestones completados pelos usuários';
COMMENT ON COLUMN "UserMilestone"."userId" IS 'ID do usuário';
COMMENT ON COLUMN "UserMilestone"."milestoneId" IS 'ID do milestone (first_fp, unlock_basic, etc)';
COMMENT ON COLUMN "UserMilestone"."completedAt" IS 'Data de conclusão';

-- Exemplo de consulta
-- SELECT * FROM "UserMilestone" WHERE "userId" = 'user-123' ORDER BY "completedAt" DESC;
