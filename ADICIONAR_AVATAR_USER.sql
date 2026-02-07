-- ═══════════════════════════════════════════════════════════════
-- ADICIONAR CAMPOS DE AVATAR NA TABELA USER
-- Para permitir que usuários escolham avatares
-- ═══════════════════════════════════════════════════════════════

-- Adicionar colunas de avatar no User (se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'avatarId') THEN
        ALTER TABLE "User" ADD COLUMN "avatarId" TEXT;
        RAISE NOTICE '✓ Coluna avatarId adicionada à tabela User';
    ELSE
        RAISE NOTICE '  Coluna avatarId já existe na tabela User';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'avatarImg') THEN
        ALTER TABLE "User" ADD COLUMN "avatarImg" TEXT;
        RAISE NOTICE '✓ Coluna avatarImg adicionada à tabela User';
    ELSE
        RAISE NOTICE '  Coluna avatarImg já existe na tabela User';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'avatarInitialsColor') THEN
        ALTER TABLE "User" ADD COLUMN "avatarInitialsColor" TEXT;
        RAISE NOTICE '✓ Coluna avatarInitialsColor adicionada à tabela User';
    ELSE
        RAISE NOTICE '  Coluna avatarInitialsColor já existe na tabela User';
    END IF;

    -- Adicionar coluna profilePicture se não existir (para upload de foto própria)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'profilePicture') THEN
        ALTER TABLE "User" ADD COLUMN "profilePicture" TEXT;
        RAISE NOTICE '✓ Coluna profilePicture adicionada à tabela User';
    ELSE
        RAISE NOTICE '  Coluna profilePicture já existe na tabela User';
    END IF;
END $$;

-- Criar índice
CREATE INDEX IF NOT EXISTS "User_avatarId_idx" ON "User"("avatarId");

-- Adicionar colunas de timestamp se não existirem (para triggers)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'updated_at') THEN
        ALTER TABLE "User" ADD COLUMN "updated_at" TIMESTAMP(3) DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'updatedAt') THEN
        ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'atualizado_em') THEN
        ALTER TABLE "User" ADD COLUMN "atualizado_em" TIMESTAMP(3) DEFAULT NOW();
    END IF;
END $$;

-- Verificar resultados
SELECT
  'User' as tabela,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE "avatarId" IS NOT NULL) as com_avatar,
  COUNT(*) FILTER (WHERE "profilePicture" IS NOT NULL) as com_foto_propria
FROM "User";
