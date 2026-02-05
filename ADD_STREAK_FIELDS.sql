-- ============================================
-- ADICIONAR CAMPOS DE STREAK NA TABELA USER
-- ============================================
-- Adiciona campos necessários para sistema de streak
-- ============================================

-- Adicionar lastLoginDate se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'lastLoginDate'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "lastLoginDate" TIMESTAMP;
  END IF;
END $$;

-- Adicionar streakBonusesClaimed se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'streakBonusesClaimed'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "streakBonusesClaimed" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
  END IF;
END $$;

-- Verificar se currentStreak e longestStreak existem
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'currentStreak'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "currentStreak" INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'longestStreak'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "longestStreak" INTEGER DEFAULT 0;
  END IF;
END $$;

-- Criar índice para otimizar consultas de streak
CREATE INDEX IF NOT EXISTS idx_user_streak ON "User"("currentStreak" DESC);
CREATE INDEX IF NOT EXISTS idx_user_last_login ON "User"("lastLoginDate");

SELECT '✅ Campos de streak adicionados com sucesso!' as message;

-- Verificar campos criados
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
  AND column_name IN ('currentStreak', 'longestStreak', 'lastLoginDate', 'streakBonusesClaimed')
ORDER BY column_name;
