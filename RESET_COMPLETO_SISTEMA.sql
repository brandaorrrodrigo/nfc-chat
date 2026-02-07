-- ═══════════════════════════════════════════════════════════════
-- RESET COMPLETO DO SISTEMA - ZERAR TUDO E RECONSTRUIR
-- ═══════════════════════════════════════════════════════════════
--
-- Este script:
-- 1. Reseta TODOS os contadores para ZERO
-- 2. Recalcula baseado em dados REAIS do banco
-- 3. Remove inconsistências
-- 4. Gera relatório completo
--
-- SEGURO: Não apaga posts/comentários, apenas corrige contadores
-- ═══════════════════════════════════════════════════════════════

SELECT '🔄 RESET COMPLETO DO SISTEMA - INICIANDO...' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: SNAPSHOT ANTES (Para comparação)
-- ═══════════════════════════════════════════════════════════════

SELECT '📸 PASSO 1: Tirando snapshot do estado atual...' as status;

CREATE TEMP TABLE snapshot_antes AS
SELECT
  COUNT(*) as total_arenas,
  SUM("totalPosts") as posts_mostrados,
  SUM("totalComments") as comments_mostrados,
  SUM("dailyActiveUsers") as users_mostrados,
  (SELECT COUNT(*) FROM "Post" WHERE "isDeleted" = false) as posts_reais_totais,
  (SELECT COUNT(*) FROM "Comment" WHERE "isDeleted" = false) as comments_reais_totais
FROM "Arena"
WHERE "isActive" = true;

SELECT
  '📊 SITUAÇÃO ANTES DO RESET' as titulo,
  total_arenas as "Total Arenas",
  posts_mostrados as "Posts Mostrados (pode estar errado)",
  posts_reais_totais as "Posts Reais no Banco",
  posts_mostrados - posts_reais_totais as "Diferença Posts",
  comments_mostrados as "Comentários Mostrados",
  comments_reais_totais as "Comentários Reais",
  comments_mostrados - comments_reais_totais as "Diferença Comentários"
FROM snapshot_antes;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: ZERAR TUDO (Reset Total)
-- ═══════════════════════════════════════════════════════════════

SELECT '🗑️  PASSO 2: Zerando TODOS os contadores...' as status;

-- Zerar arenas
UPDATE "Arena"
SET
  "totalPosts" = 0,
  "totalComments" = 0,
  "dailyActiveUsers" = 0
WHERE "isActive" = true;

-- Zerar posts
UPDATE "Post"
SET
  "commentCount" = 0,
  "viewCount" = 0,
  "likeCount" = 0
WHERE "isDeleted" = false;

SELECT '✅ Todos os contadores zerados' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: RECALCULAR baseado em dados REAIS
-- ═══════════════════════════════════════════════════════════════

SELECT '🔢 PASSO 3: Recalculando com dados REAIS...' as status;

-- Recalcular comentários em cada Post
UPDATE "Post" p
SET "commentCount" = (
  SELECT COUNT(*)
  FROM "Comment" c
  WHERE c."postId" = p.id
    AND c."isDeleted" = false
)
WHERE p."isDeleted" = false;

SELECT '  ✓ Comentários dos posts recalculados' as status;

-- Recalcular Posts por Arena
UPDATE "Arena" a
SET "totalPosts" = (
  SELECT COUNT(*)
  FROM "Post" p
  WHERE p."arenaId" = a.id
    AND p."isDeleted" = false
)
WHERE a."isActive" = true;

SELECT '  ✓ Total de posts por arena recalculado' as status;

-- Recalcular Comentários por Arena
UPDATE "Arena" a
SET "totalComments" = (
  SELECT COUNT(*)
  FROM "Comment" c
  JOIN "Post" p ON c."postId" = p.id
  WHERE p."arenaId" = a.id
    AND c."isDeleted" = false
    AND p."isDeleted" = false
)
WHERE a."isActive" = true;

SELECT '  ✓ Total de comentários por arena recalculado' as status;

