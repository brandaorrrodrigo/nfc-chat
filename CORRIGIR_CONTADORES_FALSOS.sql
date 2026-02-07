-- ═══════════════════════════════════════════════════════════════
-- CORRIGIR CONTADORES FALSOS DAS COMUNIDADES
-- Substitui números fake por números REAIS do banco
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: DIAGNÓSTICO - Ver situação atual
-- ═══════════════════════════════════════════════════════════════

SELECT
  '🔍 DIAGNÓSTICO DE CONTADORES' as titulo;

-- Mostrar arenas com discrepâncias
WITH real_counts AS (
  SELECT
    a.id,
    a.name,
    a.slug,
    a."totalPosts" as stored_posts,
    a."totalComments" as stored_comments,
    a."dailyActiveUsers" as stored_users,
    COUNT(DISTINCT p.id) FILTER (WHERE p."isDeleted" = false) as real_posts,
    COUNT(DISTINCT c.id) FILTER (WHERE c."isDeleted" = false) as real_comments,
    COUNT(DISTINCT p."userId") FILTER (WHERE p."isDeleted" = false) as real_users
  FROM "Arena" a
  LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  GROUP BY a.id, a.name, a.slug, a."totalPosts", a."totalComments", a."dailyActiveUsers"
)
SELECT
  name as "Arena",
  slug as "Slug",
  CASE
    WHEN real_posts = 0 AND real_comments = 0 AND (stored_posts > 0 OR stored_comments > 0) THEN '🚨 VAZIA MAS MOSTRA NÚMEROS'
    WHEN stored_posts != real_posts OR stored_comments != real_comments THEN '⚠️  DISCREPÂNCIA'
    ELSE '✅ OK'
  END as "Status",
  stored_posts as "Posts (mostra)",
  real_posts as "Posts (real)",
  stored_posts - real_posts as "Dif Posts",
  stored_comments as "Comments (mostra)",
  real_comments as "Comments (real)",
  stored_comments - real_comments as "Dif Comments"
FROM real_counts
WHERE stored_posts != real_posts OR stored_comments != real_comments
ORDER BY
  CASE
    WHEN real_posts = 0 AND real_comments = 0 THEN 0
    ELSE 1
  END,
  ABS(stored_posts - real_posts) + ABS(stored_comments - real_comments) DESC;

-- ═══════════════════════════════════════════════════════════════
-- RESUMO GERAL
-- ═══════════════════════════════════════════════════════════════

SELECT
  '📊 RESUMO GERAL' as titulo;

WITH real_counts AS (
  SELECT
    a.id,
    a."totalPosts" as stored_posts,
    a."totalComments" as stored_comments,
    COUNT(DISTINCT p.id) FILTER (WHERE p."isDeleted" = false) as real_posts,
    COUNT(DISTINCT c.id) FILTER (WHERE c."isDeleted" = false) as real_comments
  FROM "Arena" a
  LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  GROUP BY a.id, a."totalPosts", a."totalComments"
)
SELECT
  COUNT(*) as "Total Arenas",
  SUM(CASE WHEN real_posts = 0 AND real_comments = 0 THEN 1 ELSE 0 END) as "Arenas Vazias",
  SUM(CASE WHEN stored_posts != real_posts OR stored_comments != real_comments THEN 1 ELSE 0 END) as "Com Discrepâncias",
  SUM(CASE WHEN stored_posts = real_posts AND stored_comments = real_comments THEN 1 ELSE 0 END) as "Corretas"
FROM real_counts;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: CORREÇÃO - Atualizar para valores REAIS
-- ═══════════════════════════════════════════════════════════════

SELECT
  '🔧 INICIANDO CORREÇÃO...' as titulo;

-- Atualizar totalPosts e totalComments nas Arenas
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

-- Atualizar commentCount nos Posts
UPDATE "Post" p
SET
  "commentCount" = (
    SELECT COUNT(*)
    FROM "Comment" c
    WHERE c."postId" = p.id
      AND c."isDeleted" = false
  );

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: VERIFICAÇÃO - Conferir resultado
-- ═══════════════════════════════════════════════════════════════

SELECT
  '✅ CORREÇÃO CONCLUÍDA!' as titulo;

-- Verificar se ainda há discrepâncias
WITH real_counts AS (
  SELECT
    a.id,
    a."totalPosts" as stored_posts,
    a."totalComments" as stored_comments,
    COUNT(DISTINCT p.id) FILTER (WHERE p."isDeleted" = false) as real_posts,
    COUNT(DISTINCT c.id) FILTER (WHERE c."isDeleted" = false) as real_comments
  FROM "Arena" a
  LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  GROUP BY a.id, a."totalPosts", a."totalComments"
)
SELECT
  SUM(CASE WHEN stored_posts != real_posts OR stored_comments != real_comments THEN 1 ELSE 0 END) as "Discrepâncias Restantes"
FROM real_counts;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: SITUAÇÃO FINAL - Arenas com conteúdo
-- ═══════════════════════════════════════════════════════════════

SELECT
  '📊 SITUAÇÃO FINAL - Arenas com Conteúdo' as titulo;

SELECT
  a.name as "Arena",
  a.slug as "Slug",
  a."totalPosts" as "Posts",
  a."totalComments" as "Comentários",
  a."dailyActiveUsers" as "Usuários Ativos"
FROM "Arena" a
WHERE a."totalPosts" > 0 OR a."totalComments" > 0
ORDER BY a."totalPosts" DESC, a."totalComments" DESC;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: Arenas vazias (para referência)
-- ═══════════════════════════════════════════════════════════════

SELECT
  '📭 ARENAS VAZIAS' as titulo;

SELECT
  a.name as "Arena",
  a.slug as "Slug",
  a."totalPosts" as "Posts",
  a."totalComments" as "Comentários"
FROM "Arena" a
WHERE a."totalPosts" = 0 AND a."totalComments" = 0
ORDER BY a.name;

-- ═══════════════════════════════════════════════════════════════
-- RESULTADO ESPERADO
-- ═══════════════════════════════════════════════════════════════
-- ✅ totalPosts = número REAL de posts não deletados
-- ✅ totalComments = número REAL de comentários não deletados
-- ✅ dailyActiveUsers = número REAL de usuários únicos que postaram
-- ✅ Post.commentCount = número REAL de comentários em cada post
-- ═══════════════════════════════════════════════════════════════
