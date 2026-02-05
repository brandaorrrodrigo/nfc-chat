CREATE TABLE IF NOT EXISTS "CouponCombo" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "couponCodes" TEXT NOT NULL,
  "totalDiscount" INTEGER NOT NULL,
  "finalDiscount" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_combo_userid ON "CouponCombo"("userId");
