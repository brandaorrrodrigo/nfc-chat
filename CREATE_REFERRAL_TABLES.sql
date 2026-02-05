/**
 * Tabelas do Sistema de Referral
 * Sistema de indicação de amigos
 */

-- Tabela Referral (códigos de indicação)
CREATE TABLE IF NOT EXISTS "Referral" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  "referrerId" TEXT NOT NULL,
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "maxUsages" INTEGER NOT NULL DEFAULT 10,
  "bonusFP" INTEGER NOT NULL DEFAULT 50,
  "bonusDiscount" INTEGER NOT NULL DEFAULT 10,
  "expiresAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela ReferralUsage (registro de uso)
CREATE TABLE IF NOT EXISTS "ReferralUsage" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "referralId" UUID NOT NULL REFERENCES "Referral"(id) ON DELETE CASCADE,
  "referrerId" TEXT NOT NULL,
  "refereeUserId" TEXT NOT NULL UNIQUE, -- Único: cada usuário usa apenas 1 código
  "fpAwarded" INTEGER NOT NULL,
  "discountAwarded" INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "completedAt" TIMESTAMPTZ
);

-- Criar índices Referral
CREATE INDEX IF NOT EXISTS idx_referral_referrerid ON "Referral"("referrerId");
CREATE INDEX IF NOT EXISTS idx_referral_code ON "Referral"(code);
CREATE INDEX IF NOT EXISTS idx_referral_expiresat ON "Referral"("expiresAt");

-- Criar índices ReferralUsage
CREATE INDEX IF NOT EXISTS idx_referralusage_referralid ON "ReferralUsage"("referralId");
CREATE INDEX IF NOT EXISTS idx_referralusage_referrerid ON "ReferralUsage"("referrerId");
CREATE INDEX IF NOT EXISTS idx_referralusage_refereeuserid ON "ReferralUsage"("refereeUserId");
CREATE INDEX IF NOT EXISTS idx_referralusage_status ON "ReferralUsage"(status);

-- Habilitar RLS
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReferralUsage" ENABLE ROW LEVEL SECURITY;

-- Policies Referral
CREATE POLICY referral_select_own ON "Referral"
  FOR SELECT
  USING (auth.uid()::text = "referrerId");

CREATE POLICY referral_insert_own ON "Referral"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "referrerId");

-- Policies ReferralUsage
CREATE POLICY referralusage_select_involved ON "ReferralUsage"
  FOR SELECT
  USING (
    auth.uid()::text = "referrerId" OR
    auth.uid()::text = "refereeUserId"
  );

CREATE POLICY referralusage_insert_system ON "ReferralUsage"
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY referralusage_update_system ON "ReferralUsage"
  FOR UPDATE
  USING (true);

-- Comentários
COMMENT ON TABLE "Referral" IS 'Códigos de indicação de usuários';
COMMENT ON TABLE "ReferralUsage" IS 'Registro de uso de códigos de indicação';

COMMENT ON COLUMN "Referral".code IS 'Código único de indicação (ex: NFCABC123)';
COMMENT ON COLUMN "Referral"."referrerId" IS 'ID do usuário que indica';
COMMENT ON COLUMN "Referral"."usageCount" IS 'Quantas vezes foi usado';
COMMENT ON COLUMN "Referral"."maxUsages" IS 'Limite de usos';
COMMENT ON COLUMN "Referral"."bonusFP" IS 'FP que indicador ganha por conversão';
COMMENT ON COLUMN "Referral"."bonusDiscount" IS 'Desconto extra (%) que indicado ganha';

COMMENT ON COLUMN "ReferralUsage"."refereeUserId" IS 'ID do usuário indicado';
COMMENT ON COLUMN "ReferralUsage".status IS 'pending = cadastrou, completed = converteu';
COMMENT ON COLUMN "ReferralUsage"."completedAt" IS 'Quando o indicado fez primeira conversão';

-- Exemplo de consultas
-- SELECT * FROM "Referral" WHERE "referrerId" = 'user-123';
-- SELECT * FROM "ReferralUsage" WHERE status = 'completed';
