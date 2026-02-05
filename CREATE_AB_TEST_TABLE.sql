-- Tabela de Eventos de A/B Testing
CREATE TABLE IF NOT EXISTS "ABTestEvent" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "testId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL, -- impression, conversion
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abtest_testid ON "ABTestEvent"("testId");
CREATE INDEX IF NOT EXISTS idx_abtest_variantid ON "ABTestEvent"("variantId");
CREATE INDEX IF NOT EXISTS idx_abtest_eventtype ON "ABTestEvent"("eventType");

ALTER TABLE "ABTestEvent" ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE "ABTestEvent" IS 'Eventos de A/B testing';