-- Recalcular Usuários Únicos por Arena
UPDATE "Arena" a
SET "dailyActiveUsers" = (
  SELECT COUNT(DISTINCT p."userId")
  FROM "Post" p
  WHERE p."arenaId" = a.id
    AND p."isDeleted" = false
    AND p."userId" IS NOT NULL
)
WHERE a."isActive" = true;

SELECT '  ✓ Usuários ativos por arena recalculados' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: VERIFICAR INTEGRIDADE
-- ═══════════════════════════════════════════════════════════════

SELECT '🔍 PASSO 4: Verificando integridade...' as status;

-- Verificar se há posts órfãos (sem arena)
SELECT
  '⚠️  Posts órfãos (sem arena)' as tipo,
  COUNT(*) as quantidade
FROM "Post"
WHERE "arenaId" NOT IN (SELECT id FROM "Arena")
  AND "isDeleted" = false;

-- Verificar se há comentários órfãos (sem post)
SELECT
  '⚠️  Comentários órfãos (sem post)' as tipo,
  COUNT(*) as quantidade
FROM "Comment"
WHERE "postId" NOT IN (SELECT id FROM "Post")
  AND "isDeleted" = false;

-- Verificar posts com contador de comentários errado
WITH discrepancias AS (
  SELECT
    p.id,
    p."commentCount" as contador,
    COUNT(c.id) as real
  FROM "Post" p
  LEFT JOIN "Comment" c ON c."postId" = p.id AND c."isDeleted" = false
  WHERE p."isDeleted" = false
  GROUP BY p.id, p."commentCount"
  HAVING p."commentCount" != COUNT(c.id)
)
SELECT
  '⚠️  Posts com contador errado' as tipo,
  COUNT(*) as quantidade
FROM discrepancias;

SELECT '✅ Verificação de integridade completa' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: RELATÓRIO FINAL DETALHADO
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 PASSO 5: Gerando relatório final...' as status;

-- Comparação Antes vs Depois
SELECT '📈 COMPARAÇÃO: ANTES vs DEPOIS' as titulo;

SELECT
  'ANTES' as momento,
  posts_mostrados as "Posts Mostrados",
  posts_reais_totais as "Posts Reais",
  comments_mostrados as "Comentários Mostrados",
  comments_reais_totais as "Comentários Reais"
FROM snapshot_antes

UNION ALL

SELECT
  'DEPOIS' as momento,
  SUM("totalPosts") as posts_mostrados,
  (SELECT COUNT(*) FROM "Post" WHERE "isDeleted" = false) as posts_reais,
  SUM("totalComments") as comments_mostrados,
  (SELECT COUNT(*) FROM "Comment" WHERE "isDeleted" = false) as comments_reais
FROM "Arena"
WHERE "isActive" = true;

-- Estatísticas Globais
SELECT '🌍 ESTATÍSTICAS GLOBAIS DO SISTEMA' as titulo;

SELECT
  COUNT(*) as "Total Arenas Ativas",
  SUM("totalPosts") as "Total Posts",
  SUM("totalComments") as "Total Comentários",
  SUM("dailyActiveUsers") as "Total Usuários Únicos",
  ROUND(AVG("totalPosts")::numeric, 2) as "Média Posts/Arena",
  ROUND(AVG("totalComments")::numeric, 2) as "Média Comentários/Arena",
  MAX("totalPosts") as "Max Posts em Arena",
  MIN("totalPosts") as "Min Posts em Arena"
FROM "Arena"
WHERE "isActive" = true;

-- Top 10 Arenas Mais Ativas
SELECT '🏆 TOP 10 ARENAS MAIS ATIVAS' as titulo;

SELECT
  name as "Arena",
  slug as "Slug",
  "totalPosts" as "Posts",
  "totalComments" as "Comentários",
  "dailyActiveUsers" as "Usuários",
  "totalPosts" + "totalComments" as "Total Interações"
FROM "Arena"
WHERE "isActive" = true
ORDER BY "totalPosts" + "totalComments" DESC
LIMIT 10;

-- Distribuição de Posts
SELECT '📊 DISTRIBUIÇÃO DE POSTS POR ARENA' as titulo;

