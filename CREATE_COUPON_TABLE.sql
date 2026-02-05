-- ============================================
-- TABELA: Coupon
-- Sistema de cupons de desconto por resgate de FP
-- ============================================

CREATE TABLE IF NOT EXISTS "Coupon" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Usuário que resgatou
  "userId" TEXT NOT NULL,

  -- Código único do cupom
  code TEXT NOT NULL UNIQUE,

  -- Tier do cupom
  "tierId" TEXT NOT NULL,
  "tierName" TEXT NOT NULL,
  "discountPercent" INTEGER NOT NULL,
  "planType" TEXT NOT NULL, -- 'monthly', 'quarterly', 'annual'

  -- Custo em FP
  "fpCost" INTEGER NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'USED', 'EXPIRED'

  -- Datas
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "usedAt" TIMESTAMPTZ,

  -- Tracking de conversão
  "arenaSource" TEXT, -- Qual arena gerou a conversão

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED')),
  CONSTRAINT valid_plan_type CHECK ("planType" IN ('monthly', 'quarterly', 'annual')),
  CONSTRAINT valid_discount CHECK ("discountPercent" >= 0 AND "discountPercent" <= 100)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_coupon_user ON "Coupon"("userId");
CREATE INDEX IF NOT EXISTS idx_coupon_code ON "Coupon"(code);
CREATE INDEX IF NOT EXISTS idx_coupon_status ON "Coupon"(status);
CREATE INDEX IF NOT EXISTS idx_coupon_expires ON "Coupon"("expiresAt");
CREATE INDEX IF NOT EXISTS idx_coupon_arena ON "Coupon"("arenaSource");
CREATE INDEX IF NOT EXISTS idx_coupon_created ON "Coupon"("createdAt" DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios cupons
CREATE POLICY "Users can view own coupons"
  ON "Coupon"
  FOR SELECT
  USING ("userId" = current_setting('app.user_id', true));

-- Policy: Sistema pode inserir cupons
CREATE POLICY "System can insert coupons"
  ON "Coupon"
  FOR INSERT
  WITH CHECK (true);

-- Policy: Sistema pode atualizar cupons
CREATE POLICY "System can update coupons"
  ON "Coupon"
  FOR UPDATE
  USING (true);

-- ============================================
-- COMENTÁRIOS
-- ============================================

COMMENT ON TABLE "Coupon" IS 'Cupons de desconto gerados por resgate de FP';
COMMENT ON COLUMN "Coupon".code IS 'Código único do cupom (ex: NFCMON8A7B2C)';
COMMENT ON COLUMN "Coupon"."expiresAt" IS 'Cupom expira 48h após criação';
COMMENT ON COLUMN "Coupon"."arenaSource" IS 'Arena que gerou a conversão (tracking de ROI)';
