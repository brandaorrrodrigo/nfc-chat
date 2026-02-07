-- ═══════════════════════════════════════════════════════════════
-- CORRIGIR APENAS AVATARES DUPLICADOS
-- Substitui por iniciais SOMENTE quando mesma imagem é usada por pessoas diferentes
-- ═══════════════════════════════════════════════════════════════

-- Paleta de 20 cores
CREATE TEMP TABLE color_palette AS
SELECT * FROM (VALUES
  ('#FF6B9D'), ('#E91E63'), ('#9C27B0'), ('#673AB7'), ('#3F51B5'),
  ('#2196F3'), ('#00BCD4'), ('#009688'), ('#4CAF50'), ('#8BC34A'),
  ('#CDDC39'), ('#FFC107'), ('#FF9800'), ('#FF5722'), ('#795548'),
  ('#607D8B'), ('#0D47A1'), ('#1B5E20'), ('#388E3C'), ('#F57C00')
) AS t(color);

-- Função para gerar cor baseada no nome
CREATE OR REPLACE FUNCTION get_color_for_name(user_name TEXT)
RETURNS TEXT AS $$
DECLARE
  name_hash BIGINT;
  color_index INT;
  selected_color TEXT;
BEGIN
  name_hash := hashtext(user_name);
  color_index := (ABS(name_hash) % 20) + 1;

  SELECT color INTO selected_color
  FROM color_palette
  OFFSET color_index - 1
  LIMIT 1;

  RETURN selected_color;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: IDENTIFICAR AVATARES DUPLICADOS EM POSTS
-- ═══════════════════════════════════════════════════════════════

-- Encontrar avatarId que são usados por múltiplos usuários
CREATE TEMP TABLE duplicated_post_avatars AS
SELECT
  "avatarId",
  COUNT(DISTINCT "userId") as usuarios_diferentes,
  COUNT(*) as total_posts,
  ARRAY_AGG(DISTINCT "userId") as user_ids
FROM "Post"
WHERE "avatarId" IS NOT NULL
GROUP BY "avatarId"
HAVING COUNT(DISTINCT "userId") > 1;

-- Mostrar duplicados encontrados
SELECT
  'POSTS DUPLICADOS' as tipo,
  COUNT(*) as avatares_duplicados,
  SUM(usuarios_diferentes) as usuarios_afetados,
  SUM(total_posts) as posts_afetados
FROM duplicated_post_avatars;

-- Detalhes dos duplicados
SELECT
  d."avatarId",
  d.usuarios_diferentes as usuarios,
  d.total_posts as posts,
  STRING_AGG(DISTINCT u.name, ', ') as nomes_usuarios
FROM duplicated_post_avatars d
CROSS JOIN UNNEST(d.user_ids) AS uid
JOIN "User" u ON u.id = uid
GROUP BY d."avatarId", d.usuarios_diferentes, d.total_posts
ORDER BY d.usuarios_diferentes DESC;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: IDENTIFICAR AVATARES DUPLICADOS EM COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════

CREATE TEMP TABLE duplicated_comment_avatars AS
SELECT
  "avatarId",
  COUNT(DISTINCT "userId") as usuarios_diferentes,
  COUNT(*) as total_comments
FROM "Comment"
WHERE "avatarId" IS NOT NULL
GROUP BY "avatarId"
HAVING COUNT(DISTINCT "userId") > 1;

SELECT
  'COMMENTS DUPLICADOS' as tipo,
  COUNT(*) as avatares_duplicados,
  SUM(usuarios_diferentes) as usuarios_afetados,
  SUM(total_comments) as comments_afetados
FROM duplicated_comment_avatars;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: CORRIGIR POSTS COM AVATARES DUPLICADOS
-- ═══════════════════════════════════════════════════════════════

UPDATE "Post" p
SET
  "avatarId" = NULL,
  "avatarImg" = NULL,
  "avatarInitialsColor" = get_color_for_name(u.name)
FROM "User" u, duplicated_post_avatars d
WHERE p."userId" = u.id
  AND p."avatarId" = d."avatarId";

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: CORRIGIR COMENTÁRIOS COM AVATARES DUPLICADOS
-- ═══════════════════════════════════════════════════════════════

UPDATE "Comment" c
SET
  "avatarId" = NULL,
  "avatarImg" = NULL,
  "avatarInitialsColor" = get_color_for_name(u.name)
FROM "User" u, duplicated_comment_avatars d
WHERE c."userId" = u.id
  AND c."avatarId" = d."avatarId";

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: VERIFICAR RESULTADOS
-- ═══════════════════════════════════════════════════════════════

-- Status final
SELECT
  'POSTS' as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE "avatarImg" IS NOT NULL) as com_imagem,
  COUNT(*) FILTER (WHERE "avatarImg" IS NULL AND "avatarInitialsColor" IS NOT NULL) as so_iniciais,
  COUNT(*) FILTER (WHERE "avatarImg" IS NULL AND "avatarInitialsColor" IS NULL) as sem_avatar
FROM "Post"

UNION ALL

SELECT
  'COMMENTS',
  COUNT(*),
  COUNT(*) FILTER (WHERE "avatarImg" IS NOT NULL),
  COUNT(*) FILTER (WHERE "avatarImg" IS NULL AND "avatarInitialsColor" IS NOT NULL),
  COUNT(*) FILTER (WHERE "avatarImg" IS NULL AND "avatarInitialsColor" IS NULL)
FROM "Comment";

-- Verificar se ainda há duplicados
SELECT
  'VERIFICAÇÃO' as tipo,
  COUNT(*) as avatares_ainda_duplicados
FROM (
  SELECT "avatarId"
  FROM "Post"
  WHERE "avatarId" IS NOT NULL
  GROUP BY "avatarId"
  HAVING COUNT(DISTINCT "userId") > 1
) duplicados;

-- Limpar
DROP FUNCTION IF EXISTS get_color_for_name(TEXT);

-- ═══════════════════════════════════════════════════════════════
-- RESULTADO ESPERADO
-- ═══════════════════════════════════════════════════════════════
-- ✅ Avatares ÚNICOS mantidos (1 usuário = 1 imagem)
-- ✅ Avatares DUPLICADOS substituídos por iniciais
-- ✅ Cada usuário tem cor única baseada no nome
-- ═══════════════════════════════════════════════════════════════
