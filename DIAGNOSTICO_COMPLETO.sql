-- ═══════════════════════════════════════════════════════════════
-- DIAGNÓSTICO COMPLETO DO SISTEMA DE CONTADORES
-- Execute no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

SELECT '🔍 DIAGNÓSTICO COMPLETO - INICIANDO' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: VISÃO GERAL - Arenas com Inconsistências
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 PASSO 1: VISÃO GERAL DAS ARENAS' as titulo;

WITH real_counts AS (
  SELECT
    a.id,
    a.name,
    a.slug,
    a."totalPosts" as db_posts,
    a."totalComments" as db_comments,
    a."dailyActiveUsers" as db_users,
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
    WHEN real_posts = 0 AND real_comments = 0 AND (db_posts > 0 OR db_comments > 0)
      THEN '🔴 VAZIA COM NÚMEROS FAKE'
    WHEN ABS(db_posts - real_posts) > 20 OR ABS(db_comments - real_comments) > 50
      THEN '🟠 DISCREPÂNCIA ALTA'
    WHEN db_posts != real_posts OR db_comments != real_comments
      THEN '🟡 DISCREPÂNCIA MÉDIA'
    ELSE '✅ OK'
  END as "Status",
  db_posts as "Posts DB",
  real_posts as "Posts Real",
  db_posts - real_posts as "Dif Posts",
  db_comments as "Comments DB",
  real_comments as "Comments Real",
  db_comments - real_comments as "Dif Comments",
  db_users as "Users DB",
  real_users as "Users Real",
  db_users - real_users as "Dif Users"
FROM real_counts
ORDER BY
  CASE
    WHEN real_posts = 0 AND real_comments = 0 AND (db_posts > 0 OR db_comments > 0) THEN 0
    WHEN ABS(db_posts - real_posts) > 20 OR ABS(db_comments - real_comments) > 50 THEN 1
    WHEN db_posts != real_posts OR db_comments != real_comments THEN 2
    ELSE 3
  END,
  ABS(db_posts - real_posts) + ABS(db_comments - real_comments) DESC;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: RESUMO EXECUTIVO
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 PASSO 2: RESUMO EXECUTIVO' as titulo;

WITH real_counts AS (
  SELECT
    a.id,
    a."totalPosts" as db_posts,
    a."totalComments" as db_comments,
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
  SUM(CASE WHEN real_posts = 0 AND real_comments = 0 AND (db_posts > 0 OR db_comments > 0) THEN 1 ELSE 0 END) as "🔴 Vazias com Números Fake",
  SUM(CASE WHEN ABS(db_posts - real_posts) > 20 OR ABS(db_comments - real_comments) > 50 THEN 1 ELSE 0 END) as "🟠 Discrepâncias Altas",
  SUM(CASE WHEN db_posts != real_posts OR db_comments != real_comments THEN 1 ELSE 0 END) as "🟡 Com Discrepâncias",
  SUM(CASE WHEN db_posts = real_posts AND db_comments = real_comments THEN 1 ELSE 0 END) as "✅ Corretas",
  SUM(real_posts) as "Total Posts Reais",
  SUM(real_comments) as "Total Comentários Reais"
FROM real_counts;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: PROBLEMAS CRÍTICOS - Arenas Vazias com Números
-- ═══════════════════════════════════════════════════════════════

SELECT '🔴 PASSO 3: PROBLEMAS CRÍTICOS - Arenas Vazias com Números Fake' as titulo;

WITH real_counts AS (
  SELECT
    a.id,
    a.name,
    a.slug,
    a."totalPosts" as db_posts,
    a."totalComments" as db_comments,
    COUNT(DISTINCT p.id) FILTER (WHERE p."isDeleted" = false) as real_posts,
    COUNT(DISTINCT c.id) FILTER (WHERE c."isDeleted" = false) as real_comments
  FROM "Arena" a
  LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  GROUP BY a.id, a.name, a.slug, a."totalPosts", a."totalComments"
)
SELECT
  name as "Arena VAZIA com números fake",
  slug as "Slug",
  db_posts as "Mostra Posts",
  db_comments as "Mostra Comments",
  db_posts + db_comments as "Total Números Fake"
FROM real_counts
WHERE real_posts = 0
  AND real_comments = 0
  AND (db_posts > 0 OR db_comments > 0)
ORDER BY db_posts + db_comments DESC;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: PROBLEMAS ALTOS - Posts com Comentários Errados
-- ═══════════════════════════════════════════════════════════════

SELECT '🟠 PASSO 4: PROBLEMAS ALTOS - Posts com Contadores de Comentários Errados' as titulo;

WITH post_counts AS (
  SELECT
    p.id,
    a.name as arena_name,
    u.name as author_name,
    LEFT(p.content, 80) as content_preview,
    p."commentCount" as db_comments,
    COUNT(c.id) as real_comments,
    p."commentCount" - COUNT(c.id) as diff
  FROM "Post" p
  JOIN "Arena" a ON p."arenaId" = a.id
  LEFT JOIN "User" u ON p."userId" = u.id
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  WHERE p."isDeleted" = false
  GROUP BY p.id, a.name, u.name, p.content, p."commentCount"
  HAVING p."commentCount" != COUNT(c.id)
)
SELECT
  arena_name as "Arena",
  author_name as "Autor",
  content_preview as "Post (preview)",
  db_comments as "Comments DB",
  real_comments as "Comments Real",
  diff as "Diferença"
FROM post_counts
WHERE ABS(diff) > 5
ORDER BY ABS(diff) DESC
LIMIT 20;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: BACKUP - Listar TODAS as Conversas Reais
-- ═══════════════════════════════════════════════════════════════

SELECT '💾 PASSO 5: BACKUP - Conversas Reais no Sistema' as titulo;

SELECT
  a.name as "Arena",
  a.slug as "Slug",
  COUNT(DISTINCT p.id) as "Posts",
  COUNT(DISTINCT c.id) as "Comentários",
  COUNT(DISTINCT p."userId") as "Usuários Únicos",
  MIN(p."createdAt") as "Primeira Atividade",
  MAX(COALESCE(c."createdAt", p."createdAt")) as "Última Atividade"
FROM "Arena" a
LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
GROUP BY a.id, a.name, a.slug
HAVING COUNT(DISTINCT p.id) > 0
ORDER BY COUNT(DISTINCT p.id) DESC;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 6: DETALHAMENTO - Arenas com Mais Conteúdo
-- ═══════════════════════════════════════════════════════════════

SELECT '📝 PASSO 6: ARENAS COM MAIS CONTEÚDO (Top 10)' as titulo;

WITH arena_stats AS (
  SELECT
    a.id,
    a.name,
    a.slug,
    COUNT(DISTINCT p.id) as posts,
    COUNT(DISTINCT c.id) as comments,
    COUNT(DISTINCT p."userId") as users
  FROM "Arena" a
  LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  GROUP BY a.id, a.name, a.slug
)
SELECT
  name as "Arena",
  slug as "Slug",
  posts as "Posts",
  comments as "Comentários",
  posts + comments as "Total Interações",
  users as "Usuários"
FROM arena_stats
WHERE posts > 0 OR comments > 0
ORDER BY posts + comments DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 7: EXEMPLO DE CONVERSAS - Arena com Mais Conteúdo
-- ═══════════════════════════════════════════════════════════════

SELECT '💬 PASSO 7: EXEMPLO DE CONVERSAS (Arena mais ativa)' as titulo;

WITH top_arena AS (
  SELECT a.id
  FROM "Arena" a
  LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
  GROUP BY a.id
  ORDER BY COUNT(p.id) DESC
  LIMIT 1
)
SELECT
  a.name as "Arena",
  u.name as "Autor",
  LEFT(p.content, 150) as "Conteúdo",
  p."commentCount" as "Comentários",
  p."createdAt" as "Data"
FROM "Post" p
JOIN "Arena" a ON p."arenaId" = a.id
LEFT JOIN "User" u ON p."userId" = u.id
WHERE p."arenaId" = (SELECT id FROM top_arena)
  AND p."isDeleted" = false
ORDER BY p."createdAt" DESC
LIMIT 5;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 8: RECOMENDAÇÃO
-- ═══════════════════════════════════════════════════════════════

SELECT '💡 PASSO 8: RECOMENDAÇÃO' as titulo;

WITH stats AS (
  SELECT
    COUNT(*) as total_arenas,
    SUM(CASE WHEN real_posts = 0 AND real_comments = 0 AND (db_posts > 0 OR db_comments > 0) THEN 1 ELSE 0 END) as critical,
    SUM(CASE WHEN ABS(db_posts - real_posts) > 20 OR ABS(db_comments - real_comments) > 50 THEN 1 ELSE 0 END) as high_issues,
    SUM(CASE WHEN db_posts != real_posts OR db_comments != real_comments THEN 1 ELSE 0 END) as total_issues
  FROM (
    SELECT
      a.id,
      a."totalPosts" as db_posts,
      a."totalComments" as db_comments,
      COUNT(DISTINCT p.id) FILTER (WHERE p."isDeleted" = false) as real_posts,
      COUNT(DISTINCT c.id) FILTER (WHERE c."isDeleted" = false) as real_comments
    FROM "Arena" a
    LEFT JOIN "Post" p ON p."arenaId" = a.id AND p."isDeleted" = false
    LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
    GROUP BY a.id, a."totalPosts", a."totalComments"
  ) counts
)
SELECT
  CASE
    WHEN critical + high_issues > 10 THEN '🔴 SISTEMA ALTAMENTE COMPROMETIDO - Recomendação: RESET + SEED com 30-40 conversas/arena'
    WHEN total_issues > 5 THEN '🟡 PROBLEMAS DETECTADOS - Recomendação: Correção de contadores + Seed nas vazias'
    WHEN total_issues > 0 THEN '🟢 PROBLEMAS MENORES - Recomendação: Correção simples de contadores'
    ELSE '✅ SISTEMA ÍNTEGRO - Apenas popular arenas vazias'
  END as "Recomendação",
  critical as "Problemas Críticos",
  high_issues as "Problemas Altos",
  total_issues as "Total com Discrepâncias"
FROM stats;

-- ═══════════════════════════════════════════════════════════════
-- FIM DO DIAGNÓSTICO
-- ═══════════════════════════════════════════════════════════════

SELECT '✅ DIAGNÓSTICO COMPLETO FINALIZADO' as status;
SELECT 'Revise os resultados acima e decida a próxima ação' as proximos_passos;
