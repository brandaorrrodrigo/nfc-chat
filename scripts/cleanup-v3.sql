-- LIMPEZA DIRETA - Posts sem ** em todas as arenas
-- Primeiro verifica, depois deleta

-- 1. VER o que vai ser deletado (rode primeiro pra confirmar)
SELECT p.id, LEFT(p.content, 60) as preview, a.slug
FROM "Post" p
JOIN "Arena" a ON p."arenaId" = a.id
WHERE p.content NOT LIKE '**%'
AND a."isActive" = true;

-- 2. DELETAR comentários desses posts
DELETE FROM "Comment"
WHERE "postId" IN (
  SELECT p.id FROM "Post" p
  JOIN "Arena" a ON p."arenaId" = a.id
  WHERE p.content NOT LIKE '**%'
  AND a."isActive" = true
);

-- 3. DELETAR os posts
DELETE FROM "Post"
WHERE id IN (
  SELECT p.id FROM "Post" p
  JOIN "Arena" a ON p."arenaId" = a.id
  WHERE p.content NOT LIKE '**%'
  AND a."isActive" = true
);

-- 4. ATUALIZAR contadores
UPDATE "Arena" a SET
  "totalPosts" = (SELECT COUNT(*) FROM "Post" WHERE "arenaId" = a.id),
  "totalComments" = (SELECT COUNT(*) FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = a.id)
WHERE a."isActive" = true;

-- 5. VERIFICAR resultado
SELECT a.slug, a."totalPosts", a."totalComments"
FROM "Arena" a
WHERE a."isActive" = true AND a."totalPosts" > 0
ORDER BY a."totalPosts" DESC;
