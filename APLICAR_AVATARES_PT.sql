-- ═══════════════════════════════════════════════════════════════
-- SCRIPT FINAL: CRIAR COLUNAS E APLICAR AVATARES
-- Compatível com trigger em português (atualizado_em)
-- ═══════════════════════════════════════════════════════════════

-- PASSO 1: Adicionar colunas necessárias
DO $$
BEGIN
    -- Post: atualizado_em (PORTUGUÊS - para o trigger funcionar!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Post' AND column_name = 'atualizado_em') THEN
        ALTER TABLE "Post" ADD COLUMN "atualizado_em" TIMESTAMP(3) DEFAULT NOW();
    END IF;

    -- Post: avatarId
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Post' AND column_name = 'avatarId') THEN
        ALTER TABLE "Post" ADD COLUMN "avatarId" TEXT;
    END IF;

    -- Post: avatarImg
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Post' AND column_name = 'avatarImg') THEN
        ALTER TABLE "Post" ADD COLUMN "avatarImg" TEXT;
    END IF;

    -- Post: avatarInitialsColor
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Post' AND column_name = 'avatarInitialsColor') THEN
        ALTER TABLE "Post" ADD COLUMN "avatarInitialsColor" TEXT;
    END IF;

    -- Comment: atualizado_em (PORTUGUÊS - para o trigger funcionar!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Comment' AND column_name = 'atualizado_em') THEN
        ALTER TABLE "Comment" ADD COLUMN "atualizado_em" TIMESTAMP(3) DEFAULT NOW();
    END IF;

    -- Comment: avatarId
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Comment' AND column_name = 'avatarId') THEN
        ALTER TABLE "Comment" ADD COLUMN "avatarId" TEXT;
    END IF;

    -- Comment: avatarImg
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Comment' AND column_name = 'avatarImg') THEN
        ALTER TABLE "Comment" ADD COLUMN "avatarImg" TEXT;
    END IF;

    -- Comment: avatarInitialsColor
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Comment' AND column_name = 'avatarInitialsColor') THEN
        ALTER TABLE "Comment" ADD COLUMN "avatarInitialsColor" TEXT;
    END IF;

    RAISE NOTICE '✓ Colunas criadas';
END $$;

-- PASSO 2: Criar índices
CREATE INDEX IF NOT EXISTS "Post_avatarId_idx" ON "Post"("avatarId");
CREATE INDEX IF NOT EXISTS "Comment_avatarId_idx" ON "Comment"("avatarId");

-- PASSO 3: Criar pool de avatares
CREATE TEMP TABLE avatar_pool AS
SELECT * FROM (VALUES
  ('avatar_f_01', '/avatars/female/f_01_ecto_young_casual.png', '#FF6B9D'),
  ('avatar_f_02', '/avatars/female/f_02_meso_young_sporty.png', '#E91E63'),
  ('avatar_f_03', '/avatars/female/f_03_endo_young_comfy.png', '#9C27B0'),
  ('avatar_f_04', '/avatars/female/f_04_ecto_adult_professional.png', '#673AB7'),
  ('avatar_f_05', '/avatars/female/f_05_meso_adult_active.png', '#3F51B5'),
  ('avatar_f_06', '/avatars/female/f_06_endo_adult_casual.png', '#2196F3'),
  ('avatar_f_07', '/avatars/female/f_07_ecto_mature_elegant.png', '#00BCD4'),
  ('avatar_f_08', '/avatars/female/f_08_meso_mature_sporty.png', '#009688'),
  ('avatar_f_09', '/avatars/female/f_09_endo_mature_relaxed.png', '#4CAF50'),
  ('avatar_f_10', '/avatars/female/f_10_ecto_young_trendy.png', '#8BC34A'),
  ('avatar_f_11', '/avatars/female/f_11_meso_young_athletic.png', '#CDDC39'),
  ('avatar_f_12', '/avatars/female/f_12_endo_young_cozy.png', '#FFEB3B'),
  ('avatar_f_13', '/avatars/female/f_13_ecto_adult_chic.png', '#FFC107'),
  ('avatar_f_14', '/avatars/female/f_14_meso_adult_strong.png', '#FF9800'),
  ('avatar_f_15', '/avatars/female/f_15_endo_adult_warm.png', '#FF5722'),
  ('avatar_m_01', '/avatars/male/m_01_ecto_young_casual.png', '#795548'),
  ('avatar_m_02', '/avatars/male/m_02_meso_young_sporty.png', '#607D8B'),
  ('avatar_m_03', '/avatars/male/m_03_endo_young_comfy.png', '#9E9E9E'),
  ('avatar_m_04', '/avatars/male/m_04_ecto_adult_professional.png', '#0D47A1'),
  ('avatar_m_05', '/avatars/male/m_05_meso_adult_athletic.png', '#1565C0'),
  ('avatar_m_06', '/avatars/male/m_06_endo_adult_relaxed.png', '#1976D2'),
  ('avatar_m_07', '/avatars/male/m_07_ecto_mature_distinguished.png', '#1E88E5'),
  ('avatar_m_08', '/avatars/male/m_08_meso_mature_strong.png', '#2196F3'),
  ('avatar_m_09', '/avatars/male/m_09_endo_mature_wise.png', '#42A5F5'),
  ('avatar_m_10', '/avatars/male/m_10_ecto_young_trendy.png', '#64B5F6'),
  ('avatar_m_11', '/avatars/male/m_11_meso_young_muscular.png', '#1B5E20'),
  ('avatar_m_12', '/avatars/male/m_12_endo_young_chill.png', '#2E7D32'),
  ('avatar_m_13', '/avatars/male/m_13_ecto_adult_smart.png', '#388E3C'),
  ('avatar_m_14', '/avatars/male/m_14_meso_adult_powerful.png', '#43A047'),
  ('avatar_m_15', '/avatars/male/m_15_endo_adult_gentle.png', '#4CAF50')
) AS t(id, img, color);

-- PASSO 4: Atualizar posts
WITH posts_to_update AS (
  SELECT id
  FROM "Post"
  WHERE "avatarId" IS NULL
  ORDER BY "createdAt"
),
avatar_assignment AS (
  SELECT
    p.id,
    a.id as avatar_id,
    a.img as avatar_img,
    a.color as avatar_color
  FROM posts_to_update p
  CROSS JOIN LATERAL (
    SELECT id, img, color
    FROM avatar_pool
    ORDER BY random()
    LIMIT 1
  ) a
)
UPDATE "Post"
SET
  "avatarId" = aa.avatar_id,
  "avatarImg" = aa.avatar_img,
  "avatarInitialsColor" = aa.avatar_color
FROM avatar_assignment aa
WHERE "Post".id = aa.id;

-- PASSO 5: Atualizar comentários
WITH comments_to_update AS (
  SELECT id
  FROM "Comment"
  WHERE "avatarId" IS NULL
  ORDER BY "createdAt"
),
avatar_assignment AS (
  SELECT
    c.id,
    a.id as avatar_id,
    a.img as avatar_img,
    a.color as avatar_color
  FROM comments_to_update c
  CROSS JOIN LATERAL (
    SELECT id, img, color
    FROM avatar_pool
    ORDER BY random()
    LIMIT 1
  ) a
)
UPDATE "Comment"
SET
  "avatarId" = aa.avatar_id,
  "avatarImg" = aa.avatar_img,
  "avatarInitialsColor" = aa.avatar_color
FROM avatar_assignment aa
WHERE "Comment".id = aa.id;

-- PASSO 6: Verificar resultados
SELECT
  'POSTS' as tabela,
  COUNT(*) FILTER (WHERE "avatarId" IS NOT NULL) as com_avatar,
  COUNT(*) FILTER (WHERE "avatarId" IS NULL) as sem_avatar,
  COUNT(*) as total
FROM "Post"

UNION ALL

SELECT
  'COMMENTS' as tabela,
  COUNT(*) FILTER (WHERE "avatarId" IS NOT NULL) as com_avatar,
  COUNT(*) FILTER (WHERE "avatarId" IS NULL) as sem_avatar,
  COUNT(*) as total
FROM "Comment";

-- PASSO 7: Top 10
SELECT
  "avatarId",
  COUNT(*) as quantidade
FROM "Post"
WHERE "avatarId" IS NOT NULL
GROUP BY "avatarId"
ORDER BY quantidade DESC
LIMIT 10;