SELECT
  CASE
    WHEN "totalPosts" = 0 THEN '🔴 0 posts (vazia)'
    WHEN "totalPosts" BETWEEN 1 AND 10 THEN '🟡 1-10 posts'
    WHEN "totalPosts" BETWEEN 11 AND 30 THEN '🟠 11-30 posts'
    WHEN "totalPosts" >= 31 THEN '🟢 31+ posts (boa)'
  END as "Faixa",
  COUNT(*) as "Quantidade Arenas",
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Arena" WHERE "isActive" = true), 1) as "Percentual %"
FROM "Arena"
WHERE "isActive" = true
GROUP BY 1
ORDER BY
  CASE
    WHEN "totalPosts" = 0 THEN 0
    WHEN "totalPosts" BETWEEN 1 AND 10 THEN 1
    WHEN "totalPosts" BETWEEN 11 AND 30 THEN 2
    ELSE 3
  END;

-- Arenas Vazias (precisam de seed)
SELECT '📭 ARENAS VAZIAS (PRECISAM DE SEED)' as titulo;

SELECT
  name as "Arena (vazia)",
  slug as "Slug",
  categoria as "Categoria"
FROM "Arena"
WHERE "totalPosts" = 0
  AND "isActive" = true
ORDER BY name;

-- Arenas com Conteúdo
SELECT '📝 ARENAS COM CONTEÚDO' as titulo;

SELECT
  name as "Arena",
  "totalPosts" as "Posts",
  "totalComments" as "Comentários",
  "dailyActiveUsers" as "Usuários",
  ROUND(
    CASE
      WHEN "totalPosts" > 0
      THEN "totalComments"::numeric / "totalPosts"::numeric
      ELSE 0
    END,
    2
  ) as "Comentários/Post (média)"
FROM "Arena"
WHERE "totalPosts" > 0
  AND "isActive" = true
ORDER BY "totalPosts" DESC;

-- Posts com mais comentários
SELECT '💬 POSTS COM MAIS COMENTÁRIOS' as titulo;

SELECT
  LEFT(p.content, 80) as "Post (preview)",
  p."commentCount" as "Comentários",
  a.name as "Arena",
  u.name as "Autor"
FROM "Post" p
JOIN "Arena" a ON p."arenaId" = a.id
JOIN "User" u ON p."userId" = u.id
WHERE p."isDeleted" = false
  AND p."commentCount" > 0
ORDER BY p."commentCount" DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 6: RECOMENDAÇÕES
-- ═══════════════════════════════════════════════════════════════

SELECT '💡 PASSO 6: Recomendações...' as status;

WITH stats AS (
  SELECT
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE "totalPosts" = 0) as vazias,
    COUNT(*) FILTER (WHERE "totalPosts" BETWEEN 1 AND 30) as poucas,
    COUNT(*) FILTER (WHERE "totalPosts" >= 31) as boas
  FROM "Arena"
  WHERE "isActive" = true
)
SELECT
  CASE
    WHEN vazias::float / total > 0.5 THEN '🔴 CRÍTICO: Mais de 50% das arenas estão vazias. Execute POPULAR_ARENAS_CONVERSAS.sql'
    WHEN (vazias + poucas)::float / total > 0.7 THEN '🟠 ALERTA: Maioria das arenas precisa de mais conteúdo. Execute POPULAR_ARENAS_CONVERSAS.sql'
    WHEN vazias > 0 THEN '🟡 ATENÇÃO: Algumas arenas vazias. Considere popular com POPULAR_ARENAS_CONVERSAS.sql'
    ELSE '🟢 ÓTIMO: Sistema bem populado! Apenas mantenha o engajamento.'
  END as "Recomendação",
  total as "Total Arenas",
  vazias as "Vazias",
  poucas as "Com Pouco Conteúdo (1-30)",
  boas as "Bem Populadas (31+)"
FROM stats;

-- ═══════════════════════════════════════════════════════════════
-- FINALIZAÇÃO
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS snapshot_antes;

SELECT '✅ RESET COMPLETO FINALIZADO!' as status;
SELECT '🎉 Sistema resetado com sucesso!' as mensagem;
SELECT '📌 PRÓXIMO PASSO: Limpar cache Redis em /api/arenas?flush=true' as proxima_acao;
