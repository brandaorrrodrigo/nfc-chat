CREATE TABLE IF NOT EXISTS "CouponReactivation" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "originalCouponId" UUID NOT NULL UNIQUE,
  "newCouponId" UUID NOT NULL,
  "fpCharged" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reactivation_original ON "CouponReactivation"("originalCouponId");
