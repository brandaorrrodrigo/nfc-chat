-- ═══════════════════════════════════════════════════════════════
-- VERIFICAR NÚMEROS REAIS NO BANCO - "Receitas Saudáveis"
-- ═══════════════════════════════════════════════════════════════

-- Ver arena "Receitas Saudáveis"
SELECT
  name as "Arena",
  slug as "Slug",
  "totalPosts" as "Posts (banco)",
  "totalComments" as "Comentários (banco)",
  "dailyActiveUsers" as "Usuários (banco)"
FROM "Arena"
WHERE slug = 'receitas-saudaveis';

-- Contar posts REAIS
SELECT
  'Posts Reais' as tipo,
  COUNT(*) as total
FROM "Post" p
JOIN "Arena" a ON p."arenaId" = a.id
WHERE a.slug = 'receitas-saudaveis'
  AND p."isDeleted" = false;

-- Contar comentários REAIS
SELECT
  'Comentários Reais' as tipo,
  COUNT(*) as total
FROM "Comment" c
JOIN "Post" p ON c."postId" = p.id
JOIN "Arena" a ON p."arenaId" = a.id
WHERE a.slug = 'receitas-saudaveis'
  AND c."isDeleted" = false
  AND p."isDeleted" = false;

-- Listar TODOS os posts da arena
SELECT
  p.id,
  p.content,
  p."commentCount",
  u.name as autor,
  p."createdAt"
FROM "Post" p
JOIN "Arena" a ON p."arenaId" = a.id
JOIN "User" u ON p."userId" = u.id
WHERE a.slug = 'receitas-saudaveis'
  AND p."isDeleted" = false
ORDER BY p."createdAt" DESC;
