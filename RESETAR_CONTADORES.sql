-- ═══════════════════════════════════════════════════════════════
-- RESETAR CONTADORES PARA VALORES REAIS
-- ═══════════════════════════════════════════════════════════════
--
-- Remove números falsos e substitui por contagem real do banco
-- ═══════════════════════════════════════════════════════════════

SELECT '🔄 RESETANDO CONTADORES...' as status;

-- ═══════════════════════════════════════════════════════════════
-- ANTES: Ver situação atual
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 ANTES DO RESET' as titulo;

SELECT
  COUNT(*) as "Total Arenas",
  SUM("totalPosts") as "Posts (mostrado)",
  SUM("totalComments") as "Comentários (mostrado)",
  SUM("dailyActiveUsers") as "Usuários (mostrado)"
FROM "Arena"
WHERE "isActive" = true;

-- ═══════════════════════════════════════════════════════════════
-- RESETAR: Atualizar para valores REAIS
-- ═══════════════════════════════════════════════════════════════

-- Resetar contadores das Arenas
UPDATE "Arena" a
SET
  "totalPosts" = (
    SELECT COUNT(*)
    FROM "Post" p
    WHERE p."arenaId" = a.id
      AND p."isDeleted" = false
  ),
  "totalComments" = (
    SELECT COUNT(*)
    FROM "Comment" c
    JOIN "Post" p ON c."postId" = p.id
    WHERE p."arenaId" = a.id
      AND c."isDeleted" = false
      AND p."isDeleted" = false
  ),
  "dailyActiveUsers" = (
    SELECT COUNT(DISTINCT p."userId")
    FROM "Post" p
    WHERE p."arenaId" = a.id
      AND p."isDeleted" = false
  );

-- Resetar comentários em cada Post
UPDATE "Post" p
SET "commentCount" = (
  SELECT COUNT(*)
  FROM "Comment" c
  WHERE c."postId" = p.id
    AND c."isDeleted" = false
)
WHERE p."isDeleted" = false;

SELECT '✅ CONTADORES RESETADOS!' as status;

-- ═══════════════════════════════════════════════════════════════
-- DEPOIS: Ver situação final
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 DEPOIS DO RESET (VALORES REAIS)' as titulo;

SELECT
  COUNT(*) as "Total Arenas",
  SUM("totalPosts") as "Posts (real)",
  SUM("totalComments") as "Comentários (real)",
  SUM("dailyActiveUsers") as "Usuários (real)"
FROM "Arena"
WHERE "isActive" = true;

-- Arenas com conteúdo
SELECT '📋 ARENAS COM CONTEÚDO' as titulo;

SELECT
  name as "Arena",
  "totalPosts" as "Posts",
  "totalComments" as "Comentários",
  "dailyActiveUsers" as "Usuários"
FROM "Arena"
WHERE "totalPosts" > 0
  AND "isActive" = true
ORDER BY "totalPosts" DESC;

-- Arenas vazias
SELECT '📭 ARENAS VAZIAS' as titulo;

SELECT
  name as "Arena",
  slug as "Slug"
FROM "Arena"
WHERE "totalPosts" = 0
  AND "isActive" = true
ORDER BY name;

SELECT '✅ RESET COMPLETO!' as status;
