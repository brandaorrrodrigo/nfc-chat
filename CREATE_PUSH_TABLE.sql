CREATE TABLE IF NOT EXISTS "PushSubscription" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  keys TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_push_userid ON "PushSubscription"("userId");
